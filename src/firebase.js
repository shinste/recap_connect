import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDeZOYIniKLorrj69jc5lpL9Q0gNxGUrAg",
  authDomain: "hcde-439-todo-project.firebaseapp.com",
  projectId: "hcde-439-todo-project",
  storageBucket: "hcde-439-todo-project.appspot.com",
  messagingSenderId: "734453508493",
  appId: "1:734453508493:web:aa0aef67fa4ede8a9bb5c4"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const storage = getStorage(app);
