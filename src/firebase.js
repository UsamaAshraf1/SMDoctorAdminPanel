import { getMessaging, onMessage, getToken } from "firebase/messaging";
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCRgnqpOobPwjvzvBKJsgyFQViN3TufteA",
  authDomain: "smart-care-ca9ee.firebaseapp.com",
  projectId: "smart-care-ca9ee",
  storageBucket: "smart-care-ca9ee.firebasestorage.app",
  messagingSenderId: "900524263296",
  appId: "1:900524263296:web:c81deab9107eca4b5be365",
  measurementId: "G-J8PV49805L",
};

const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
const messaging = getMessaging(firebaseApp);

// Get registration token. Initially this makes a network call, once retrieved
// subsequent calls to getToken will return from cache.
export const fetchToken = (setTokenFound, setFcmToken) => {
  return getToken(messaging, {
    vapidKey:
      "BKAD7SdrBmp9TIgQShG-k9T7NwxN9RRJNON3-wc_-4iqBpssKlkSDLtqeWt4exrDPUykX5RcrClIOYhewQtzJ_o",
  })
    .then((currentToken) => {
      if (currentToken) {
        // Send the token to your server and update the UI if necessary
        setTokenFound(true);
        setFcmToken(currentToken);
      } else {
        // Show permission request UI
        console.log(
          "No registration token available. Request permission to generate one."
        );
        setTokenFound(false);
        setFcmToken("");
      }
    })
    .catch((err) => {
      console.log("An error occurred while retrieving token. ", err);
      // ...
    });
};

export const onMessageListner = () => {
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("Message received. ", payload);
      // ...
    });
  });
};
