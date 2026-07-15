import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { readFileSync } from "fs";

const serviceAccountKey = JSON.parse(
  readFileSync(
    process.env.RENDER
      ? "/etc/secrets/serviceAccountKey.json"
      : new URL("./serviceAccountKey.json", import.meta.url)
  )
);

const app = initializeApp({
  credential: cert(serviceAccountKey),
});

const auth = getAuth(app);

export default auth;