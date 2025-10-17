# OneDrive Integration Setup

## Overview
The admin dashboard now includes OneDrive integration for uploading gallery images. This allows administrators to upload images directly from their OneDrive account.

## Current Implementation
- ✅ Basic file upload from device
- ✅ OneDrive integration UI (placeholder)
- ✅ File validation and storage
- ✅ Progress indicators and status feedback

## Full OneDrive Integration Setup

To enable full OneDrive integration, follow these steps:

### 1. Register Microsoft App
1. Go to [Azure Portal](https://portal.azure.com/)
2. Navigate to "Azure Active Directory" > "App registrations"
3. Click "New registration"
4. Fill in:
   - Name: "Church Website OneDrive Integration"
   - Supported account types: "Accounts in any organizational directory and personal Microsoft accounts"
   - Redirect URI: `http://localhost:3000/onedrive-callback`

### 2. Configure API Permissions
Add these Microsoft Graph permissions:
- `Files.ReadWrite` - Read and write user files
- `Files.ReadWrite.AppFolder` - Have full access to app folder

### 3. Environment Variables
Add to your `.env` file:
```
MICROSOFT_CLIENT_ID=your-app-client-id
MICROSOFT_CLIENT_SECRET=your-app-client-secret
ONEDRIVE_REDIRECT_URI=http://localhost:3000/onedrive-callback
```

### 4. OAuth Flow Implementation
The current implementation includes a placeholder. For full integration, you would need to:

1. **Authentication Flow:**
   ```javascript
   // Redirect to Microsoft OAuth
   const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=files.readwrite`;
   window.location.href = authUrl;
   ```

2. **Token Exchange:**
   ```javascript
   // Exchange code for access token
   const tokenResponse = await fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
     method: 'POST',
     headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
     body: new URLSearchParams({
       client_id: clientId,
       client_secret: clientSecret,
       code: authCode,
       redirect_uri: redirectUri,
       grant_type: 'authorization_code'
     })
   });
   ```

3. **Upload to OneDrive:**
   ```javascript
   // Upload file using Microsoft Graph API
   const uploadResponse = await fetch(`https://graph.microsoft.com/v1.0/me/drive/root:/${filename}:/content`, {
     method: 'PUT',
     headers: { 'Authorization': `Bearer ${accessToken}` },
     body: file
   });
   ```

## Current Features
- **Device Upload:** Direct file upload from computer/device
- **File Validation:** Image type and size validation (max 10MB)
- **Progress Tracking:** Upload progress and status indicators
- **URL Fallback:** Manual URL input for external images
- **OneDrive UI:** Ready for full integration

## File Storage
Uploaded files are stored in:
- **Local:** `/uploads/` directory
- **Served at:** `/uploads/filename.ext`
- **Database:** URL stored in gallery_images table

## Security
- Admin authentication required for uploads
- File type validation (images only)
- File size limits (10MB max)
- Unique filename generation to prevent conflicts
