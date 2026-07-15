# Let's Chat

A real-time chat application. Another fun side project :)

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-Realtime-010101?logo=socket.io&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?logo=firebase&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.1-06B6D4?logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-blue)

![Screenshot from 2022-09-07 16-27-25](https://user-images.githubusercontent.com/66206865/188901222-8eefabe5-8ca2-4305-aeb3-3afa37b304b3.png)

![Screenshot from 2022-09-07 17-11-16](https://user-images.githubusercontent.com/66206865/188900580-01d0d3ca-b242-4f48-99cf-96edeeb5f1db.png)

GIFs are attached at the end.

## Table of Contents

- [Technologies Used](#technologies-used)
- [Features](#features)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [GIFs](#gifs)

## Technologies Used

- React and TailwindCSS for the frontend
- Firebase for authentication
- Node/Express for creating API endpoints
- MongoDB for storing chat room members and their messages
- Socket.io for making the app real-time

## Features

- Register/login via email and password
- Profile page to update avatar and display name
- Randomly generated avatars via the [DiceBear API](https://avatars.dicebear.com/docs/http-api)
- Create a room and chat with other users in real time
- Online/offline status indicators
- Typing indicators
- Search conversations and messages
- Send and preview shared files and images, with a WhatsApp-style **Shared Media** panel (grouped into Media and Files tabs)
- Emoji picker
- Light and dark mode
- Polished, animated UI with loading skeletons and smooth transitions

## Getting Started

To run this project locally, follow these steps:

1. Clone the repository.
2. Install the dependencies:
   - Navigate to the `frontend` directory and run `npm install`.
   - Navigate to the `server` directory and run `npm install`.
3. Set up Firebase:
   - Go to the [Firebase Console](https://console.firebase.google.com/).
   - Create a new project or select an existing one.
   - Go to the project settings or service accounts section.
   - Click on "Generate new private key" or a similar option.
   - Save the downloaded JSON file as `serviceAccountKey.json`.
   - Place the downloaded `serviceAccountKey.json` file in the `server/config` directory.
4. Set up environment variables (see [Environment Variables](#environment-variables) below).
5. Run the server:
   - Navigate to the `server` directory and run `npm run start`.
6. Run the client:
   - Navigate to the `frontend` directory and run `npm start`.
7. The application will be accessible at `http://localhost:3000`.

Please make sure to keep the `serviceAccountKey.json` file and sensitive information secure and not commit them to version control.

## Environment Variables

**Root `.env`** (used by the server, copy from `.env.example`):

```
PORT=8080
MONGO_URI=your-mongodb-connection-string
```

**`frontend/.env`** (used by the React app, copy from `frontend/.env.example`):

```
REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_STORAGE_BUCKET=
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
REACT_APP_FIREBASE_APP_ID=
```

Get these values from your Firebase project settings (Project Settings → General → Your apps).

Never commit `.env` or `server/config/serviceAccountKey.json` — both are already listed in `.gitignore`.

## Project Structure

```
lets-chat/
├── frontend/          # React app (components, services, contexts)
└── server/            # Express API, MongoDB models, socket.io
    ├── controllers/
    ├── middlewares/
    ├── models/
    ├── routes/
    └── config/
```

## GIFs

![chrome-capture-2022-8-7](https://user-images.githubusercontent.com/66206865/188901119-65a05b65-3c76-4c3f-92c5-042d061df8e1.gif)

![chrome-capture-2022-8-7 (1)](https://user-images.githubusercontent.com/66206865/188900841-2dfe91c2-eb78-4f70-a013-babe0124ee68.gif)

![chrome-capture-2022-8-7 (2)](https://user-images.githubusercontent.com/66206865/188900662-a120aef4-ced1-442b-98dd-ab90b4cea7b5.gif)
