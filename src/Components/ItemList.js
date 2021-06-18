import React, { useState } from "react";
import { storage, db } from "../Databases/firebase";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";
import firebase from "firebase";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function ItemList({ itemId, item }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openEditImage, setOpenEditImage] = useState(false);
  const [modalStyle] = useState(getModalStyle);
  const [name, setItemName] = useState(item.itemName);
  const [hargaJual, setHargaJual] = useState(item.hargaJual);
  const [hargaBeli, setHargaBeli] = useState(item.hargaBeli);
  const [stock, setStock] = useState(item.stock);
  const [image, setImage] = useState(item.imageUrl);

  const deletehandler = () => {
    db.collection("items").doc(itemId).delete();
    alert("Delete success");
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleOpenEdit = () => setOpenEdit(true);
  const handleCloseEdit = () => setOpenEdit(false);
  const handleOpenEditImage = () => setOpenEditImage(true);
  const handleCloseEditImage = () => setOpenEditImage(false);

  const handleInputFile = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleEdit = (event) => {
    event.preventDefault();
    db.collection("items").doc(itemId).update({
      itemName: name,
      hargaJual: hargaJual,
      hargaBeli: hargaBeli,
      stock: stock,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setOpenEdit(false);
  };

  const changeImageHandler = () => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // progress function...
        console.log(snapshot);
      },
      (error) => {
        // error function...
        console.log(error);
      },
      () => {
        //   complete Function...
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            // Post images to database
            db.collection("items")
              .doc(itemId)
              .set({ imageUrl: url }, { merge: true });
            setImage(null);
            setOpenEditImage(false);
            alert("Upload Success");
          });
      }
    );
  };

  return (
    <>
      {/* Change Image Modal */}
      <div className="image__modal">
        <Modal open={openEditImage} onClose={handleCloseEditImage}>
          <div style={modalStyle} className={classes.paper}>
            <form>
              <input type="file" onChange={handleInputFile} />
              <img src={image} alt={name} class="img-thumbnail"></img>
            </form>
            <br />
            <button
              className="btn btn-primary"
              type="submit"
              onClick={changeImageHandler}
            >
              Submit
            </button>
          </div>
        </Modal>
      </div>
      {/* Edit Modal */}
      <div className="edit__modal">
        <Modal open={openEdit} onClose={handleCloseEdit}>
          <div style={modalStyle} className={classes.paper}>
            <form>
              <div className="form-group">
                <label>Item Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(event) => setItemName(event.target.value)}
                  placeholder="Masukan Nama Item"
                />
              </div>

              <div className="form-group">
                <label>Harga Beli</label>
                <input
                  type="number"
                  className="form-control"
                  value={hargaBeli}
                  onChange={(event) => setHargaBeli(event.target.value)}
                  placeholder="Masukan Harga Beli"
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
                />
              </div>

              <br />
              <button
                type="submit"
                className="btn btn-primary"
                style={{ marginTop: "10px" }}
                onClick={handleEdit}
              >
                Submit
              </button>
            </form>
          </div>
        </Modal>
      </div>
      {/* Delete Modal */}
      <div className="delete__modal">
        <Modal open={open} onClose={handleClose}>
          <div style={modalStyle} className={classes.paper}>
            <form className="formDelete__modal">
              <center>
                <h2>Delete Confirmation</h2>
                <p>Delete this item ?</p>
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ margin: "2px" }}
                  onClick={handleClose}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  style={{ margin: "2px" }}
                  onClick={deletehandler}
                >
                  Delete
                </button>
              </center>
            </form>
          </div>
        </Modal>
      </div>
      {/* Card item list */}
      <div className="row">
        <div className="card" style={{ margin: "10px" }}>
          <div className="row g-0">
            <div className="col-md-4">
              <img src={image} className="card-img" alt={name} />
            </div>
            <div className="col-md-8">
              <div className="card-body">
                <h5 className="card-title">{name}</h5>
                <p className="card-text">
                  Harga Jual: <strong>Rp.{hargaJual}</strong>
                </p>
                <p className="card-text">
                  harga Beli: <strong>Rp.{hargaBeli}</strong>
                </p>
                <p className="card-text">
                  <small>Stock: {stock}</small>
                </p>
                <button
                  className="btn btn-secondary"
                  style={{ margin: "2px" }}
                  onClick={handleOpenEditImage}
                >
                  Edit Image
                </button>
                <button
                  className="btn btn-primary"
                  style={{ margin: "2px" }}
                  onClick={handleOpenEdit}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  style={{ margin: "2px" }}
                  onClick={handleOpen}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ItemList;
