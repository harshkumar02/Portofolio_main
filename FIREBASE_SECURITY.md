# Firebase Security Rules - Deployment Guide

## Files Created

1. `firestore.rules` - Firestore database security rules
2. `firestore.indexes.json` - Firestore composite indexes
3. `storage.rules` - Firebase Storage security rules

## Deployment Steps

### 1. Install Firebase CLI (if not installed)
```bash
npm install -g firebase-tools
```

### 2. Login to Firebase
```bash
firebase login
```

### 3. Initialize Firebase (if not already done)
```bash
firebase init firestore
firebase init storage
```
Select your existing project when prompted.

### 4. Deploy Firestore Rules
```bash
firebase deploy --only firestore:rules
```

### 5. Deploy Storage Rules
```bash
firebase deploy --only storage:rules
```

### 6. Deploy Indexes
```bash
firebase deploy --only firestore:indexes
```

## Security Rules Summary

### Firestore Rules
- **Projects/Certifications**: Public read, no client writes
- **Comments**: Public read, validated writes with:
  - Content length: 1-1000 characters
  - Username length: 1-50 characters
  - Allowed characters only (no scripts/HTML)
  - No harmful fields (email, ip, uid, role, admin)
  - Created timestamp required

### Storage Rules
- Profile images: Public read
- Upload requires authentication
- Max file size: 5MB
- Allowed types: Images only

## Testing

After deployment, test the following scenarios:

### Should Work
- [ ] View projects (no auth required)
- [ ] View certificates (no auth required)
- [ ] Read comments (no auth required)
- [ ] Post comment with valid input (no auth required)

### Should Be Blocked
- [ ] Write to Projects collection
- [ ] Write to Certifications collection
- [ ] Upload non-image files
- [ ] Upload files > 5MB
- [ ] Comments with HTML/script tags
- [ ] Comments with very long content
- [ ] Comments with harmful fields
