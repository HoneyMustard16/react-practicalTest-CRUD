import React, { useState, useEffect } from "react";
import "./App.css";
import Form from "./Components/Form";
import ItemList from "./Components/ItemList";
import { db } from "./Databases/firebase";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [items, setItems] = useState([]);

  // use effect for mapping posts
  useEffect(() => {
    db.collection("items")
      // .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setItems(
          snapshot.docs.map((doc) => ({ id: doc.id, item: doc.data() }))
        );
      });
  }, []);

  console.log(items);

  return (
    <div className="container">
      <h1>CRUD</h1>
      <div className="row">
        <div
          className="col-md-6"
          style={{ border: "1px solid", paddingBottom: "10px" }}
        >
          <h2>Item List</h2>
          <div className="row">
            {items.map(({ id, item }) => (
              <ItemList key={id} itemId={id} item={item} />
            ))}
          </div>
        </div>
        <div
          className="col-md-6"
          style={{ border: "1px solid", paddingBottom: "10px" }}
        >
          <h2>Item</h2>
          <div className="row">
            <Form />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
