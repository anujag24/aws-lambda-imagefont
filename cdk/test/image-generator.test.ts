import * as cdk from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import * as ImageGenerator from '../lib/image-generator-stack';

describe('ImageGeneratorStack', () => {
  test('Stack Creates Required Resources', () => {
    const app = new cdk.App();
    const stack = new ImageGenerator.ImageGeneratorStack(app, 'TestStack', {
      env: {
        account: '123456789012',
        region: 'us-west-2',
      },
      pillowLayerArn: 'arn:aws:lambda:us-west-2:770693421928:layer:Klayers-p312-Pillow:5'
    });
    
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::S3::Bucket', {
      VersioningConfiguration: {
        Status: 'Enabled'
      }
    });

    template.hasResourceProperties('AWS::Lambda::LayerVersion', {
      Description: 'Font configuration and DejaVu Sans font',
      CompatibleRuntimes: ['python3.12']
    });

    template.hasResourceProperties('AWS::Lambda::Function', {
      Runtime: 'python3.12',
      Handler: 'lambda_function.lambda_handler',
      Timeout: 30,
      MemorySize: 256
    });
  });
});
