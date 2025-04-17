import pytest
import json
import os
from src.lambda_function import lambda_handler
from PIL import Image
import boto3
from io import BytesIO

def test_lambda_handler_success(s3_client):
    # Load test event
    with open('tests/events/test_event.json', 'r') as f:
        event = json.load(f)
    
    # Call lambda handler
    response = lambda_handler(event, None)
    
    # Assert response structure
    assert response['statusCode'] == 200
    assert 'body' in response
    assert 'file_name' in response['body']
    
    # Get the generated image from S3
    file_name = response['body']['file_name']
    image_data = s3_client.get_object(
        Bucket='test-bucket',
        Key=file_name
    )['Body'].read()
    
    # Verify image properties
    img = Image.open(BytesIO(image_data))
    assert img.size == (event['width'], event['height'])
    assert img.mode == 'RGB'

def test_lambda_handler_invalid_params():
    # Test with invalid parameters
    event = {
        'width': 'invalid',
        'height': 'invalid'
    }
    
    response = lambda_handler(event, None)
    assert response['statusCode'] == 500

def test_lambda_handler_missing_params():
    # Test with minimal parameters
    event = {
        'text': 'Test'
    }
    
    response = lambda_handler(event, None)
    assert response['statusCode'] == 200

def test_image_dimensions():
    event = {
        'text': 'Test',
        'width': 800,
        'height': 600
    }
    
    response = lambda_handler(event, None)
    assert response['statusCode'] == 200

