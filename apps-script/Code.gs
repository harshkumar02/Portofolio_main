/**
 * Drive to Firebase Sync Script
 *
 * This script monitors a Google Drive folder and syncs new certificate images
 * to Firebase Storage and Firestore.
 */

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
  FIREBASE_PROJECT_ID: 'portfolio-4cd30',
  FIREBASE_BUCKET: 'portfolio-4cd30.firebasestorage.app',
  FIREBASE_CERT_COLLECTION: 'Certifications',
  DRIVE_FOLDER_ID: '1RDHVrIibYul3nv03WNIZKSvFPyN3RvkG',
  CACHE_FILE_NAME: 'last_sync_time',
  SUPPORTED_TYPES: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'application/pdf']
};

const SERVICE_ACCOUNT_KEY = {
  "type": "service_account",
  "project_id": "portfolio-4cd30",
  "private_key_id": "4f7fc2e6feee11f335f0116ff2ca9a9acdfc3a3e",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQC5VodCPyZGoyvU\n9QDGKn8jJ/4Tba8dq8NQfF+T4z7aq8o2V5P2a0Aa8eNG50FpdflFca+ofBru3ruz\n9Xv3ft7disRAKk9C4o2qPGa1NCtOq90doV6NPUsKkhGmVbAKvLnN+vaf819q6jne\nKE/UA3JnBmJvXV+yK3/jTweMk2UG68X0rjYtkfJrW3mh0Pp1y4H6gD7hlyoFYMcC\n5qLR5E51T0qagU4mHIh711pMf5pngyI7CckeK4JL1WmukoQELOWnkBGInmUupo0E\nrPJguqKgJiqGQGPFzSX+WwsAddBqNWhMGLXt6hSUahc4Y2tMdNG0Do1PqxcGP9l0\n7RJfb7STAgMBAAECggEAKG3Po4vS9aWycgnf2Vp70Vdv/Rz4DijhujTnRINVuq2u\ntpv0EtTibv5E7bqUckTh01wxTTeFSIYdu+vY1uw+AWW72aNhFt4EuRXj8bMnn0mu\nOkBxN64fKHckknwuoqj4fw43rjyQm+nsJaH1h/IYipDB+DkOHveONi+PHgMpDpEQ\nzTqdIPPQU3jwwDvlOGdABLgcdzxnoaami2avwoF/lTYLxZWIojZ3+4kVE+alTOTu\nM+KkTo3MAkXB5/1mx3htjlR1tsPgpCkt4+774nKSv10OZ4ANf0y47yjTPCE9S3w2\nBnfL7ztJGDKMSI2ZM+McbOKq15EVQAPWLs4caHWXQQKBgQDh7/k4zt06zsG/7ewj\nJA46j7EmOv07pWZINBqAbc9EtvaCfu349F51sho92BlUpPU1qrIVnWSBwuf8JmdT\nVxVZpYjYw0pjAbwHX1zgsDxVHqVIRUrEIYVXJZfLs06jsHCEWpWG3q9PDytbuKDB\n+ZbaTQkzIWtDTb2vaz3TlZw4dQKBgQDR/6HAR1aTGBCyO3mWWNJ5MxRpUOsI6Yks\n+K2QZA9FN97+6PuDLy4PmbqFhBdRA42VBPBEK8nSQvyJyzmuXlCdy0SbRhZrLppC\n8JQejpGxUjtxtyyLdD/st8g36BOqkFdFmLtw1PAg/87EwVadQ3YZf2QMyC4exIXH\nJK7mtgVX5wKBgQDIu54evJuNDfjRfp7Xscb6fIOVRb+K6K5w4+nPxL/reuqUkhT3\npJTv2Ga8H2yR6WT6Y0eJMKcFKpdVTQFr5+jOFuX4P7mtMPNPUYiBD9LqhSmvhfCh\nRG7lOD8e+ZWalL3CuYAzrVDv2rhY6zXYYNmH5f2QcdaMm1s1qP/rJfb/qQKBgQC2\nt6VGxwuGGxdT7Tni3k/r0sz8wcJvU7venFVwYA+FW5K024UT5LZALrNDPuaGv/+t\n3Mktl6gYQd64ClKa7EdatKVyMS6KfdcNTYSjfcs4rWM5k3a3tCN21YXpVw3dh4/X\n54eYKj7xh4KiYdL6LNuSXexwzrCKZtY7qyhfZ5sImwKBgQCLXRCoiW0RK0H54+UJ\nZguY2pj5n323yk8DbPrYIDS5NGGOnDm2CGBBsj8qdNWliE00iSOuh2lPl60fyTp9\nYTna1uNA6zlyQVv09zbqcSExFR+gYybSdu59YfQxMXX/2gKIxWIYoVFIRGqVPa8i\nFCYLKX5C9kv6H20jOWLCdndasA==\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@portfolio-4cd30.iam.gserviceaccount.com",
  "client_id": "111392477833102930166",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40portfolio-4cd30.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}

