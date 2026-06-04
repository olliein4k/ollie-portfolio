import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";
import { db } from "./firebase.js";

export let isAuthenticated = false;

export async function validateToken(token, authStatusEl, setStatus) {
  if (!token) {
    setStatus(authStatusEl, 'Not authenticated', 'status-amber');
    isAuthenticated = false;
    return false;
  }

  try {
    const configSnap = await getDoc(doc(db, 'auth', 'config'));
    const valid = configSnap.exists() && configSnap.data().token === token;

    if (valid) {
      setStatus(authStatusEl, 'Authenticated', 'status-green');
      isAuthenticated = true;
    } else {
      setStatus(authStatusEl, 'Invalid password', 'status-red');
      isAuthenticated = false;
    }

    return valid;
  } catch (err) {
    setStatus(authStatusEl, 'Auth check failed', 'status-red');
    console.error(err);
    isAuthenticated = false;
    return false;
  }
}