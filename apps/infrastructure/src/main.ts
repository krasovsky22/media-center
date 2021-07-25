import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { InfrastructureStack } from './infrastructure/stack';
import { default as parameters } from './environments/environment';

const app = new cdk.App();
new InfrastructureStack(app, parameters.name, parameters);
