import { useState } from "react";
import "./App.css";
import { db } from "./firebase-config";
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
  const userCollectionRef = collection(db, "users");

  const register = async () => {};
  const login = async () => {};
  const logout = async () => {};

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
      <>
        <div>
          <h3>Register User</h3>
          <input placeholder="Email..." />
          <input placeholder="Password..." />
          <button>Create User</button>
        </div>
        <div>
          <h3>Login</h3>
          <input placeholder="Email..." />
          <input placeholder="Password..." />
          <button>Login</button>
        </div>
      </>
      <>
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
    </div>
  );
}

export default App;
