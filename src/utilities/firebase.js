import { useState, useEffect} from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, onValue, ref, set } from 'firebase/database';
import { getAuth, GoogleAuthProvider, onIdTokenChanged, signInWithPopup, signOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyALoztplEI6Dvg8J8qdusStOjek5uwNyU0",
  authDomain: "scheduler-e649d.firebaseapp.com",
  databaseURL: "https://scheduler-e649d-default-rtdb.firebaseio.com",
  projectId: "scheduler-e649d",
  storageBucket: "scheduler-e649d.appspot.com",
  messagingSenderId: "778279075817",
  appId: "1:778279075817:web:dd6feb470fea2e1e5b1578"
};

const firebase = initializeApp(firebaseConfig);
const database = getDatabase(firebase);

// 1. Access the data with a database reference not a URL.
// 2. You don't get data directly. Instead, you subscribe to the database, by giving Firebase a function to call when the data changes.
//    That function normally will update a state variable.
export const useData = (path, transform) => {
    // Define three state variables: data, loading, error
    const [data, setData] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();

    useEffect(() => {
      const dbRef = ref(database, path);

      //This code below prints to the browser console whenever data is requested from Firebase.
      const devMode = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
      if (devMode) { console.log(`devMode loading path : ${path}`); }

      return onValue(dbRef, (snapshot) => {
        const val = snapshot.val();
        //This code below prints to the browser console whenever data is requested from Firebase.
        if (devMode) { console.log(val); }

        setData(transform ? transform(val) : val);
        setLoading(false);
        setError(null);
      }, (error) => {
        setData(null);
        setLoading(false);
        setError(error);
      });
    }, [path, transform]);

    return [data, loading, error];
};

export const setData = (path, value) => (
    set(ref(database, path), value)
);

export const signInWithGoogle = () => {
    signInWithPopup(getAuth(firebase), new GoogleAuthProvider());
};

const firebaseSignOut = () => signOut(getAuth(firebase));

export { firebaseSignOut as signOut };

export const useUserState = () => {
    const [user, setUser] = useState();

    useEffect(() => {
      onIdTokenChanged(getAuth(firebase), setUser);
    }, []);

    return [user];
};