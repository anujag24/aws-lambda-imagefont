import boto3
import json
import time
from PIL import Image
from io import BytesIO

def test_deployed_function():
    # Initialize AWS clients
    lambda_client = boto3.client('lambda')
    s3_client = boto3.client('s3')
    
    # Load test event
    with open('tests/events/test_event.json', 'r') as f:
        test_event = json.load(f)
    
    # Invoke Lambda function
    response = lambda_client.invoke(
        FunctionName='ImageGeneratorStack-ImageGenerator',
        InvocationType='RequestResponse',
        Payload=json.dumps(test_event)
    )
    
    # Parse response
    result = json.loads(response['Payload'].read())
    print("Lambda response:", json.dumps(result, indent=2))
    
    if result['statusCode'] == 200:
        # Download and verify the generated image
        file_name = result['body']['file_name']
        bucket_name = result['body']['bucket']
        
        # Wait briefly for S3 consistency
        time.sleep(2)
        
        # Get the image from S3
        image_obj = s3_client.get_object(
            Bucket=bucket_name,
            Key=file_name
        )
        image_data = image_obj['Body'].read()
        
        # Verify image
        img = Image.open(BytesIO(image_data))
        print(f"Image size: {img.size}")
        print(f"Image mode: {img.mode}")
        
        # Save locally for inspection
        img.save(f"test_output_{file_name}")
        print(f"Image saved locally as: test_output_{file_name}")
    
    return result

if __name__ == "__main__":
    test_deployed_function()