// ============================================
// MAIN FUNCTIONS
// ============================================

function checkForNewFiles() {
  try {
    console.log('Starting Drive to Firebase sync...');
    const folder = DriveApp.getFolderById(CONFIG.DRIVE_FOLDER_ID);
    const files = folder.getFiles();
    let processedCount = 0;
    let skippedCount = 0;
    const processedFiles = getProcessedFiles();

    while (files.hasNext()) {
      const file = files.next();
      if (processedFiles.has(file.getId())) {
        skippedCount++;
        continue;
      }
      const mimeType = file.getMimeType();
      if (!CONFIG.SUPPORTED_TYPES.includes(mimeType)) {
        processedFiles.add(file.getId());
        continue;
      }
      try {
        const downloadUrl = uploadToFirebaseStorage(file);
        if (downloadUrl) {
          const platformName = extractPlatformName(file.getName());
          addToFirestore(platformName, downloadUrl);
          processedFiles.add(file.getId());
          processedCount++;
          console.log(`Processed: ${file.getName()} -> ${platformName}`);
        }
      } catch (error) {
        console.error(`Error processing ${file.getName()}: ${error.message}`);
      }
    }
    saveProcessedFiles(processedFiles);
    console.log(`Sync complete. Processed: ${processedCount}, Skipped: ${skippedCount}`);
  } catch (error) {
    console.error(`Sync failed: ${error.message}`);
    throw error;
  }
}

function uploadToFirebaseStorage(file) {
  const fileName = file.getName();
  const mimeType = file.getMimeType();
  const blob = file.getBlob();
  const cleanFileName = file.getId() + '_' + fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const storagePath = `certificates/${cleanFileName}`;
  const url = `https://storage.googleapis.com/upload/storage/v1/b/${CONFIG.FIREBASE_BUCKET}/o?uploadType=media&name=${encodeURIComponent(storagePath)}`;
  const accessToken = getAccessToken();
  const options = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': mimeType,
    },
    payload: blob.getBytes(),
    muteHttpExceptions: true
  };
  const response = UrlFetchApp.fetch(url, options);
  const result = JSON.parse(response.getContentText());
  if (response.getResponseCode() === 200) {
    return `https://firebasestorage.googleapis.com/v0/b/${CONFIG.FIREBASE_BUCKET}/o/${encodeURIComponent(storagePath)}?alt=media&token=${result.downloadTokens}`;
  } else {
    throw new Error(`Upload failed: ${result.error?.message || 'Unknown error'}`);
  }
}

function addToFirestore(platformName, imageUrl) {
  const url = `https://firestore.googleapis.com/v1/projects/${CONFIG.FIREBASE_PROJECT_ID}/databases/(default)/documents/${CONFIG.FIREBASE_CERT_COLLECTION}`;
  const accessToken = getAccessToken();
  const documentData = {
    fields: {
      Platform: { stringValue: platformName },
      Img: { stringValue: imageUrl },
      addedAt: { timestampValue: new Date().toISOString() }
    }
  };
  const options = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    payload: JSON.stringify(documentData),
    muteHttpExceptions: true
  };
  const response = UrlFetchApp.fetch(url, options);
  const result = JSON.parse(response.getContentText());
  if (response.getResponseCode() !== 200 && !result.error?.message?.includes('ALREADY_EXISTS')) {
    throw new Error(`Firestore write failed: ${result.error?.message || 'Unknown error'}`);
  }
  console.log(`Added to Firestore: ${platformName}`);
}

