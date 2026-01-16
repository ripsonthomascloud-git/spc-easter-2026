# Cloud Run Deployment Guide

This guide explains how to deploy the SPC Easter 2026 Registration application to Google Cloud Run.

## Prerequisites

1. **Google Cloud Project**: You need an active GCP project
2. **Google Cloud SDK**: Install from https://cloud.google.com/sdk/docs/install
3. **Docker**: Install from https://docs.docker.com/get-docker/
4. **Required APIs**: Enable the following APIs in your GCP project:
   - Cloud Run API
   - Cloud Build API
   - Container Registry API

```bash
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

## Configuration

1. **Set your GCP Project ID**:
```bash
export GOOGLE_CLOUD_PROJECT="your-project-id"
gcloud config set project $GOOGLE_CLOUD_PROJECT
```

2. **Configure Firebase** (if needed):
   - Update `src/firebase/config.js` with your Firebase credentials
   - Ensure Firebase configuration is in place before building

## Deployment Options

### Option 1: Using the Deploy Script (Recommended)

The easiest way to deploy:

```bash
# Make the script executable
chmod +x deploy.sh

# Set your project ID
export GOOGLE_CLOUD_PROJECT="your-project-id"

# Run the deployment
./deploy.sh
```

### Option 2: Using Cloud Build

Deploy using the `cloudbuild.yaml` configuration:

```bash
gcloud builds submit --config cloudbuild.yaml
```

### Option 3: Manual Deployment

Step-by-step manual deployment:

```bash
# 1. Build the Docker image
docker build -t gcr.io/$GOOGLE_CLOUD_PROJECT/spc-easter-2026 .

# 2. Push to Google Container Registry
docker push gcr.io/$GOOGLE_CLOUD_PROJECT/spc-easter-2026

# 3. Deploy to Cloud Run
gcloud run deploy spc-easter-2026 \
  --image gcr.io/$GOOGLE_CLOUD_PROJECT/spc-easter-2026 \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi
```

## Configuration Options

### Resource Limits

Adjust these in `cloudbuild.yaml` or `deploy.sh`:

- **Memory**: Default is 512Mi, can be increased to 1Gi, 2Gi, etc.
- **CPU**: Default is 1, can be increased to 2, 4, etc.
- **Max Instances**: Default is 10, adjust based on traffic expectations
- **Min Instances**: Default is 0 (scales to zero), set to 1+ for faster response times

### Authentication

By default, the service is deployed with `--allow-unauthenticated` for public access.

To require authentication:
```bash
# Remove --allow-unauthenticated from deploy commands
# Or update after deployment:
gcloud run services update spc-easter-2026 \
  --region us-central1 \
  --no-allow-unauthenticated
```

### Custom Domain

To use a custom domain:

```bash
gcloud run domain-mappings create \
  --service spc-easter-2026 \
  --domain your-domain.com \
  --region us-central1
```

## Testing Locally with Docker

Test the Docker container locally before deploying:

```bash
# Build the image
docker build -t spc-easter-2026-local .

# Run locally on port 8080
docker run -p 8080:8080 spc-easter-2026-local

# Access at http://localhost:8080
```

## Continuous Deployment

### GitHub Integration

Set up automatic deployments from GitHub:

```bash
# Connect your repository
gcloud run services update spc-easter-2026 \
  --source . \
  --region us-central1
```

### Cloud Build Triggers

Create a trigger for automatic deployments:

1. Go to Cloud Build > Triggers in GCP Console
2. Click "Create Trigger"
3. Select your repository
4. Set build configuration to `cloudbuild.yaml`
5. Configure trigger on push to main branch

## Monitoring and Logs

### View Logs
```bash
gcloud run logs read spc-easter-2026 --region us-central1
```

### Service Details
```bash
gcloud run services describe spc-easter-2026 --region us-central1
```

### Get Service URL
```bash
gcloud run services describe spc-easter-2026 \
  --platform managed \
  --region us-central1 \
  --format 'value(status.url)'
```

## Troubleshooting

### Build Fails

- Check that all dependencies are correctly specified in `package.json`
- Verify Node.js version compatibility
- Check Docker build logs: `gcloud builds log [BUILD_ID]`

### Deployment Fails

- Ensure required APIs are enabled
- Verify IAM permissions
- Check Cloud Run service logs

### Application Not Loading

- Verify nginx configuration in `nginx.conf`
- Check that port 8080 is exposed
- Review Cloud Run logs for errors

## Cost Optimization

- **Set min-instances to 0**: Allows scaling to zero when not in use
- **Use appropriate memory**: Start with 512Mi, monitor and adjust
- **Set max-instances**: Prevent runaway costs from unexpected traffic
- **Enable Cloud CDN**: Cache static assets for better performance and lower costs

## Security Best Practices

1. **Use Secret Manager** for sensitive data like API keys
2. **Enable VPC Connector** if accessing private resources
3. **Set up Cloud Armor** for DDoS protection
4. **Use IAM** for service-to-service authentication
5. **Enable Cloud Audit Logs** for compliance

## Support

For issues or questions:
- Check Cloud Run documentation: https://cloud.google.com/run/docs
- Review application logs
- Verify Firebase configuration
