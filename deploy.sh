#!/bin/bash

# Exit on error
set -e

# Load environment variables from .env if it exists
if [ -f .env ]; then
  echo "Loading Firebase configuration from .env file..."
  export $(grep -v '^#' .env | grep 'VITE_FIREBASE' | xargs)
fi

# Configuration
PROJECT_ID=${GOOGLE_CLOUD_PROJECT:-"your-project-id"}
REGION=${REGION:-"us-east4"}
SERVICE_NAME="spc-easter-2026"

# Check for required Firebase environment variables
if [ -z "$VITE_FIREBASE_API_KEY" ] || [ -z "$VITE_FIREBASE_PROJECT_ID" ]; then
  echo "ERROR: Firebase configuration not found!"
  echo ""
  echo "Please set the following environment variables or create a .env file:"
  echo "  VITE_FIREBASE_API_KEY"
  echo "  VITE_FIREBASE_AUTH_DOMAIN"
  echo "  VITE_FIREBASE_PROJECT_ID"
  echo "  VITE_FIREBASE_STORAGE_BUCKET"
  echo "  VITE_FIREBASE_MESSAGING_SENDER_ID"
  echo "  VITE_FIREBASE_APP_ID"
  echo ""
  echo "See FIREBASE_SETUP.md for detailed instructions."
  exit 1
fi

echo "Building and deploying to Cloud Run..."
echo "Project: $PROJECT_ID"
echo "Region: $REGION"
echo "Service: $SERVICE_NAME"
echo "Firebase Project: $VITE_FIREBASE_PROJECT_ID"

# Build using Cloud Build with Firebase configuration
echo "Building with Cloud Build..."
gcloud builds submit --config cloudbuild.yaml \
  --substitutions=\
_FIREBASE_API_KEY="$VITE_FIREBASE_API_KEY",\
_FIREBASE_AUTH_DOMAIN="$VITE_FIREBASE_AUTH_DOMAIN",\
_FIREBASE_PROJECT_ID="$VITE_FIREBASE_PROJECT_ID",\
_FIREBASE_STORAGE_BUCKET="$VITE_FIREBASE_STORAGE_BUCKET",\
_FIREBASE_MESSAGING_SENDER_ID="$VITE_FIREBASE_MESSAGING_SENDER_ID",\
_FIREBASE_APP_ID="$VITE_FIREBASE_APP_ID"

echo ""
echo "Deployment complete!"
echo "Your service is available at:"
gcloud run services describe $SERVICE_NAME --platform managed --region $REGION --format 'value(status.url)'
