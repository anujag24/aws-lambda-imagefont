# Copyright 2024 Anuj Gupta
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.


import os
import boto3
from PIL import Image, ImageDraw, ImageFont
from io import BytesIO
from datetime import datetime

def lambda_handler(event, context):
    try:
        # Set the library path
        os.environ['LD_LIBRARY_PATH'] = '/opt/lib64'
        
        # Initialize S3 client
        s3 = boto3.client('s3')
        
        # Get S3 bucket name from environment variable
        bucket_name = os.environ['S3_BUCKET_NAME']
        
        # Get parameters from event or use defaults
        text = event.get('text', 'Hello, World!')
        width = event.get('width', 300)
        height = event.get('height', 100)
        font_size = event.get('font_size', 32)
        bg_color = event.get('background_color', 'white')
        text_color = event.get('text_color', 'black')
        
        # Create an image
        img = Image.new('RGB', (width, height), color=bg_color)
        draw = ImageDraw.Draw(img)
        
        # Use DejaVuSans font
        font_path = '/opt/fonts/DejaVuSans.ttf'
        font = ImageFont.truetype(font_path, font_size)
        
        # Calculate text size and center it
        text_bbox = draw.textbbox((0, 0), text, font=font)
        text_width = text_bbox[2] - text_bbox[0]
        text_height = text_bbox[3] - text_bbox[1]
        x = (width - text_width) // 2
        y = (height - text_height) // 2
        
        # Draw text
        draw.text((x, y), text, font=font, fill=text_color)
        
        # Generate filename
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        file_name = f'generated_image_{timestamp}.png'
        
        # Save to BytesIO and upload to S3
        img_byte_array = BytesIO()
        img.save(img_byte_array, format='PNG')
        img_byte_array.seek(0)
        
        # Upload to S3
        s3.upload_fileobj(
            img_byte_array,
            bucket_name,
            file_name,
            ExtraArgs={
                'ContentType': 'image/png',
                'Metadata': {
                    'text': text,
                    'width': str(width),
                    'height': str(height)
                }
            }
        )
        
        return {
            'statusCode': 200,
            'body': {
                'message': 'Image uploaded successfully',
                'bucket': bucket_name,
                'file_name': file_name
            }
        }
    except Exception as e:
        import traceback
        return {
            'statusCode': 500,
            'body': {
                'error': str(e),
                'traceback': traceback.format_exc()
            }
        }

