# AWS Lambda Custom Font Image Generator 

A serverless application that generates images with custom text using AWS Lambda, deployed with AWS CDK. The application uses [DejaVu Sans](https://dejavu-fonts.github.io/) font and the Pillow library for image manipulation.

## Architecture Overview

The application consists of:
- AWS Lambda function for image generation
- Two Lambda layers:
  - Custom font configuration layer
  - Pillow library layer (provided by [Klayers](https://github.com/keithrozario/Klayers))
- S3 bucket for storing generated images
- IAM roles and permissions

## Prerequisites

- AWS Account and configured AWS CLI
- Configured AWS CLI user with permissions to the required AWS services
- Node.js 18+ and npm
- Python 3.12
- Docker
- AWS CDK CLI (`npm install -g aws-cdk`)

## Instructions

### 1. Clone the repository:
```bash
git clone https://github.com/yourusername/aws-lambda-image-generator.git
cd aws-lambda-image-generator
```

### 2. Install dependencies

```bash
npm install
```


```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Build the font layer
#### Create layer directory
```bash
mkdir -p layer/fonts/python
```

#### Copy font files
```bash
cp fonts/*.ttf layer/fonts/python/
```

#### Create and activate virtual environment for layer
```bash
python -m venv layer/fonts/venv
source layer/fonts/venv/bin/activate  # On Windows: layer\fonts\venv\Scripts\activate
```

#### Install required packages for layer
```bash
pip install -r layer/fonts/requirements.txt -t layer/fonts/python
```

#### Deactivate virtual environment
```bash
deactivate
```

### 4. Deploy the application
```bash
cdk bootstrap   
cdk deploy
```


## Sample Usage
```
import boto3
import json

lambda_client = boto3.client('lambda')
response = lambda_client.invoke(
    FunctionName='ImageGeneratorFunction',
    InvocationType='RequestResponse',
    Payload=json.dumps({
        "text": "Hello World",
        "font_size": 48
    })
)
```

## Monitoring and Security
- CloudWatch Logs are automatically created
- Resources use least-privilege IAM roles
- S3 bucket is encrypted with SSE-S3
- CloudWatch metrics and alarms available for monitoring


## Acknowledgments & Dependencies

This project uses:

[Klayers](https://github.com/keithrozario/Klayers) - AWS Lambda Layers for Pillow Python packages (Apache License 2.0)
Used for providing the Pillow library layer in AWS Lambda
Layer ARN: [arn:aws:lambda:us-west-2:770693421928:layer:Klayers-p312-Pillow:5, arn:aws:lambda:us-east-1:770693421928:layer:Klayers-p312-Pillow:5]
