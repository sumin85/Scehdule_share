import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, OAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAg2ejrEx0pct4T1fSD4PfqmHfsIp_1hUI",
  authDomain: "schedule-share-513.firebaseapp.com",
  projectId: "schedule-share-513",
  storageBucket: "schedule-share-513.firebasestorage.app",
  messagingSenderId: "169543335744",
  appId: "1:169543335744:web:df6c5377864af7910c04a5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// 네이버 OAuth 제공업체
export const naverProvider = new OAuthProvider('oidc.naver');

// 카카오 OAuth 제공업체
export const kakaoProvider = new OAuthProvider('oidc.kakao');
