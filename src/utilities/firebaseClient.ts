import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, GithubAuthProvider } from 'firebase/auth';
import { getDatabase, ref, push, onValue } from 'firebase/database';
import { getFirestore, addDoc, collection, getDoc, doc,  setDoc, } from 'firebase/firestore'; // Firestore for email triggers

interface Transaction {
  timestamp: string;
  type: 'Sent' | 'Received';
  cryptocurrency: string;
  thirdPartyIdacScore: number;
  usdAmount: number;
  thirdPartyWallet: string;
}

interface InsightsResponse {
  openAIResponse?: string | null;
  userAddress: string;
  insights: string;
  timestamp: number;
}

const config = {
  apiKey: "AIzaSyCA0bWMx3Ye76g1PXGVGh0qMdpqEFl8bK4",
  authDomain: "idefi-ai-mup.firebaseapp.com",
  projectId: "idefi-ai-mup",
  storageBucket: "idefi-ai-mup.appspot.com",
  databaseURL: "https://idefi-ai-mup-default-rtdb.firebaseio.com/",
  messagingSenderId: "987289623268",
  appId: "1:987289623268:web:ad12c8bd18c8734e64eaf1",
  measurementId: "G-QKX9KR598W"
};

const app = initializeApp(config);
const auth = getAuth();
const firestore = getFirestore(app); // Initialize Firestore
const database = getDatabase(app);

// Providers
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

// Sign-in functions
const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
const signInWithGithub = () => signInWithPopup(auth, githubProvider);

const signInWithEmailPassword = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

const createAccountWithEmailPassword = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// Realtime Database operations
const jsondataRef = ref(database, 'jsondata');
const useridRef = ref(database, 'userid');
const insightsRef = ref(database, 'insights');
const transactionsRef = ref(database, 'transactions');
const sanctionedAddressesRef = ref(database, 'sanctionedAddresses');

// Store JSON data in Firebase
const storeJsonData = (jsonData: any) => {
  return push(jsondataRef, jsonData);
};

const storeUserId = (userId: any) => {
  return push(useridRef, userId);
};

const pushTransaction = (transaction: any) => {
  return push(transactionsRef, transaction);
};

const storeSanctionedAddress = (sanctionedAddress: any) => {
  return push(sanctionedAddressesRef, sanctionedAddress);
};

const pushAiInsights = (data: InsightsResponse) => {
  console.log('Attempting to push insights:', data);
  return push(insightsRef, {
    openAIResponse: data.openAIResponse || null,
    timestamp: data.timestamp,
    userAddress: data.userAddress,
    insights: data.insights,
  })
    .then(() => console.log('Insights pushed successfully'))
    .catch((error) => console.error('Error pushing insights:', error));
};

// Real-time transaction listener
const listenToTransactions = (callback: (data: Transaction[] | null) => void) => {
  onValue(transactionsRef, (snapshot) => {
    const data = snapshot.val();
    callback(data as Transaction[] | null);
  });
};

// Trigger email notifications via Firestore collection
const triggerEmailNotification = async (subject: string, messageText: string, email: string) => {
  try {
    const mailCollectionRef = collection(firestore, 'mail');
    const emailData = {
      to: [email],
      message: {
        subject: subject,
        text: messageText,
        html: `<p>${messageText}</p>`,
      },
    };
    await addDoc(mailCollectionRef, emailData);
    console.log("Email notification triggered.");
  } catch (error) {
    console.error("Error triggering email notification:", error);
  }
};

// Fetch user notification preferences from Firestore
const getUserNotificationPreferences = async (uid: string) => {
  const docRef = doc(firestore, "users", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return null;
  }
};

// Save user notification preferences to Firestore
const saveUserNotificationPreferences = async (
  uid: string | null,
  notificationPreferences: any,
  walletAddress: string
) => {
  if (!uid) return;

  const docRef = doc(firestore, "users", uid);
  await setDoc(docRef, {
    walletAddress,
    notificationPreferences,
  });
};

export {
  app,
  auth,
  push,
  database,
  ref,
  onValue,
  signInWithGoogle,
  signInWithGithub,
  signInWithEmailPassword,
  createAccountWithEmailPassword,
  pushTransaction,
  listenToTransactions,
  pushAiInsights,
  storeJsonData,
  storeUserId,
  storeSanctionedAddress,
  triggerEmailNotification,
  getUserNotificationPreferences,
  saveUserNotificationPreferences, // Export for triggering email
};
