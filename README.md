# ZapTalk

[Live-Demo](https://zaptalk007.netlify.app)

A real-time chat application with authentication, contact management, and group messaging, built using React and Firebase. Supports live updates, online status tracking, and a responsive mobile-first UI.

![chat app in action](/public/chatapp.gif)

![chat app in action](/public/mobile.gif)

## Features

- Authentication (Email/Password + Guest login)
- Real-time messaging (Firestore observers).
- Add & manage contacts (email or guest ID).
- Search & filter contacts.
- Online/offline presence (Realtime Database).
- Profile updates.
- Group chats.
- Fully responsive UI.
- UI testing with React Testing Library.
- Setting up security rules (for firebase).

## Tech Stack

- **Frontend:** React, React Router
- **State Management:** Context API
- **Backend:** Firebase (Auth, Firestore, Realtime DB)
- **Styling:** CSS Modules
- **Testing:** React Testing Library, Vitest

## Setup

```bash
git clone https://github.com/your-username/chat-app.git
cd chat-app
npm install
npm run dev
```

**Enviroment Variables**  
Create a `.env` file and fill all of these using your firebase configurations:

```bash
VITE_FIREBASE_API_KEY="..."
VITE_FIREBASE_AUTH_DOMAIN="..."
VITE_FIREBASE_PRODUCT_ID="..."
VITE_FIREBASE_STORAGE_BUCKET="..."
VITE_FIREBASE_MESSAGING_SENDER_ID="..."
VITE_FIREBASE_APP_ID="..."
VITE_FIREBASE_DATABASE_URL="..."
```
