import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { InfrastructureStack } from './infrastructure/stack';

const app = new cdk.App();
new InfrastructureStack(app, 'YouTube-Player-App-Infrastructure');
