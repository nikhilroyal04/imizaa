# Cloudinary Setup for Image Uploads

This document explains how to set up Cloudinary for image uploads in the Imiiza application.

## Prerequisites

1. Create a Cloudinary account at [https://cloudinary.com/](https://cloudinary.com/)
2. Get your Cloudinary credentials from the Dashboard

## Configuration

1. Copy the `.env.local.example` file to `.env.local`:

```bash
cp .env.local.example .env.local
```

2. Fill in your Cloudinary credentials in the `.env.local` file:

```
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

You can find these values in your Cloudinary dashboard.

## How It Works

1. When a user submits a form with images, the images are first uploaded to Cloudinary
2. Cloudinary returns secure HTTPS URLs for the uploaded images
3. These URLs are then stored in MongoDB along with the application data
4. Images are served directly from Cloudinary's CDN, providing fast loading times

## Benefits

- Secure HTTPS URLs for all images
- Automatic image optimization
- CDN distribution for faster loading
- No need to store images on your server
- Image transformations (resize, crop, etc.) on the fly

## Troubleshooting

If you encounter issues with image uploads:

1. Check that your Cloudinary credentials are correct
2. Ensure your Cloudinary account has enough credits/bandwidth
3. Check the server logs for detailed error messages
4. Verify that the file size is within limits (currently set to 10MB)

## Additional Resources

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Cloudinary Node.js SDK](https://cloudinary.com/documentation/node_integration)
