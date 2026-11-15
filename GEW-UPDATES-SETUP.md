# GEW Updates Setup

1. Open https://console.firebase.google.com/ and create/select the GEW Firebase project.
2. Add a Web App in Project settings → General → Your apps. Copy its config into `public/js/firebase-config.js`, replacing all PASTE values.
3. Authentication → Sign-in method: enable Email/Password. Add your admin email in Authentication → Users with a strong password.
4. Create a Cloud Firestore database and enable Storage.
5. Paste `firebase/firestore.rules` into Firestore → Rules and replace REPLACE_WITH_YOUR_ADMIN_EMAIL with your admin email. Publish.
6. Paste `firebase/storage.rules` into Storage → Rules, replace the email and publish.
7. Deploy the updated project. Open `/admin-updates.html`, sign in, add title/category/description and optional image (max 8 MB), then Publish Update.

Posts appear on the homepage and `/updates.html`. Categories: Project Update, Company News, Festival, Achievement. Firebase setup is required before publishing works. This first version publishes immediately; draft/scheduled publishing is not included.