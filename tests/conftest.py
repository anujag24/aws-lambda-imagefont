import pytest
import boto3
from moto import mock_s3
import os

@pytest.fixture
def aws_credentials():
    """Mocked AWS Credentials for moto."""
    os.environ['AWS_ACCESS_KEY_ID'] = 'testing'
    os.environ['AWS_SECRET_ACCESS_KEY'] = 'testing'
    os.environ['AWS_SECURITY_TOKEN'] = 'testing'
    os.environ['AWS_SESSION_TOKEN'] = 'testing'
    os.environ['S3_BUCKET_NAME'] = 'test-bucket'

@pytest.fixture
def s3_client(aws_credentials):
    with mock_s3():
        s3 = boto3.client('s3', region_name='us-west-2')
        # Create test bucket
        s3.create_bucket(
            Bucket='test-bucket',
            CreateBucketConfiguration={'LocationConstraint': 'us-west-2'}
        )
        yield s3

