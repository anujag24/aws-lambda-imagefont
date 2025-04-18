/** Copyright 2024 [Your Name]
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
#
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License. **/

  
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
  pillowLayerArn: pillowLayerArn, // Pass the Pillow layer ARN to the stack
});

