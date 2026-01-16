# Firebase Configuration for Cloud Run

## Problem
The Firebase authentication error occurs because environment variables are not available during the Docker build process. Vite bundles environment variables at **build time**, so they must be passed to the Docker build.

## Solution Overview
We've updated the Dockerfile and cloudbuild.yaml to accept Firebase configuration as build arguments. Now you need to configure these values in Google Cloud.

## Setup Instructions

### Method 1: Using Google Cloud Secret Manager (Recommended for Production)

This is the most secure approach for storing sensitive Firebase configuration.

#### Step 1: Store Firebase Config in Secret Manager

```bash
# Set your project ID
export PROJECT_ID="your-project-id"
gcloud config set project $PROJECT_ID

# Enable Secret Manager API
gcloud services enable secretmanager.googleapis.com

# Create secrets for each Firebase config value
echo -n "YOUR_FIREBASE_API_KEY" | gcloud secrets create firebase-api-key --data-file=-
echo -n "YOUR_PROJECT_ID.firebaseapp.com" | gcloud secrets create firebase-auth-domain --data-file=-
echo -n "YOUR_PROJECT_ID" | gcloud secrets create firebase-project-id --data-file=-
echo -n "YOUR_PROJECT_ID.appspot.com" | gcloud secrets create firebase-storage-bucket --data-file=-
echo -n "YOUR_MESSAGING_SENDER_ID" | gcloud secrets create firebase-messaging-sender-id --data-file=-
echo -n "YOUR_APP_ID" | gcloud secrets create firebase-app-id --data-file=-
```

#### Step 2: Grant Cloud Build Access to Secrets

```bash
# Get the Cloud Build service account
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')
CLOUD_BUILD_SA="${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com"

# Grant Secret Accessor role
gcloud secrets add-iam-policy-binding firebase-api-key \
  --member="serviceAccount:${CLOUD_BUILD_SA}" \
  --role="roles/secretmanager.secretAccessor"

gcloud secrets add-iam-policy-binding firebase-auth-domain \
  --member="serviceAccount:${CLOUD_BUILD_SA}" \
  --role="roles/secretmanager.secretAccessor"

gcloud secrets add-iam-policy-binding firebase-project-id \
  --member="serviceAccount:${CLOUD_BUILD_SA}" \
  --role="roles/secretmanager.secretAccessor"

gcloud secrets add-iam-policy-binding firebase-storage-bucket \
  --member="serviceAccount:${CLOUD_BUILD_SA}" \
  --role="roles/secretmanager.secretAccessor"

gcloud secrets add-iam-policy-binding firebase-messaging-sender-id \
  --member="serviceAccount:${CLOUD_BUILD_SA}" \
  --role="roles/secretmanager.secretAccessor"

gcloud secrets add-iam-policy-binding firebase-app-id \
  --member="serviceAccount:${CLOUD_BUILD_SA}" \
  --role="roles/secretmanager.secretAccessor"
```

#### Step 3: Update cloudbuild.yaml to Use Secrets

Add this to your cloudbuild.yaml before the steps section:

```yaml
availableSecrets:
  secretManager:
  - versionName: projects/$PROJECT_ID/secrets/firebase-api-key/versions/latest
    env: 'FIREBASE_API_KEY'
  - versionName: projects/$PROJECT_ID/secrets/firebase-auth-domain/versions/latest
    env: 'FIREBASE_AUTH_DOMAIN'
  - versionName: projects/$PROJECT_ID/secrets/firebase-project-id/versions/latest
    env: 'FIREBASE_PROJECT_ID'
  - versionName: projects/$PROJECT_ID/secrets/firebase-storage-bucket/versions/latest
    env: 'FIREBASE_STORAGE_BUCKET'
  - versionName: projects/$PROJECT_ID/secrets/firebase-messaging-sender-id/versions/latest
    env: 'FIREBASE_MESSAGING_SENDER_ID'
  - versionName: projects/$PROJECT_ID/secrets/firebase-app-id/versions/latest
    env: 'FIREBASE_APP_ID'
```

Then update the first step to use these secrets:

