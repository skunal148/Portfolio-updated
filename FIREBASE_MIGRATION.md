# Firebase Firestore Migration Guide

## What Was Changed

Your portfolio application now uses **Firebase Firestore** instead of localStorage for data persistence.

## Files Modified

### 1. `firebaseConfig.ts`
- Added Firestore initialization
- Exported `db` instance for database operations

### 2. `services/portfolioService.ts` (NEW FILE)
Created a complete service layer with the following functions:
- `getUserPortfolios(userId)` - Fetch all portfolios for a user
- `createPortfolio(userId, portfolio)` - Create a new portfolio
- `updatePortfolio(userId, portfolio)` - Update an existing portfolio
- `deletePortfolio(portfolioId)` - Delete a portfolio
- `getPortfolio(portfolioId)` - Get a single portfolio by ID
- `migrateLocalStorageToFirestore(userId)` - One-time migration helper

### 3. `App.tsx`
Updated all portfolio operations to use Firestore:
- **Load**: Fetches portfolios from Firestore on user login
- **Create**: Saves new portfolios to Firestore
- **Update**: Updates portfolios in Firestore
- **Delete**: Removes portfolios from Firestore
- **Migration**: Automatically migrates existing localStorage data to Firestore on first login

## How It Works

### Data Structure in Firestore

Collection: `portfolios`

Each document contains:
```
{
  id: string,
  userId: string,              // Links portfolio to user
  name: string,
  lastModified: Timestamp,
  createdAt: Timestamp,
  templateId: string,
  profile: { ... },
  experience: [ ... ],
  education: [ ... ],
  projects: [ ... ],
  certifications: [ ... ],
  languages: [ ... ],
  customTheme: { ... }
}
```

### Automatic Migration

When a user logs in:
1. App checks Firestore for existing portfolios
2. If Firestore is empty but localStorage has data → **Automatic migration**
3. If both are empty → Creates a demo portfolio
4. If Firestore has data → Loads from Firestore

### Security Rules (IMPORTANT!)

You need to set up Firestore security rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /portfolios/{portfolioId} {
      // Users can only read/write their own portfolios
      allow read, write: if request.auth != null && 
                           request.auth.uid == resource.data.userId;
      // Allow creation if authenticated
      allow create: if request.auth != null && 
                      request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## Setup Steps

### 1. Enable Firestore in Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `portfoliobuilder-5a522`
3. Click "Firestore Database" in the left menu
4. Click "Create Database"
5. Choose **Start in production mode** (we'll add rules next)
6. Select a location (choose closest to your users)

### 2. Add Security Rules
1. In Firestore, go to "Rules" tab
2. Paste the security rules shown above
3. Click "Publish"

### 3. Create Indexes (Optional but Recommended)
Firestore may automatically suggest indexes. If you see errors about missing indexes:
1. Click the link in the error message
2. It will auto-create the required index

Or manually create:
- Collection: `portfolios`
- Fields: `userId` (Ascending), `lastModified` (Descending)

## Benefits of Firestore

✅ **Cloud Sync**: Access portfolios from any device
✅ **No Data Loss**: Data persists even if browser cache is cleared
✅ **Real-time**: Can add real-time sync features later
✅ **Scalable**: No storage limits like localStorage (5-10MB)
✅ **Secure**: User-specific data with authentication
✅ **Backup**: Automatic backups by Firebase

## Testing

1. Log in to your app
2. If you had existing portfolios in localStorage, they'll be automatically migrated
3. Create a new portfolio - it should save to Firestore
4. Log out and log back in - portfolios should persist
5. Check Firebase Console → Firestore Database to see your data

## Troubleshooting

### Error: "Missing or insufficient permissions"
- Make sure you've set up Firestore security rules
- Ensure user is authenticated before operations

### Error: "The query requires an index"
- Click the link in the error to auto-create the index
- Or manually create the index in Firebase Console

### Data not showing up
- Check browser console for errors
- Verify Firestore is enabled in Firebase Console
- Check that security rules are published

## Migration Notes

- localStorage data is preserved (not deleted) during migration
- Migration happens automatically on first login after update
- Each user's data is isolated by their `userId`
- All timestamps are stored as Firestore Timestamps for proper sorting

## Next Steps (Optional Enhancements)

1. **Real-time Sync**: Use Firestore's `onSnapshot` for live updates
2. **Offline Support**: Enable Firestore offline persistence
3. **Sharing**: Add sharing functionality between users
4. **Version History**: Track portfolio changes over time
5. **File Storage**: Use Firebase Storage for profile pictures
