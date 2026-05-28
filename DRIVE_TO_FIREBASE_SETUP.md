# Google Drive to Firebase Sync - SETUP PAUSED

**Status:** On hold - requires Firebase Storage upgrade (Blaze plan) or alternative storage solution.

## Current Working Setup

Certificates are now static in `src/Pages/Portfolio.jsx`:
```javascript
const CERTIFICATES = [
  { Img: "/certificates/cert1.png", Platform: "AWS Certificate" },
  { Img: "/certificates/cert2.png", Platform: "React Bootcamp" },
];
```

### To Add New Certificates:

1. Upload image to `public/certificates/` folder
2. Add entry to CERTIFICATES array in `src/Pages/Portfolio.jsx`
3. Commit and push to GitHub

---

## Architecture (When Resumed)

```
Google Drive Folder → Apps Script → Google Cloud Storage → Firestore → Website
```

## Prerequisites

1. Google Account (with Drive access)
2. Firebase project (you already have: `portfolio-1cae2`)

---

## Step 1: Create Service Account for Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project `portfolio-1cae2`
3. Go to **Project Settings** → **Service Accounts**
4. Click **Generate new private key**
5. Save the JSON file (you'll need it for Apps Script)

## Step 2: Create Google Drive Folder

1. Create a new folder in Google Drive named `Portfolio Certificates`
2. Get the folder ID from the URL:
   - URL: `https://drive.google.com/drive/folders/XXXXXXXX`
   - ID: `XXXXXXXX` (the part after `/folders/`)

## Step 3: Set Up Firebase Storage Rules

Update `storage.rules` to allow uploads from Apps Script:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Certificates folder - allow uploads with proper naming
    match /certificates/{fileName} {
      allow read: if true;
      allow write: if request.auth != null
                   && request.resource.size < 10 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
    }

    // Profile images (keep existing rules)
    match /profile-images/{fileName} {
      allow read: if true;
      allow create: if request.auth != null
                    && request.resource.size < 5 * 1024 * 1024
                    && request.resource.contentType.matches('image/.*');
      allow update, delete: if false;
    }
  }
}
```

## Step 4: Create Google Apps Script

### 4.1 Create the Script

1. Go to [Google Apps Script](https://script.google.com/)
2. Click **New project**
3. Delete any code in the editor

### 4.2 Add the Code

Copy the code from `apps-script/Code.gs` in this project

### 4.3 Configure the Script

In `Code.gs`, update these values:

```javascript
const CONFIG = {
  FIREBASE_PROJECT_ID: 'portfolio-1cae2',
  FIREBASE_BUCKET: 'portfolio-1cae2.firebasestorage.app',
  FIREBASE_CERT_COLLECTION: 'Certifications',
  DRIVE_FOLDER_ID: 'YOUR_DRIVE_FOLDER_ID_HERE',
  SERVICE_ACCOUNT_KEY: {
    // Paste the entire JSON from your service account key file
    // Example structure shown below
  }
};
```

### 4.4 Add Service Account Key

1. Open the JSON file you downloaded in Step 1
2. Copy the entire contents
3. Paste into the `SERVICE_ACCOUNT_KEY` object in the script

### 4.5 Deploy as Web App

1. Click **Deploy** → **New deployment**
2. Click **Select type** → **Web app**
3. Configure:
   - Description: `Drive to Firebase Sync`
   - Execute as: **Me**
   - Who has access: **Anyone** (for triggers to work)
4. Click **Deploy**
5. Copy the **Web app URL** (you won't need this for triggers)

### 4.6 Create Time-Based Trigger

1. Click **Triggers** (clock icon in left sidebar)
2. Click **Add Trigger**
3. Configure:
   - Function: `checkForNewFiles`
   - Deployment: **Head**
   - Source: **Time-driven**
   - Type: **Minutes timer**
   - Interval: **Every 5 minutes** (or your preferred frequency)
4. Click **Save**

---

## Step 5: Test It

1. Upload an image to your Drive folder
2. Wait 5 minutes (or click **Run** in the Apps Script editor)
3. Check:
   - Firebase Storage: New file in `certificates` folder
   - Firestore: New document in `Certifications` collection
   - Your website: New certificate appears

---

## Usage After Setup

### Adding a New Certificate

1. Upload image to Google Drive folder
2. Wait ~5 minutes
3. Certificate appears on website!

### File Naming Convention

Name your files like:
- `AWS Certificate.png`
- `React Bootcamp - 2024.png`
- `Google Cloud.jpg`

The script extracts the platform name from the filename (before the first `.` or ` - `).

---

## Troubleshooting

### Files not syncing?

1. Check Apps Script executions (clock icon → Executions)
2. Check for errors in the console
3. Ensure trigger is active
4. Verify service account has proper permissions

### Permission errors?

1. Make sure service account has **Firebase Admin SDK** permissions
2. Check Firebase Storage rules are correct
3. Verify Drive folder is shared with the service account email

### Get Service Account Email

Find it in your JSON file:
```json
{
  "client_email": "firebase-adminsdk-xxxxx@portfolio-1cae2.iam.gserviceaccount.com"
}
```

Share your Drive folder with this email (view access is enough).

---

## File Structure Expected

```
Drive Folder
├── AWS Certificate.png      →  { Platform: "AWS Certificate", Img: "url" }
├── React Bootcamp.jpg       →  { Platform: "React Bootcamp", Img: "url" }
├── Google Cloud.pdf          →  { Platform: "Google Cloud", Img: "url" }
```

The script will:
- Skip already-processed files
- Handle PNG, JPG, JPEG, GIF, PDF
- Extract clean platform names