function extractPlatformName(fileName) {
  let name = fileName.replace(/\.(png|jpg|jpeg|gif|pdf)$/i, '');
  name = name.replace(/[-_]+/g, ' ').trim();
  name = name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  return name || 'Certificate';
}

function getAccessToken() {
  const jwt = createJwt();
  const tokenUrl = 'https://oauth2.googleapis.com/token';
  const payload = {
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion: jwt
  };
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    payload: Object.keys(payload).map(key => key + '=' + encodeURIComponent(payload[key])).join('&'),
    muteHttpExceptions: true
  };
  const response = UrlFetchApp.fetch(tokenUrl, options);
  const result = JSON.parse(response.getContentText());
  if (!result.access_token) throw new Error(`Failed to get access token: ${result.error || 'Unknown error'}`);
  return result.access_token;
}

function createJwt() {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const claimSet = {
    iss: SERVICE_ACCOUNT_KEY.client_email,
    sub: SERVICE_ACCOUNT_KEY.client_email,
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
    scope: 'https://www.googleapis.com/auth/firebase https://www.googleapis.com/auth/drive.readonly'
  };
  const encodedHeader = Utilities.base64EncodeWebSafe(JSON.stringify(header)).replace(/=+$/, '');
  const encodedClaims = Utilities.base64EncodeWebSafe(JSON.stringify(claimSet)).replace(/=+$/, '');
  const signatureInput = encodedHeader + '.' + encodedClaims;

  // Fix private key - replace escaped \n with actual newlines
  const privateKey = SERVICE_ACCOUNT_KEY.private_key.replace(/\\n/g, '\n');

  // Sign with RsaAlgorithm enum
  const signatureBytes = Utilities.computeRsaSignature(
    Utilities.RsaAlgorithm.RSA_SHA_256,
    signatureInput,
    privateKey
  );
  const encodedSignature = Utilities.base64EncodeWebSafe(signatureBytes).replace(/=+$/, '');

  return signatureInput + '.' + encodedSignature;
}

function getProcessedFiles() {
  try {
    const folder = DriveApp.getFolderById(CONFIG.DRIVE_FOLDER_ID);
    const files = folder.getFilesByName(CONFIG.CACHE_FILE_NAME);
    if (files.hasNext()) {
      const file = files.next();
      return new Set(JSON.parse(file.getBlob().getDataAsString()));
    }
  } catch (error) { console.log('No cache file found'); }
  return new Set();
}

function saveProcessedFiles(processedFiles) {
  try {
    const folder = DriveApp.getFolderById(CONFIG.DRIVE_FOLDER_ID);
    const files = folder.getFilesByName(CONFIG.CACHE_FILE_NAME);
    if (files.hasNext()) {
      files.next().setContent(JSON.stringify([...processedFiles]));
    } else {
      folder.createFile(CONFIG.CACHE_FILE_NAME, JSON.stringify([...processedFiles]));
    }
  } catch (error) { console.error('Failed to save cache:', error.message); }
}

function forceSyncAll() {
  const folder = DriveApp.getFolderById(CONFIG.DRIVE_FOLDER_ID);
  const files = folder.getFilesByName(CONFIG.CACHE_FILE_NAME);
  if (files.hasNext()) files.next().setTrashed(true);
  checkForNewFiles();
}

function testFirebaseConnection() {
  try {
    const accessToken = getAccessToken();
    console.log('Firebase auth: SUCCESS');
    const response = UrlFetchApp.fetch(
      `https://firestore.googleapis.com/v1/projects/${CONFIG.FIREBASE_PROJECT_ID}/databases/(default)/documents`,
      { headers: { 'Authorization': `Bearer ${accessToken}` }, muteHttpExceptions: true }
    );
    console.log(response.getResponseCode() === 200 ? 'Firestore: SUCCESS' : 'Firestore: FAILED');
    return true;
  } catch (error) {
    console.error('Connection test failed:', error.message);
    return false;
  }
}

function listDriveFiles() {
  const folder = DriveApp.getFolderById(CONFIG.DRIVE_FOLDER_ID);
  const files = folder.getFiles();
  let output = 'Files in Drive folder:\n';
  while (files.hasNext()) {
    const file = files.next();
    output += `- ${file.getName()} (${file.getMimeType()})\n`;
  }
  console.log(output);
  return output;
}
