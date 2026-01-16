#!/bin/bash

# Exit on error
set -e

# Configuration
PROJECT_ID=${GOOGLE_CLOUD_PROJECT:-"your-project-id"}
REGION=${REGION:-"us-central1"}
SERVICE_NAME="spc-easter-2026"
IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME"

echo "Building and deploying to Cloud Run..."
echo "Project: $PROJECT_ID"
echo "Region: $REGION"
echo "Service: $SERVICE_NAME"

# Build the container image
echo "Building Docker image..."
gcloud builds submit --tag $IMAGE_NAME

# Deploy to Cloud Run
echo "Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --image $IMAGE_NAME \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10

echo "Deployment complete!"
echo "Your service is available at:"
gcloud run services describe $SERVICE_NAME --platform managed --region $REGION --format 'value(status.url)'
