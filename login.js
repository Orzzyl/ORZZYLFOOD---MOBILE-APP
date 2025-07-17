import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import {
  getAuth,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDt359BEU-aq_SjWSniNIbsQyDPa2lxhuU",
  authDomain: "signup-my-application.firebaseapp.com",
  databaseURL: "https://signup-my-application-default-rtdb.firebaseio.com",
  projectId: "signup-my-application",
  storageBucket: "signup-my-application.firebasestorage.app",
  messagingSenderId: "942108452259",
  appId: "1:942108452259:web:856275450cd7430ad6a616",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();

const regEmail = document.getElementById("regEmail");
const regPassword = document.getElementById("regPassword");
const registerBtn = document.getElementById("register-button");
const regUsername = document.getElementById("regUsername");

const logEmail = document.getElementById("logEmail");
const logPassword = document.getElementById("logPassword");
const loginBtn = document.getElementById("login-button");

const forgotForm = document.querySelector("#forgot form");

function isValidPassword(password) {
  return password.length >= 6;
}

// Register
registerBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  const email = regEmail.value.trim();
  const password = regPassword.value.trim();
  const username = regUsername.value.trim();

  if (!email || !password || !username) {
    alert("Please fill in all fields.");
    return;
  }

  if (!isValidPassword(password)) {
    alert("Password must be at least 6 characters.");
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then(({ user }) => {
      updateProfile(user, { displayName: username })
        .then(() => console.log("Username set to:", username))
        .catch((err) => console.error("Profile update error:", err));

      return sendEmailVerification(user);
    })
    .then(() => {
      alert("Registration successful. Please verify your email.");
      regEmail.value = "";
      regPassword.value = "";
    })
    .catch((error) => {
      const code = error.code;
      const messages = {
        "auth/email-already-in-use": "An account with this email already exists.",
        "auth/invalid-email": "Invalid email address.",
        "auth/weak-password": "Password is too weak.",
      };
      alert(messages[code] || error.message);
    });
});

// Login
loginBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  const email = logEmail.value.trim();
  const password = logPassword.value;

  if (!email || !password) {
    alert("Please fill in all fields.");
    return;
  }

  signInWithEmailAndPassword(auth, email, password)
    .then(({ user }) => {
      if (!user.emailVerified) {
        alert("Please verify your email first.");
        return signOut(auth);
      }

      // ✅ Store display name
      localStorage.setItem("username", user.displayName || "");

      alert("Login successful!");
      window.location.href = "order.html";
    })
    .catch((error) => {
      const code = error.code;
      const messages = {
        "auth/invalid-credential": "Invalid email or password.",
        "auth/user-not-found": "User not found.",
        "auth/wrong-password": "Wrong password.",
        "auth/user-disabled": "Account disabled.",
      };
      alert(messages[code] || error.message);
    });
});

// Forgot Password
forgotForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const forgotEmail = document.getElementById("forgotEmail").value.trim();
  if (!forgotEmail) return alert("Enter your email.");

  try {
    await sendPasswordResetEmail(auth, forgotEmail);
    alert("Reset link sent! Check your inbox.");
  } catch (err) {
    console.error(err);
    alert("Failed to send reset email.");
  }
});