```yaml
steps:
  - name: 'gcr.io/cloud-builders/docker'
    secretEnv: ['FIREBASE_API_KEY', 'FIREBASE_AUTH_DOMAIN', 'FIREBASE_PROJECT_ID', 'FIREBASE_STORAGE_BUCKET', 'FIREBASE_MESSAGING_SENDER_ID', 'FIREBASE_APP_ID']
    args:
      - 'build'
      - '-t'
      - 'gcr.io/$PROJECT_ID/spc-easter-2026:$COMMIT_SHA'
      - '--build-arg'
      - 'VITE_FIREBASE_API_KEY=$$FIREBASE_API_KEY'
      - '--build-arg'
      - 'VITE_FIREBASE_AUTH_DOMAIN=$$FIREBASE_AUTH_DOMAIN'
      # ... rest of build args with $$ prefix
```

### Method 2: Using Substitution Variables (Simpler for Testing)

This method passes variables directly during the build command.

#### Deploy with Substitution Variables

```bash
gcloud builds submit --config cloudbuild.yaml \
  --substitutions=\
_FIREBASE_API_KEY="YOUR_API_KEY",\
_FIREBASE_AUTH_DOMAIN="YOUR_PROJECT.firebaseapp.com",\
_FIREBASE_PROJECT_ID="YOUR_PROJECT_ID",\
_FIREBASE_STORAGE_BUCKET="YOUR_PROJECT.appspot.com",\
_FIREBASE_MESSAGING_SENDER_ID="YOUR_SENDER_ID",\
_FIREBASE_APP_ID="YOUR_APP_ID"
```

#### Or Create a Cloud Build Trigger with Default Substitutions

1. Go to Cloud Build > Triggers in Google Cloud Console
2. Create a new trigger
3. Under "Substitution variables", add:
   - `_FIREBASE_API_KEY`: your-api-key
   - `_FIREBASE_AUTH_DOMAIN`: your-project.firebaseapp.com
   - `_FIREBASE_PROJECT_ID`: your-project-id
   - `_FIREBASE_STORAGE_BUCKET`: your-project.appspot.com
   - `_FIREBASE_MESSAGING_SENDER_ID`: your-sender-id
   - `_FIREBASE_APP_ID`: your-app-id

## Getting Your Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click the gear icon > Project settings
4. Under "Your apps", select your web app (or create one)
5. Copy the config values from the Firebase configuration object:

```javascript
const firebaseConfig = {
  apiKey: "...",              // _FIREBASE_API_KEY
  authDomain: "...",          // _FIREBASE_AUTH_DOMAIN
  projectId: "...",           // _FIREBASE_PROJECT_ID
  storageBucket: "...",       // _FIREBASE_STORAGE_BUCKET
  messagingSenderId: "...",   // _FIREBASE_MESSAGING_SENDER_ID
  appId: "..."                // _FIREBASE_APP_ID
};
```

## Testing Locally

To test locally with Docker:

```bash
# Build with your Firebase config
docker build \
  --build-arg VITE_FIREBASE_API_KEY="your-key" \
  --build-arg VITE_FIREBASE_AUTH_DOMAIN="your-domain" \
  --build-arg VITE_FIREBASE_PROJECT_ID="your-project" \
  --build-arg VITE_FIREBASE_STORAGE_BUCKET="your-bucket" \
  --build-arg VITE_FIREBASE_MESSAGING_SENDER_ID="your-sender-id" \
  --build-arg VITE_FIREBASE_APP_ID="your-app-id" \
  -t spc-easter-2026-local .

# Run locally
docker run -p 8080:8080 spc-easter-2026-local
```

## Verifying the Fix

After deploying with the correct configuration:

1. Check Cloud Build logs for successful build
2. Visit your Cloud Run URL
3. Open browser DevTools > Console
4. You should see "Firebase initialized successfully"
5. Try registering - authentication should work

## Troubleshooting

### Still getting authentication errors?

1. **Check Firebase configuration is correct**: Visit the deployed app, open DevTools Console, and check for initialization errors
2. **Verify Firestore rules**: Ensure your `firestore.rules` allows writes
3. **Check Cloud Build logs**: Look for build-time errors or missing variables
4. **Test locally first**: Use the Docker command above to verify build works

### Firebase Console shows "Invalid API key"

- Double-check you copied the API key correctly (no spaces or quotes)
- Verify the API key is for the correct Firebase project

### Permission denied errors

- Check your `firestore.rules` file at src/firestore.rules
- Ensure it allows public writes to the registrations collection

## Security Note

For Firebase web apps, the API key is **not a security risk** to expose in client-side code. Firebase security is enforced through Firestore Security Rules, not the API key. However, using Secret Manager is still recommended for:

- Centralized configuration management
- Easier rotation of credentials
- Consistent security practices
- Audit logging of secret access
