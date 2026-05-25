# Collaboration Setup

This site can stay on GitHub Pages, but live collaboration needs a realtime backend. The app is wired for Firebase Realtime Database.

1. Create a Firebase project at https://console.firebase.google.com/.
2. Add a Web App in Firebase project settings.
3. Create a Realtime Database. Start in test mode while developing, then tighten the rules before sharing widely.
4. Copy the Firebase web app config into `CollaborationConfig` near the top of `app.js`.
5. Publish the site to GitHub Pages.

A simple development rule for temporary testing is:

```json
{
  "rules": {
    "campTentPlannerSessions": {
      "$code": {
        ".read": true,
        ".write": true
      }
    }
  }
}
```

Do not leave open read/write rules on a public long-term project unless you are comfortable with anyone reading or changing shared sessions.
