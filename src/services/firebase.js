import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc,
  setDoc,
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  query,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GithubAuthProvider,
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';

// 1. Resolve configuration from Vite environment variables or localStorage override
export function getFirebaseConfig() {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('custom_firebase_config');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.apiKey && parsed.projectId) {
          return parsed;
        }
      }
    } catch {
      // Ignore parse errors
    }
  }

  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyC7tRKuISm6opRD9stbhq0c6Y13qImlj9A',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'portfolio-28c78.firebaseapp.com',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'portfolio-28c78',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'portfolio-28c78.firebasestorage.app',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '493534963838',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:493534963838:web:894d51e687c319c171102f'
  };
}

export function saveFirebaseConfig(config) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('custom_firebase_config', JSON.stringify(config));
    window.location.reload();
  }
}

export function clearFirebaseConfig() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('custom_firebase_config');
    window.location.reload();
  }
}

// 2. Safely initialize Firebase App
const config = getFirebaseConfig();
export const isFirebaseConfigured = Boolean(config && config.apiKey && config.projectId);

let app = null;
let db = null;
let auth = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length ? getApp() : initializeApp(config);
    db = getFirestore(app);
    auth = getAuth(app);
  } catch (err) {
    console.warn('[Firebase] Initialization error:', err);
  }
}

export { app, db, auth };

const githubProvider = new GithubAuthProvider();
githubProvider.addScope('user:email');
githubProvider.addScope('read:user');

// 3. Admin Security Whitelist
export const ALLOWED_ADMIN_EMAILS = [
  'vasanthkumar49480@gmail.com'
];

export const ALLOWED_GITHUB_USERNAMES = [
  'vasanth246810'
];

export function isUserAuthorizedAdmin(user) {
  if (!user) return false;
  const email = (user.email || '').toLowerCase().trim();
  const screenName = (user.reloadUserInfo?.screenName || '').toLowerCase().trim();
  const displayName = (user.displayName || '').toLowerCase().trim();

  const isEmailAllowed = Boolean(email && ALLOWED_ADMIN_EMAILS.some(allowed => allowed.toLowerCase() === email));
  const isGithubAllowed = Boolean(screenName && ALLOWED_GITHUB_USERNAMES.some(allowed => allowed.toLowerCase() === screenName));
  const isDisplayNameAllowed = Boolean(
    displayName && (
      ALLOWED_GITHUB_USERNAMES.some(allowed => allowed.toLowerCase() === displayName) ||
      displayName.includes('vasanth')
    )
  );

  const isProviderAllowed = (user.providerData || []).some(p => {
    const pEmail = (p.email || '').toLowerCase().trim();
    const pName = (p.displayName || '').toLowerCase().trim();
    return (
      (pEmail && ALLOWED_ADMIN_EMAILS.some(allowed => allowed.toLowerCase() === pEmail)) ||
      (pName && ALLOWED_GITHUB_USERNAMES.some(allowed => allowed.toLowerCase() === pName)) ||
      (pName && pName.includes('vasanth'))
    );
  });

  return isEmailAllowed || isGithubAllowed || isDisplayNameAllowed || isProviderAllowed;
}

// 4. Auth Helpers
export async function loginAdminUser(email, password) {
  if (!auth) throw new Error('Firebase is not yet configured.');
  const cred = await signInWithEmailAndPassword(auth, email, password);
  if (!isUserAuthorizedAdmin(cred.user)) {
    await signOut(auth);
    throw new Error('Access Denied: Your account is not authorized as an administrator.');
  }
  return cred;
}

export async function checkRedirectResult() {
  if (!auth) return null;
  try {
    const cred = await getRedirectResult(auth);
    if (cred && cred.user) {
      if (!isUserAuthorizedAdmin(cred.user)) {
        await signOut(auth);
        throw new Error('Access Denied: Only vasanthKumar49480@gmail.com (vasanth246810) is authorized to manage this portfolio.');
      }
      return cred;
    }
  } catch (err) {
    console.warn('[Firebase] Redirect result check error:', err);
    throw err;
  }
  return null;
}

