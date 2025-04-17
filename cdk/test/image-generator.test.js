"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = require("aws-cdk-lib");
const assertions_1 = require("aws-cdk-lib/assertions");
const ImageGenerator = require("../lib/image-generator-stack");
test('Stack Creates Required Resources', () => {
    const app = new cdk.App();
    const stack = new ImageGenerator.ImageGeneratorStack(app, 'TestStack');
    const template = assertions_1.Template.fromStack(stack);
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
        Layers: assertions_1.Match.arrayWith([
            assertions_1.Match.stringLikeRegexp('arn:aws:lambda:.*:layer:Klayers-p312-Pillow:5')
        ])
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1hZ2UtZ2VuZXJhdG9yLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbWFnZS1nZW5lcmF0b3IudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1DQUFtQztBQUNuQyx1REFBeUQ7QUFDekQsK0RBQStEO0FBRS9ELElBQUksQ0FBQyxrQ0FBa0MsRUFBRSxHQUFHLEVBQUU7SUFDNUMsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDMUIsTUFBTSxLQUFLLEdBQUcsSUFBSSxjQUFjLENBQUMsbUJBQW1CLENBQUMsR0FBRyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBQ3ZFLE1BQU0sUUFBUSxHQUFHLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBRTNDLGlCQUFpQjtJQUNqQixRQUFRLENBQUMscUJBQXFCLENBQUMsaUJBQWlCLEVBQUU7UUFDaEQsdUJBQXVCLEVBQUU7WUFDdkIsTUFBTSxFQUFFLFNBQVM7U0FDbEI7S0FDRixDQUFDLENBQUM7SUFFSCxrQkFBa0I7SUFDbEIsUUFBUSxDQUFDLHFCQUFxQixDQUFDLDJCQUEyQixFQUFFO1FBQzFELFdBQVcsRUFBRSx5Q0FBeUM7UUFDdEQsa0JBQWtCLEVBQUUsQ0FBQyxZQUFZLENBQUM7S0FDbkMsQ0FBQyxDQUFDO0lBRUgsdUJBQXVCO0lBQ3ZCLFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQyx1QkFBdUIsRUFBRTtRQUN0RCxPQUFPLEVBQUUsWUFBWTtRQUNyQixPQUFPLEVBQUUsZ0NBQWdDO1FBQ3pDLE9BQU8sRUFBRSxFQUFFO1FBQ1gsVUFBVSxFQUFFLEdBQUc7UUFDZixNQUFNLEVBQUUsa0JBQUssQ0FBQyxTQUFTLENBQUM7WUFDdEIsa0JBQUssQ0FBQyxnQkFBZ0IsQ0FBQywrQ0FBK0MsQ0FBQztTQUN4RSxDQUFDO0tBQ0gsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgVGVtcGxhdGUsIE1hdGNoIH0gZnJvbSAnYXdzLWNkay1saWIvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgKiBhcyBJbWFnZUdlbmVyYXRvciBmcm9tICcuLi9saWIvaW1hZ2UtZ2VuZXJhdG9yLXN0YWNrJztcblxudGVzdCgnU3RhY2sgQ3JlYXRlcyBSZXF1aXJlZCBSZXNvdXJjZXMnLCAoKSA9PiB7XG4gIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gIGNvbnN0IHN0YWNrID0gbmV3IEltYWdlR2VuZXJhdG9yLkltYWdlR2VuZXJhdG9yU3RhY2soYXBwLCAnVGVzdFN0YWNrJyk7XG4gIGNvbnN0IHRlbXBsYXRlID0gVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKTtcblxuICAvLyBUZXN0IFMzIEJ1Y2tldFxuICB0ZW1wbGF0ZS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6UzM6OkJ1Y2tldCcsIHtcbiAgICBWZXJzaW9uaW5nQ29uZmlndXJhdGlvbjoge1xuICAgICAgU3RhdHVzOiAnRW5hYmxlZCdcbiAgICB9XG4gIH0pO1xuXG4gIC8vIFRlc3QgRm9udCBMYXllclxuICB0ZW1wbGF0ZS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6TGFtYmRhOjpMYXllclZlcnNpb24nLCB7XG4gICAgRGVzY3JpcHRpb246ICdGb250IGNvbmZpZ3VyYXRpb24gYW5kIERlamFWdSBTYW5zIGZvbnQnLFxuICAgIENvbXBhdGlibGVSdW50aW1lczogWydweXRob24zLjEyJ11cbiAgfSk7XG5cbiAgLy8gVGVzdCBMYW1iZGEgRnVuY3Rpb25cbiAgdGVtcGxhdGUuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkxhbWJkYTo6RnVuY3Rpb24nLCB7XG4gICAgUnVudGltZTogJ3B5dGhvbjMuMTInLFxuICAgIEhhbmRsZXI6ICdsYW1iZGFfZnVuY3Rpb24ubGFtYmRhX2hhbmRsZXInLFxuICAgIFRpbWVvdXQ6IDMwLFxuICAgIE1lbW9yeVNpemU6IDI1NixcbiAgICBMYXllcnM6IE1hdGNoLmFycmF5V2l0aChbXG4gICAgICBNYXRjaC5zdHJpbmdMaWtlUmVnZXhwKCdhcm46YXdzOmxhbWJkYTouKjpsYXllcjpLbGF5ZXJzLXAzMTItUGlsbG93OjUnKVxuICAgIF0pXG4gIH0pO1xufSk7XG5cbiJdfQ==