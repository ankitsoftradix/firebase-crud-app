import { useEffect, useState } from "react";
import "./App.css";
import { auth, db } from "./firebase-config";
import _ from "lodash";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  doc,
  addDoc,
  collection,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";

function App() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: "", age: "" });
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({ email: "", password: "" });
  const userCollectionRef = collection(db, "users");
  const [authUser, setAuthUser] = useState({});

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setAuthUser(currentUser);
    });
  }, []);

  useEffect(() => {
    console.log("authUser ==> ", authUser);
  }, [authUser]);

  const register = async () => {
    try {
      const user = await createUserWithEmailAndPassword(
        auth,
        registerData.email,
        registerData.password
      );
      console.log("user ==> ", user);
    } catch (error) {
      console.log("error ==> ", error.message);
    }
  };
  const login = async () => {
    try {
      const user = await signInWithEmailAndPassword(
        auth,
        loginData.email,
        loginData.password
      );
      console.log("user ==> ", user);
    } catch (error) {
      console.log("error ==> ", error.message);
    }
  };
  const logout = async () => {
    await signOut(auth);
  };

  const createUser = async () => {
    await addDoc(userCollectionRef, newUser);
    setNewUser({ name: "", age: "" });
  };
  const updateUser = async (id, age) => {
    const userDoc = doc(db, "users", id);
    await updateDoc(userDoc, { age: Number(age) + 1 });
  };
  const deleteUser = async (id) => {
    const userDoc = doc(db, "users", id);
    await deleteDoc(userDoc);
  };
  const createSubCollection = async (id) => {
    const subCollectionRef = collection(db, "users", id, "subCollection");
    await addDoc(subCollectionRef, { name: "Ankit Grin", age: 20 });
  };

  const renderUsers = (user, index) => {
    return (
      <div
        key={index}
        style={{
          display: "flex",
          // margin: "10px",
          alignItems: "center",
          flexDirection: "column",
          gap: "10px",
          padding: "10px",
          borderBottom: "1px solid grey",
        }}
      >
        <span>Name : {user.name}</span>
        <span>Age : {user.age}</span>
        <button
          onClick={() => {
            updateUser(user.id, user.age);
          }}
        >
          Increase age
        </button>
        <button
          onClick={() => {
            deleteUser(user.id);
          }}
        >
          Delete user
        </button>
        <button
          onClick={() => {
            createSubCollection(user.id);
          }}
        >
          Create Subcollection
        </button>
      </div>
    );
  };
  onSnapshot(userCollectionRef, (snapshot) => {
    setUsers(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  });

  return (
    <div className="App">
      {authUser == null ? (
        <>
          <div>
            <h3>Register User</h3>
            <input
              placeholder="Email..."
              onChange={(e) =>
                setRegisterData({ ...registerData, email: e.target.value })
              }
            />
            <input
              placeholder="Password..."
              onChange={(e) =>
                setRegisterData({ ...registerData, password: e.target.value })
              }
            />
            <button onClick={register}>Create User</button>
          </div>
          <div>
            <h3>Login</h3>
            <input
              placeholder="Email..."
              onChange={(e) =>
                setLoginData({ ...loginData, email: e.target.value })
              }
            />
            <input
              placeholder="Password..."
              onChange={(e) =>
                setLoginData({ ...loginData, password: e.target.value })
              }
            />
            <button onClick={login}>Login</button>
          </div>
        </>
      ) : _.isEmpty(authUser) ? (
        <></>
      ) : (
        <>
          <div>
            <h3>User Logged In</h3>
            {authUser?.email}
            <button onClick={logout}>Sign Out</button>
          </div>
          <h3>Add User</h3>
          <input
            value={newUser.name}
            placeholder="Name..."
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          />
          <input
            value={newUser.age}
            type="number"
            placeholder="Age..."
            onChange={(e) => setNewUser({ ...newUser, age: e.target.value })}
          />
          <button onClick={createUser}>Create User</button>

          {users.map(renderUsers)}
        </>
      )}
    </div>
  );
}

export default App;
