import * as cdk from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import * as ImageGenerator from '../lib/image-generator-stack';

test('Stack Creates Required Resources', () => {
  const app = new cdk.App();
  const stack = new ImageGenerator.ImageGeneratorStack(app, 'TestStack');
  const template = Template.fromStack(stack);

  // Test S3 Bucket
  template.hasResourceProperties('AWS::S3::Bucket', {
    VersioningConfiguration: {
      Status: 'Enabled'
    }
  });

  // Test Font Layer
  template.hasResourceProperties('AWS::Lambda::LayerVersion', {
    Description: 'Font configuration and DejaVu Sans font',
    CompatibleRuntimes: ['python3.12']
  });

  // Test Lambda Function
  template.hasResourceProperties('AWS::Lambda::Function', {
    Runtime: 'python3.12',
    Handler: 'lambda_function.lambda_handler',
    Timeout: 30,
    MemorySize: 256,
    Layers: Match.arrayWith([
      Match.stringLikeRegexp('arn:aws:lambda:.*:layer:Klayers-p312-Pillow:5')
    ])
  });
});

