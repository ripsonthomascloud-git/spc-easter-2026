# PowerShell deployment script for Windows
# Exit on error
$ErrorActionPreference = "Stop"

# Configuration
$PROJECT_ID = if ($env:GOOGLE_CLOUD_PROJECT) { $env:GOOGLE_CLOUD_PROJECT } else { "your-project-id" }
$REGION = if ($env:REGION) { $env:REGION } else { "us-central1" }
$SERVICE_NAME = "spc-easter-2026"
$IMAGE_NAME = "gcr.io/$PROJECT_ID/$SERVICE_NAME"

Write-Host "Building and deploying to Cloud Run..." -ForegroundColor Green
Write-Host "Project: $PROJECT_ID" -ForegroundColor Cyan
Write-Host "Region: $REGION" -ForegroundColor Cyan
Write-Host "Service: $SERVICE_NAME" -ForegroundColor Cyan

# Build the container image
Write-Host "`nBuilding Docker image..." -ForegroundColor Yellow
gcloud builds submit --tag $IMAGE_NAME

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}

# Deploy to Cloud Run
Write-Host "`nDeploying to Cloud Run..." -ForegroundColor Yellow
gcloud run deploy $SERVICE_NAME `
  --image $IMAGE_NAME `
  --platform managed `
  --region $REGION `
  --allow-unauthenticated `
  --port 8080 `
  --memory 512Mi `
  --cpu 1 `
  --min-instances 0 `
  --max-instances 10

if ($LASTEXITCODE -ne 0) {
    Write-Host "Deployment failed!" -ForegroundColor Red
    exit 1
}

Write-Host "`nDeployment complete!" -ForegroundColor Green
Write-Host "Your service is available at:" -ForegroundColor Cyan
gcloud run services describe $SERVICE_NAME --platform managed --region $REGION --format 'value(status.url)'