export async function loginWithGitHub(useRedirect = false) {
  if (!auth) throw new Error('Firebase is not yet configured.');

  if (useRedirect) {
    await signInWithRedirect(auth, githubProvider);
    return null;
  }

  try {
    const cred = await signInWithPopup(auth, githubProvider);
    if (!isUserAuthorizedAdmin(cred.user)) {
      await signOut(auth);
      throw new Error('Access Denied: Only vasanthKumar49480@gmail.com (vasanth246810) is authorized to manage this portfolio.');
    }
    return cred;
  } catch (err) {
    if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
      const customErr = new Error('The popup window was closed or blocked by browser security (cookies/extensions). Use "Sign in with GitHub (Redirect)" below to bypass popups completely.');
      customErr.code = err.code;
      throw customErr;
    }
    throw err;
  }
}

export async function logoutAdminUser() {
  if (!auth) return;
  return signOut(auth);
}

export function subscribeToAuthChanges(callback) {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}


// Graceful Firestore read error handler
let hasWarnedFirestoreRules = false;
function handleFirestoreReadError(collectionName, err, callback, fallbackValue = []) {
  if (err?.code === 'permission-denied') {
    if (!hasWarnedFirestoreRules) {
      hasWarnedFirestoreRules = true;
      console.warn(
        '[Firebase] Firestore read permission not yet enabled in Firebase Console. Using local/default portfolio data. To enable live sync, update Firestore Rules in Firebase Console (set: allow read: if true; allow write: if request.auth != null;).'
      );
    }
  } else {
    console.error(`[Firebase] Error fetching live ${collectionName}:`, err);
  }
  callback(fallbackValue);
}

// 4. Firestore Project Helpers
export function subscribeToLiveProjects(callback) {
  if (!db) {
    callback([]);
    return () => {};
  }

  const projectsCol = collection(db, 'projects');
  // Order by createdAt or order index if available
  const q = query(projectsCol);

  return onSnapshot(q, (snapshot) => {
    const list = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data()
    }));
    callback(list);
  }, (err) => {
    handleFirestoreReadError('projects', err, callback, []);
  });
}

export async function addProjectToDB(projectData) {
  if (!db) throw new Error('Firebase Firestore is not initialized.');
  const col = collection(db, 'projects');
  const payload = {
    ...projectData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
  const docRef = await addDoc(col, payload);
  return { id: docRef.id, ...payload };
}

export async function updateProjectInDB(id, projectData) {
  if (!db) throw new Error('Firebase Firestore is not initialized.');
  const docRef = doc(db, 'projects', id);
  const payload = {
    ...projectData,
    updatedAt: serverTimestamp()
  };
  await setDoc(docRef, payload, { merge: true });
  return { id, ...payload };
}

export async function deleteProjectFromDB(id) {
  if (!db) throw new Error('Firebase Firestore is not initialized.');
  const docRef = doc(db, 'projects', id);
  await deleteDoc(docRef);
  return id;
}

// 5. Firestore Experience Helpers
export function subscribeToLiveExperiences(callback) {
  if (!db) {
    callback([]);
    return () => {};
  }

  const expCol = collection(db, 'experiences');
  return onSnapshot(expCol, (snapshot) => {
    const list = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data()
    }));
    callback(list);
  }, (err) => {
    handleFirestoreReadError('experiences', err, callback, []);
  });
}

export async function addExperienceToDB(expData) {
  if (!db) throw new Error('Firebase Firestore is not initialized.');
  const col = collection(db, 'experiences');
  const payload = {
    ...expData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
  const docRef = await addDoc(col, payload);
  return { id: docRef.id, ...payload };
}

export async function updateExperienceInDB(id, expData) {
  if (!db) throw new Error('Firebase Firestore is not initialized.');
  const docRef = doc(db, 'experiences', id);
  const payload = {
    ...expData,
    updatedAt: serverTimestamp()
  };
  await setDoc(docRef, payload, { merge: true });
  return { id, ...payload };
}

export async function deleteExperienceFromDB(id) {
  if (!db) throw new Error('Firebase Firestore is not initialized.');
  const docRef = doc(db, 'experiences', id);
  await deleteDoc(docRef);
  return id;
}

// 6. Firestore Profile & Bio Helpers
export function subscribeToLiveProfile(callback) {
  if (!db) {
    callback(null);
    return () => {};
  }
  const profileDoc = doc(db, 'settings', 'profile');
  return onSnapshot(profileDoc, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data());
    } else {
      callback(null);
    }
  }, (err) => {
    handleFirestoreReadError('profile', err, callback, null);
  });
}

