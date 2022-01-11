import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import { useState, useEffect} from 'react';

const firebaseConfig = {
  apiKey: "AIzaSyALoztplEI6Dvg8J8qdusStOjek5uwNyU0",
  authDomain: "scheduler-e649d.firebaseapp.com",
  databaseURL: "https://scheduler-e649d-default-rtdb.firebaseio.com",
  projectId: "scheduler-e649d",
  storageBucket: "scheduler-e649d.appspot.com",
  messagingSenderId: "778279075817",
  appId: "1:778279075817:web:dd6feb470fea2e1e5b1578"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();


export const useData = (path, transform) => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    const dbRef = database.ref(path);
    const devMode = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
    if (devMode) { console.log(`loading ${path}`); }
    return dbRef.on('value', (snapshot) => {
      const val = snapshot.val();
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