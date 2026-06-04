import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";
import { db } from "./firebase.js";

export async function loadTrackerData(initData, setStatus, statusEl) {
  try {
    const docSnap = await getDoc(doc(db, 'tracker', 'april2026'));

    if (docSnap.exists()) {
      const data = docSnap.data();
      delete data.token;
      return data;
    } else {
      return initData();
    }
  } catch (e) {
    setStatus(statusEl, 'Offline', 'status-red');
    return initData();
  }
}

export async function saveTrackerData(data, token) {
  return await setDoc(doc(db, 'tracker', 'april2026'), {
    ...data,
    token
  });
}