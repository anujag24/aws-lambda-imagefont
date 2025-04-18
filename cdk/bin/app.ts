#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ImageGeneratorStack } from '../lib/image-generator-stack';

const app = new cdk.App();

// Define the Pillow layer ARN map
const pillowLayerArns: { [key: string]: string } = {
  'us-east-1': 'arn:aws:lambda:us-east-1:770693421928:layer:Klayers-p312-Pillow:5',
  'us-west-2': 'arn:aws:lambda:us-west-2:770693421928:layer:Klayers-p312-Pillow:5',
  // Add more regions as needed
};

// Get the deployment region
const deploymentRegion = process.env.CDK_DEFAULT_REGION || 'us-west-2';

// Get the Pillow layer ARN for the deployment region
const pillowLayerArn = pillowLayerArns[deploymentRegion];

if (!pillowLayerArn) {
  throw new Error(`No Pillow layer ARN configured for region ${deploymentRegion}`);
}

new ImageGeneratorStack(app, 'ImageGeneratorStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: deploymentRegion,
  },
  pillowLayerArn: pillowLayerArn,
});
