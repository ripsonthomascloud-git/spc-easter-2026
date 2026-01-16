# PowerShell deployment script for Windows
# Exit on error
$ErrorActionPreference = "Stop"

# Load environment variables from .env if it exists
if (Test-Path .env) {
    Write-Host "Loading Firebase configuration from .env file..." -ForegroundColor Yellow
    Get-Content .env | ForEach-Object {
        if ($_ -match '^VITE_FIREBASE' -and $_ -notmatch '^#') {
            $name, $value = $_.Split('=', 2)
            Set-Item -Path "env:$name" -Value $value
        }
    }
}

# Configuration
$PROJECT_ID = if ($env:GOOGLE_CLOUD_PROJECT) { $env:GOOGLE_CLOUD_PROJECT } else { "your-project-id" }
$REGION = if ($env:REGION) { $env:REGION } else { "us-east4" }
$SERVICE_NAME = "spc-easter-2026"

# Check for required Firebase environment variables
if (-not $env:VITE_FIREBASE_API_KEY -or -not $env:VITE_FIREBASE_PROJECT_ID) {
    Write-Host "ERROR: Firebase configuration not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please set the following environment variables or create a .env file:" -ForegroundColor Yellow
    Write-Host "  VITE_FIREBASE_API_KEY"
    Write-Host "  VITE_FIREBASE_AUTH_DOMAIN"
    Write-Host "  VITE_FIREBASE_PROJECT_ID"
    Write-Host "  VITE_FIREBASE_STORAGE_BUCKET"
    Write-Host "  VITE_FIREBASE_MESSAGING_SENDER_ID"
    Write-Host "  VITE_FIREBASE_APP_ID"
    Write-Host ""
    Write-Host "See FIREBASE_SETUP.md for detailed instructions." -ForegroundColor Cyan
    exit 1
}

Write-Host "Building and deploying to Cloud Run..." -ForegroundColor Green
Write-Host "Project: $PROJECT_ID" -ForegroundColor Cyan
Write-Host "Region: $REGION" -ForegroundColor Cyan
Write-Host "Service: $SERVICE_NAME" -ForegroundColor Cyan
Write-Host "Firebase Project: $env:VITE_FIREBASE_PROJECT_ID" -ForegroundColor Cyan

# Build substitutions string
$substitutions = "_FIREBASE_API_KEY=$env:VITE_FIREBASE_API_KEY," +
    "_FIREBASE_AUTH_DOMAIN=$env:VITE_FIREBASE_AUTH_DOMAIN," +
    "_FIREBASE_PROJECT_ID=$env:VITE_FIREBASE_PROJECT_ID," +
    "_FIREBASE_STORAGE_BUCKET=$env:VITE_FIREBASE_STORAGE_BUCKET," +
    "_FIREBASE_MESSAGING_SENDER_ID=$env:VITE_FIREBASE_MESSAGING_SENDER_ID," +
    "_FIREBASE_APP_ID=$env:VITE_FIREBASE_APP_ID"

# Build using Cloud Build with Firebase configuration
Write-Host "`nBuilding with Cloud Build..." -ForegroundColor Yellow
gcloud builds submit --config cloudbuild.yaml --substitutions=$substitutions

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build/Deployment failed!" -ForegroundColor Red
    exit 1
}

Write-Host "`nDeployment complete!" -ForegroundColor Green
Write-Host "Your service is available at:" -ForegroundColor Cyan
gcloud run services describe $SERVICE_NAME --platform managed --region $REGION --format 'value(status.url)'
