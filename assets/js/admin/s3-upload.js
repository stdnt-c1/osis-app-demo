import { showNotification } from './utils.js';
import { AWS_S3_BUCKET_NAME, AWS_REGION } from './config.js';

// This function would typically call your backend to get a pre-signed URL
// For this demo, we'll simulate it.
async function getPresignedUrl(fileName, fileType) {
    // In a real application, this would be an API call to your server
    // const response = await fetch('/api/get-presigned-url', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ fileName, fileType })
    // });
    // const data = await response.json();
    // return data.uploadUrl;

    // Simulate a pre-signed URL for demo purposes
    // In a real scenario, you'd need a backend to generate a secure, temporary URL.
    // For direct browser upload to S3, the CORS configuration on your S3 bucket
    // must allow PUT requests from your domain.
    const bucketName = AWS_S3_BUCKET_NAME; 
    const region = AWS_REGION; 
    const simulatedUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${fileName}`;
    return simulatedUrl;
}

export async function uploadFileToS3(file) {
    if (!file) {
        showNotification('No file selected.', 'error');
        return null;
    }

    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    const fileType = file.type;

    try {
        const uploadUrl = await getPresignedUrl(fileName, fileType);

        if (!uploadUrl) {
            showNotification('Failed to get upload URL.', 'error');
            return null;
        }

        // Simulate S3 upload using fetch. In a real scenario, you might use AWS SDK.
        const response = await fetch(uploadUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': fileType,
                'x-amz-acl': 'public-read' // Or private, depending on your needs
            },
            body: file,
        });

        if (response.ok) {
            showNotification('File uploaded successfully!', 'success');
            // Return the public URL of the uploaded file
            return uploadUrl.split('?')[0]; // Remove query parameters if any
        } else {
            const errorText = await response.text();
            showNotification(`File upload failed: ${response.statusText} - ${errorText}`, 'error');
            console.error('S3 Upload Error:', response.status, response.statusText, errorText);
            return null;
        }
    } catch (error) {
        showNotification(`Error during file upload: ${error.message}`, 'error');
        console.error('Upload process error:', error);
        return null;
    }
}
