import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as s3deploy from '@aws-cdk/aws-s3-deployment';
import * as cloudFront from '@aws-cdk/aws-cloudfront';
import * as cognito from '@aws-cdk/aws-cognito';
import * as appsync from '@aws-cdk/aws-appsync';
import * as ddb from '@aws-cdk/aws-dynamodb';
import * as lambda from '@aws-cdk/aws-lambda';
import { ClientAttributes, StringAttribute } from '@aws-cdk/aws-cognito';

export class InfrastructureStack extends cdk.Stack {
  constructor(
    scope: cdk.Construct,
    id: string,
    parameters: Record<string, string>,
    props?: cdk.StackProps
  ) {
    super(scope, id, props);

    // Add S3 Bucket
    const s3Site = new s3.Bucket(this, `aws-youtube-player`, {
      bucketName: parameters.codeBuckedName,
      publicReadAccess: true,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
    });

    //force remove s3 bucket on destroy
    const cfnBucket = s3Site.node.findChild('Resource') as cdk.CfnResource;
    cfnBucket.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);

    this.enableCorsOnBucket(s3Site);

    // Create a new CloudFront Distribution
    const distribution = new cloudFront.CloudFrontWebDistribution(
      this,
      parameters.cloudfrontName,
      {
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: s3Site,
            },
            behaviors: [
              {
                isDefaultBehavior: true,
                compress: true,
                allowedMethods: cloudFront.CloudFrontAllowedMethods.ALL,
                cachedMethods:
                  cloudFront.CloudFrontAllowedCachedMethods.GET_HEAD_OPTIONS,
                forwardedValues: {
                  queryString: true,
                  cookies: {
                    forward: 'none',
                  },
                  headers: [
                    'Access-Control-Request-Headers',
                    'Access-Control-Request-Method',
                    'Origin',
                  ],
                },
              },
            ],
          },
        ],
        comment: `AWS Youtube Player - CloudFront Distribution`,
        viewerProtocolPolicy: cloudFront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        errorConfigurations: [
          {
            errorCode: 403,
            errorCachingMinTtl: 3600,
            responseCode: 200,
            responsePagePath: '/index.html',
          },
        ],
      }
    );

    // Setup Bucket Deployment to automatically deploy new assets and invalidate cache
    new s3deploy.BucketDeployment(
      this,
      `aws-youtube-player-s3bucketdeployment`,
      {
        sources: [s3deploy.Source.asset(process.cwd() + '/dist/apps/web')],
        destinationBucket: s3Site,
        distribution: distribution,
        distributionPaths: ['/*'],
      }
    );

    const standardAttributes = {
      email: {
        required: true,
        mutable: false,
      },
    };

    const customAttributes: { [key: string]: cognito.ICustomAttribute } = {
      'google-refresh-token': new StringAttribute({ mutable: true }),
    };
    const customAttributesStrings = Object.keys(customAttributes);

    const clientCustomAttributes = new ClientAttributes()
      .withStandardAttributes({ email: true })
      .withCustomAttributes(...customAttributesStrings);

    //setup cognito
    const userPool = new cognito.UserPool(this, parameters.cognitoPoolName, {
      selfSignUpEnabled: true, //allow users to sign up
      autoVerify: { email: true }, // verify email addresses by sending a verification code
      userVerification: {
        emailSubject: 'Verify your email for YouTube Player app.',
        emailBody:
          'Thanks for signing up to youtube player app. Your verification code is {####}',
        emailStyle: cognito.VerificationEmailStyle.CODE,
      },
      signInAliases: {
        username: true,
        email: true,
      },
      passwordPolicy: {
        minLength: 8,
        requireDigits: true,
        requireSymbols: true,
        requireUppercase: true,
        requireLowercase: true,
      },
      standardAttributes,
      customAttributes,
      //remove userpool on destroy
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const oAuth: cognito.OAuthSettings = {
      callbackUrls: [
        `https://${distribution.distributionDomainName}`,
        process.env.NX_REACT_APP_APP_HOST ?? 'http://localhost:4200',
      ],
      logoutUrls: [
        process.env.NX_REACT_APP_APP_HOST ?? 'http://localhost:4200',
        `https://${distribution.distributionDomainName}`,
      ],
    };

    const userPoolClient = new cognito.UserPoolClient(this, 'web', {
      userPool,
      generateSecret: false,
      oAuth,
      writeAttributes: clientCustomAttributes,
      readAttributes: clientCustomAttributes,
    });

    //distribution should be created before user pool
    userPoolClient.node.addDependency(distribution);

    //create graphql api
    const api = new appsync.GraphqlApi(this, parameters.graphQLApiName, {
      name: parameters.graphQLApiName,
      logConfig: {
        fieldLogLevel: appsync.FieldLogLevel.ALL,
      },
      schema: appsync.Schema.fromAsset(
        process.cwd() + '/apps/infrastructure/src/graphql/schema.graphql'
      ),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: cdk.Expiration.after(cdk.Duration.days(365)),
          },
        },
        additionalAuthorizationModes: [
          {
            authorizationType: appsync.AuthorizationType.USER_POOL,
            userPoolConfig: {
              userPool,
            },
          },
        ],
      },
    });

    //create lambda function
    const favoriteLambda = new lambda.Function(
      this,
      parameters.graphQLLambdaFunctionName,
      {
        runtime: lambda.Runtime.NODEJS_12_X,
        handler: 'main.handler',
        code: lambda.Code.fromAsset(
          process.cwd() + '/dist/apps/lambda-functions'
        ),
        memorySize: 1024,
      }
    );

    //set the new Lambda function as a data source for the AppSync API
    const lambdaDs = api.addLambdaDataSource(
      'lambdaDataSource',
      favoriteLambda
    );

    //create resolvers
    lambdaDs.createResolver({
      typeName: 'Query',
      fieldName: 'listFavorites',
    });

    lambdaDs.createResolver({
      typeName: 'Mutation',
      fieldName: 'createFavorite',
    });

    lambdaDs.createResolver({
      typeName: 'Mutation',
      fieldName: 'deleteFavorite',
    });

    //create dynamoDB table
    const favoriteTable = new ddb.Table(this, parameters.dynamoDBTableName, {
      billingMode: ddb.BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'videoId',
        type: ddb.AttributeType.STRING,
      },
    });

    // favoriteTable.addGlobalSecondaryIndex({
    //   indexName: 'favoritesBySource',
    //   partitionKey: {
    //     name: 'source',
    //     type: ddb.AttributeType.STRING,
    //   },
    // });

    favoriteTable.grantFullAccess(favoriteLambda);

    favoriteLambda.addEnvironment('FAVORITE_TABLE', favoriteTable.tableName);

    // Final CloudFront URL
    new cdk.CfnOutput(this, 'CloudFront URL: ', {
      value: `https://${distribution.distributionDomainName}`,
    });

    new cdk.CfnOutput(this, 'UserPoolId: ', {
      value: userPool.userPoolId,
    });

    new cdk.CfnOutput(this, 'UserPoolClientId: ', {
      value: userPoolClient.userPoolClientId,
    });

    new cdk.CfnOutput(this, 'Region: ', {
      value: this.region,
    });

    new cdk.CfnOutput(this, 'GraphQLApiUrl: ', {
      value: api.graphqlUrl,
    });

    new cdk.CfnOutput(this, 'AppSyncAPIKey: ', {
      value: api.apiKey || '',
    });
  }

  /**
   * Enables CORS access on the given bucket
   *
   * @memberof CxpInfrastructureStack
   */
  enableCorsOnBucket = (bucket: s3.IBucket) => {
    const cfnBucket = bucket.node.findChild('Resource') as s3.CfnBucket;
    cfnBucket.addPropertyOverride('CorsConfiguration', {
      CorsRules: [
        {
          AllowedOrigins: ['*'],
          AllowedMethods: ['HEAD', 'GET', 'PUT', 'POST', 'DELETE'],
          ExposedHeaders: [
            'x-amz-server-side-encryption',
            'x-amz-request-id',
            'x-amz-id-2',
          ],
          AllowedHeaders: ['*'],
        },
      ],
    });
  };
}