export async function saveProfileToDB(profileData) {
  if (!db) throw new Error('Firebase Firestore is not initialized.');
  const profileDoc = doc(db, 'settings', 'profile');
  const payload = {
    ...profileData,
    updatedAt: serverTimestamp()
  };
  await setDoc(profileDoc, payload, { merge: true });
  return payload;
}

// 7. Firestore Socials & Contact Config Helpers
export function subscribeToLiveSocials(callback) {
  if (!db) {
    callback(null);
    return () => {};
  }
  const socialsDoc = doc(db, 'settings', 'socials');
  return onSnapshot(socialsDoc, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data());
    } else {
      callback(null);
    }
  }, (err) => {
    handleFirestoreReadError('socials', err, callback, null);
  });
}

export async function saveSocialsToDB(socialsData) {
  if (!db) throw new Error('Firebase Firestore is not initialized.');
  const socialsDoc = doc(db, 'settings', 'socials');
  const payload = {
    ...socialsData,
    updatedAt: serverTimestamp()
  };
  await setDoc(socialsDoc, payload, { merge: true });
  return payload;
}

// 8. Firestore Education Helpers
export function subscribeToLiveEducation(callback) {
  if (!db) {
    callback([]);
    return () => {};
  }
  const eduCol = collection(db, 'education');
  return onSnapshot(eduCol, (snapshot) => {
    const list = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data()
    }));
    callback(list);
  }, (err) => {
    handleFirestoreReadError('education', err, callback, []);
  });
}

export async function addEducationToDB(eduData) {
  if (!db) throw new Error('Firebase Firestore is not initialized.');
  const col = collection(db, 'education');
  const payload = {
    ...eduData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
  const docRef = await addDoc(col, payload);
  return { id: docRef.id, ...payload };
}

export async function updateEducationInDB(id, eduData) {
  if (!db) throw new Error('Firebase Firestore is not initialized.');
  const docRef = doc(db, 'education', id);
  const payload = {
    ...eduData,
    updatedAt: serverTimestamp()
  };
  await setDoc(docRef, payload, { merge: true });
  return { id, ...payload };
}

export async function deleteEducationFromDB(id) {
  if (!db) throw new Error('Firebase Firestore is not initialized.');
  const docRef = doc(db, 'education', id);
  await deleteDoc(docRef);
  return id;
}

// 9. Firestore Skills Helpers
export function subscribeToLiveSkills(callback) {
  if (!db) {
    callback(null);
    return () => {};
  }
  const skillsDoc = doc(db, 'settings', 'skills_data');
  return onSnapshot(skillsDoc, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (Array.isArray(data.items)) {
        callback(data.items);
      } else if (Array.isArray(data.categories)) {
        callback(data.categories);
      } else {
        callback(null);
      }
    } else {
      callback(null);
    }
  }, (err) => {
    handleFirestoreReadError('skills', err, callback, null);
  });
}

export async function saveSkillsToDB(skillsList) {
  if (!db) throw new Error('Firebase Firestore is not initialized.');
  const skillsDoc = doc(db, 'settings', 'skills_data');
  const payload = {
    items: skillsList,
    updatedAt: serverTimestamp()
  };
  await setDoc(skillsDoc, payload, { merge: true });
  return skillsList;
}

// 10. Firestore Awards Helpers
export function subscribeToLiveAwards(callback) {
  if (!db) {
    callback([]);
    return () => {};
  }
  const awardsCol = collection(db, 'awards');
  return onSnapshot(awardsCol, (snapshot) => {
    const list = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data()
    }));
    callback(list);
  }, (err) => {
    handleFirestoreReadError('awards', err, callback, []);
  });
}

export async function addAwardToDB(awardData) {
  if (!db) throw new Error('Firebase Firestore is not initialized.');
  const col = collection(db, 'awards');
  const payload = {
    ...awardData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
  const docRef = await addDoc(col, payload);
  return { id: docRef.id, ...payload };
}

export async function updateAwardInDB(id, awardData) {
  if (!db) throw new Error('Firebase Firestore is not initialized.');
  const docRef = doc(db, 'awards', id);
  const payload = {
    ...awardData,
    updatedAt: serverTimestamp()
  };
  await setDoc(docRef, payload, { merge: true });
  return { id, ...payload };
}

export async function deleteAwardFromDB(id) {
  if (!db) throw new Error('Firebase Firestore is not initialized.');
  const docRef = doc(db, 'awards', id);
  await deleteDoc(docRef);
  return id;
}

// 11. Firestore Writings / Publications Helpers
export function subscribeToLiveWritings(callback) {
  if (!db) {
    callback([]);
    return () => {};
  }
  const col = collection(db, 'writings');
  return onSnapshot(col, (snapshot) => {
    const list = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data()
    }));
    callback(list);
  }, (err) => {
    handleFirestoreReadError('writings', err, callback, []);
  });
}

