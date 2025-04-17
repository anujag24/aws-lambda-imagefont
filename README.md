# AWS Lambda Image Generator

A serverless application that generates images with custom text using AWS Lambda, deployed with AWS CDK. The application uses DejaVu Sans font and the Pillow library for image manipulation.

## Architecture

![Architecture Diagram](docs/architecture.png)

The application consists of:
- AWS Lambda function for image generation
- Two Lambda layers:
  - Custom font configuration layer
  - Pillow library layer (from public ARN)
- S3 bucket for storing generated images
- IAM roles and permissions

## Prerequisites

- AWS Account and configured AWS CLI
- Node.js 18+ and npm
- Python 3.12
- Docker
- AWS CDK CLI (`npm install -g aws-cdk`)

## Testing

### Unit Tests
Run the unit tests with coverage:
```bash
make test


## Project Structure


