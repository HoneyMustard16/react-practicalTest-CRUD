import React, { useState } from "react";
import { storage, db } from "../Databases/firebase";
import firebase from "firebase";
import "../Form.css";

function Form() {
  const [name, setName] = useState("");
  const [hargaJual, setHargaJual] = useState(0);
  const [hargaBeli, setHargaBeli] = useState(0);
  const [stock, setStock] = useState(0);
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleInputFile = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = (event) => {
    //   access firestore, crate image folder put selected file in input form, into firebase image folder
    event.preventDefault();
    const uploadTask = storage.ref(`images/${image.name}`).put(image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // progress function...
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        // error function...
        console.log(error);
        alert(error.message);
      },
      () => {
        //   complete Function...
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            // Post images to database
            db.collection("items").add({
              itemName: name,
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              hargaJual: hargaJual,
              hargaBeli: hargaBeli,
              stock: stock,
              imageUrl: url,
            });
            setProgress(0);
            setImage(null);
            setStock(0);
            setHargaBeli(0);
            setHargaJual(0);
            setName("");
            alert("Upload Success");
          });
      }
    );
  };

  return (
    <>
      <form>
        <div className="form-group">
          <div className="itemName">
            <label>Item Name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Masukan Nama Item"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Harga Beli</label>
          <input
            type="number"
            className="form-control"
            value={hargaBeli}
            onChange={(event) => setHargaBeli(event.target.value)}
            placeholder="Masukan Harga Beli"
            required
          />
        </div>

        <div className="form-group">
          <label>Harga Jual</label>
          <input
            type="number"
            className="form-control"
            value={hargaJual}
            onChange={(event) => setHargaJual(event.target.value)}
            placeholder="Masukan harga Jual"
            required
          />
        </div>

        <div className="form-group">
          <label>Stock</label>
          <input
            type="number"
            className="form-control"
            value={stock}
            onChange={(event) => setStock(event.target.value)}
            placeholder="Masukan Jumlah Stock"
            required
          />
        </div>

        <div className="app__imageUpload">
          <progress
            className="app__progressBar"
            value={progress}
            max="100"
          ></progress>

          <input type="file" onChange={handleInputFile} required />
          <br />
          <button
            type="submit"
            className="btn btn-primary"
            style={{ marginTop: "10px" }}
            onClick={handleUpload}
          >
            Submit
          </button>
        </div>
      </form>
    </>
  );
}

export default Form;