export async function addWritingToDB(writingData) {
  if (!db) throw new Error('Firebase Firestore is not initialized.');
  const col = collection(db, 'writings');
  const payload = {
    ...writingData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
  const docRef = await addDoc(col, payload);
  return { id: docRef.id, ...payload };
}

export async function updateWritingInDB(id, writingData) {
  if (!db) throw new Error('Firebase Firestore is not initialized.');
  const docRef = doc(db, 'writings', id);
  const payload = {
    ...writingData,
    updatedAt: serverTimestamp()
  };
  await setDoc(docRef, payload, { merge: true });
  return { id, ...payload };
}

export async function deleteWritingFromDB(id) {
  if (!db) throw new Error('Firebase Firestore is not initialized.');
  const docRef = doc(db, 'writings', id);
  await deleteDoc(docRef);
  return id;
}

// 12. Full-System One-Click Seed Helper
export async function seedDatabase({
  initialProjects = [],
  initialExperiences = [],
  initialProfile = null,
  initialSocials = null,
  initialEducation = [],
  initialSkills = null,
  initialAwards = [],
  initialWritings = []
} = {}) {
  if (!db) throw new Error('Firebase is not initialized.');
  
  const results = {
    projectsAdded: 0,
    experiencesAdded: 0,
    educationAdded: 0,
    awardsAdded: 0,
    writingsAdded: 0,
    profileSeeded: false,
    socialsSeeded: false,
    skillsSeeded: false
  };

  // Seed Profile
  if (initialProfile) {
    await saveProfileToDB(initialProfile);
    results.profileSeeded = true;
  }

  // Seed Socials
  if (initialSocials) {
    await saveSocialsToDB(initialSocials);
    results.socialsSeeded = true;
  }

  // Seed Skills
  if (initialSkills && initialSkills.length > 0) {
    await saveSkillsToDB(initialSkills);
    results.skillsSeeded = true;
  }

  // Seed Projects
  for (const proj of initialProjects) {
    await addProjectToDB({
      no: proj.no || '01 / 2026',
      title: proj.title || '',
      tag: proj.tag || '',
      lede: proj.lede || proj.description || '',
      award: proj.award || '',
      chips: proj.chips || [],
      linkText: proj.linkText || 'Read the write-up',
      linkUrl: proj.linkUrl || proj.Link || proj.GithubLink || '',
      githubUrl: proj.GithubLink || '',
      image: proj.image || ''
    });
    results.projectsAdded++;
  }

  // Seed Experiences
  for (const exp of initialExperiences) {
    await addExperienceToDB({
      role: exp.role || '',
      company: exp.company || '',
      navMeta: exp.navMeta || `${exp.role} · 2026`,
      period: exp.period || '',
      location: exp.location || '',
      lede: exp.lede || '',
      points: exp.points || [],
      chips: exp.chips || []
    });
    results.experiencesAdded++;
  }

  // Seed Education
  for (const edu of initialEducation) {
    await addEducationToDB({
      institution: edu.institution || '',
      degree: edu.degree || '',
      period: edu.period || '',
      score: edu.score || '',
      highlights: edu.highlights || ''
    });
    results.educationAdded++;
  }

  // Seed Awards
  for (const award of initialAwards) {
    const awardPayload = typeof award === 'string'
      ? { title: award, year: '2026', issuer: '' }
      : {
          title: award.title || '',
          year: award.year || '2026',
          issuer: award.issuer || '',
          link: award.link || ''
        };
    await addAwardToDB(awardPayload);
    results.awardsAdded++;
  }

  // Seed Writings
  for (const writing of initialWritings) {
    await addWritingToDB({
      title: writing.title || '',
      subtitle: writing.subtitle || '',
      meta: writing.meta || '',
      url: writing.url || ''
    });
    results.writingsAdded++;
  }

  return results;
}
