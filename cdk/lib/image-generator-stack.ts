import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import * as path from 'path';

export class ImageGeneratorStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create S3 bucket for storing generated images
    const bucket = new s3.Bucket(this, 'ImageBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY, // For development - change for production
      autoDeleteObjects: true, // For development - change for production
      versioned: true,
    });

    // Create custom font Lambda layer
    const fontLayer = new lambda.LayerVersion(this, 'FontConfigLayer', {
      code: lambda.Code.fromAsset(path.join(__dirname, '../../layer'), {
        bundling: {
          image: cdk.DockerImage.fromRegistry('public.ecr.aws/amazonlinux/amazonlinux:2023'),
          command: [
            'bash', '-c', `
              dnf install -y fontconfig dejavu-sans-fonts zip findutils &&
              mkdir -p /asset-output/fonts /asset-output/lib64 &&
              echo '<?xml version="1.0"?><!DOCTYPE fontconfig SYSTEM "fonts.dtd"><fontconfig><dir>/var/task/fonts</dir></fontconfig>' > /asset-output/fonts/fonts.conf &&
              font_path=$(find /usr/share/fonts -name "DejaVuSans.ttf" | head -n 1) &&
              if [ -n "$font_path" ]; then
                cp "$font_path" /asset-output/fonts/;
              else
                echo "DejaVuSans.ttf not found" && exit 1;
              fi &&
              cp -P /usr/lib64/libfontconfig.so* /asset-output/lib64/ &&
              cp -P /usr/lib64/libfreetype.so* /asset-output/lib64/ &&
              cp -P /usr/lib64/libexpat.so* /asset-output/lib64/ &&
              cp -P /usr/lib64/libuuid.so* /asset-output/lib64/
            `
          ],
          user: 'root'
        },
      }),
      description: 'Font configuration and DejaVu Sans font',
      compatibleRuntimes: [lambda.Runtime.PYTHON_3_12],
    });

    // Reference existing Pillow layer
    const pillowLayer = lambda.LayerVersion.fromLayerVersionArn(
      this,
      'PillowLayer',
      'arn:aws:lambda:us-east-1:770693421928:layer:Klayers-p312-Pillow:5'
    );

    // Create Lambda function
    const lambdaFunction = new lambda.Function(this, 'ImageGenerator', {
      runtime: lambda.Runtime.PYTHON_3_12,
      handler: 'lambda_function.lambda_handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../../src')), // No need to bundle Pillow anymore
      layers: [fontLayer, pillowLayer], // Add both layers
      environment: {
        S3_BUCKET_NAME: bucket.bucketName,
      },
      timeout: cdk.Duration.seconds(30),
      memorySize: 256,
    });

    // Grant S3 permissions to Lambda
    bucket.grantWrite(lambdaFunction);

    // Output the bucket name, function name, and layer ARNs
    new cdk.CfnOutput(this, 'BucketName', {
      value: bucket.bucketName,
      description: 'Name of the S3 bucket for storing generated images',
    });

    new cdk.CfnOutput(this, 'FunctionName', {
      value: lambdaFunction.functionName,
      description: 'Name of the Lambda function',
    });

    new cdk.CfnOutput(this, 'FontLayerArn', {
      value: fontLayer.layerVersionArn,
      description: 'ARN of the font configuration layer',
    });

    new cdk.CfnOutput(this, 'PillowLayerArn', {
      value: pillowLayer.layerVersionArn,
      description: 'ARN of the Pillow layer',
    });
  }
}
