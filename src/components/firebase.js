import firebase from "firebase/app";
import "firebase/messaging";
import { toast } from "react-toastify";

const firebaseConfig = {
  apiKey: "AIzaSyByzEcxRmKn3AVeby5fCZTCQ1kHW3hJLoc",
  authDomain: "petsetgo-28dd4.firebaseapp.com",
  projectId: "petsetgo-28dd4",
  storageBucket: "petsetgo-28dd4.appspot.com",
  messagingSenderId: "433782501904",
  appId: "1:433782501904:web:e77a44780f25dbefbf9095",
  measurementId: "G-1XE6D3HKK6",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();
messaging.onMessage((payload) => {
  toast(payload.notification.title);
});

export { messaging };
