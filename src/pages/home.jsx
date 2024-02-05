import React, { Component } from "react";
import Modal from "react-modal";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { db } from "../firebase/firebase";
import "../css/home.css";
import Create from "./create";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0, y: -50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, easing: "easeInOut" },
  },
};
class Home extends React.Component {
  constructor(props) {
    super(props);
    // State untuk menyimpan data todo, pesan error, todo yang dipilih, dan status popup delete
    this.state = {
      todos: [],
      error: "",
      selectedTodo: null,
      showDeletePopup: false,
      showUpdate: false,
      selectedUserId: "",
      users: [],
      prevTodos: [],
      showAddedModal: false, // tambahkan state users
    };
  }

  // Lifecycle method: dijalankan setelah komponen di-mount pada DOM

  componentDidMount() {
    // Mendapatkan koleksi "todos" dari Firestore
    const todoCollection = collection(db, "todos");

    // Mengambil data todos dari Firestore
    getDocs(todoCollection)
      .then(async (snapshot) => {
        // Mengonversi data snapshot ke dalam bentuk array of objects
        const todos = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Mendapatkan koleksi "user" dari Firestore
        const userCollection = collection(db, "user");

        // Mengambil data users dari Firestore
        const userSnapshot = await getDocs(userCollection);
        const users = userSnapshot.docs.map((userDoc) => ({
          id: userDoc.id,
          ...userDoc.data(),
        }));

        // Mengambil data user untuk setiap todo
        for (const todo of todos) {
          const user = users.find((user) => user.id === todo.userId);
          if (user) {
            todo.userName = user.nama;
          }
        }

        // Mengupdate state dengan data todos dan users
        this.setState({ todos, users });
      })
      .catch((error) => {
        // Menghandle kesalahan dan menyimpan pesan error pada state
        this.setState({ error: error.message });
      });
  }

  // Fungsi untuk memperbarui state setelah data ditambahkan
  handleTodoAdded = () => {
    // Panggil kembali metode yang digunakan untuk mendapatkan data dari Firebase
    this.componentDidMount();
  };

  // Handler untuk mengatur todo yang dipilih untuk diupdate
  handleUpdateClick = (todo) => {
    const selectedUserId = todo.userId;
    this.setState({
      selectedTodo: todo,
      showUpdate: true,
      selectedUserId,
    });
  };
  handleUpdate = async (updatedData) => {
    const { selectedTodo } = this.state;
    const db = getFirestore();
    const todoDocRef = doc(db, "todos", selectedTodo.id);

    await updateDoc(todoDocRef, updatedData);

    // Refresh the todo list after update
    this.componentDidMount();

    // Clear the selectedTodo state
    this.setState({ selectedTodo: null, showUpdate: false });
  };

  // Handler untuk mengatur todo yang dipilih untuk dihapus dan menampilkan popup delete
  handleDeleteClick = (todo) => {
    this.setState({ selectedTodo: todo, showDeletePopup: true });
  };
  handleAddClick = (showAddedModal) => {
    if (showAddedModal == true) {
      this.setState({ showAddedModal: false });
    }

    if (showAddedModal == false) {
      this.setState({ showAddedModal: true });
    }
  };

  // Handler untuk menghapus todo yang dipilih
  handleDelete = async () => {
    const { selectedTodo } = this.state;
    const db = getFirestore();
    const todoDocRef = doc(db, "todos", selectedTodo.id);

    // Menghapus dokumen todo dari Firestore
    await deleteDoc(todoDocRef);

    // Refresh daftar todo setelah penghapusan
    this.componentDidMount();

    // Membersihkan state selectedTodo dan menyembunyikan popup delete
    this.setState({ selectedTodo: null, showDeletePopup: false });
  };

  render() {
    const {
      todos,
      error,
      selectedTodo,
      showDeletePopup,
      showUpdate,
      selectedUserId,
      users,
      showAddedModal,
    } = this.state;

    return (
      <>
        <button
          type="submit"
          className="add-button"
          onClick={() => this.handleAddClick(showAddedModal)}
        >
          Add Todo
        </button>

        {showAddedModal && (
          <>
            <motion.div
              className="main"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <Create onTodoAdded={this.handleTodoAdded} />
            </motion.div>
          </>
        )}

        <div className="main">
          <div className="list-todo">
            {error && <div className="error mb-4">{error}</div>}
            {todos.length > 0 ? (
              <table className="">
                <thead>
                  <tr className="bg-gray-800 text-white">
                    <th className="py-2 px-4">Name</th>
                    <th className="py-2 px-4">Title</th>
                    <th className="py-2 px-4">Description</th>
                    <th className="py-2 px-4">Status</th>
                    <th className="py-2 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {todos.map((todo) => (
                    <tr key={todo.id} className="">
                      <td className="py-2 px-4">{todo.userName}</td>
                      <td className="py-2 px-4">{todo.title}</td>
                      <td className="py-2 px-4">{todo.description}</td>
                      <td className="py-2 px-4">
                        {todo.completed == true ? (
                          <>
                            <div className="status-true">
                              <p>Completed</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="status-false">
                              <p>Pending</p>
                            </div>
                          </>
                        )}
                      </td>

                      <td className="py-2 px-4">
                        <button
                          onClick={() => this.handleUpdateClick(todo)}
                          className="read-button"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => this.handleDeleteClick(todo)}
                          className="read-button"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="mt-4">Belum ada data todo.</div>
            )}

            {showUpdate && (
              <div>
                <Modal
                  isOpen={showUpdate}
                  onRequestClose={() => this.setState({ showUpdate: false })}
                  contentLabel="Update Todo"
                  style={{
                    overlay: {
                      backgroundColor: "rgba(0, 0, 0, 0.75)",
                    },
                    content: {
                      top: "50%",
                      left: "50%",
                      right: "auto",
                      bottom: "auto",
                      marginRight: "-50%",
                      transform: "translate(-50%, -50%)",
                      width: "500px",
                      borderRadius: "10px",
                      padding: "20px",
                      backgroundImage:
                        "linear-gradient(100deg, #575656, #062e3f)",
                    },
                  }}
                >
                  <h2>Update Todo</h2>
                  <div className="update">
                    User:
                    <div className="user">
                      <select
                        className="read-data"
                        value={selectedUserId}
                        onChange={(e) =>
                          this.setState({ selectedUserId: e.target.value })
                        }
                      >
                        {users.map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.nama}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="update">
                    Title:{" "}
                    <input
                      type="text"
                      value={selectedTodo.title}
                      onChange={(e) =>
                        this.setState((prevState) => ({
                          selectedTodo: {
                            ...prevState.selectedTodo,
                            title: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>
                  <div className="update">
                    Description:{" "}
                    <input
                      type="text"
                      value={selectedTodo.description}
                      onChange={(e) =>
                        this.setState((prevState) => ({
                          selectedTodo: {
                            ...prevState.selectedTodo,
                            description: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>
                  <button
                    className="update-btn"
                    onClick={() => this.handleUpdate(selectedTodo)}
                  >
                    Save Update
                  </button>
                </Modal>
              </div>
            )}

            {showDeletePopup && (
              <div className="delete-popup">
                <Modal
                  isOpen={showDeletePopup}
                  onRequestClose={() =>
                    this.setState({ showDeletePopup: false })
                  }
                  contentLabel="Delete Todo"
                  style={{
                    overlay: {
                      backgroundColor: "rgba(0, 0, 0, 0.75)",
                    },
                    content: {
                      top: "50%",
                      left: "50%",
                      right: "auto",
                      bottom: "auto",
                      marginRight: "-50%",
                      transform: "translate(-50%, -50%)",
                      width: "500px",
                      borderRadius: "10px",
                      padding: "20px",
                      backgroundImage:
                        "linear-gradient(100deg, #575656, #062e3f)",
                    },
                  }}
                >
                  <h2>Hapus Todo</h2>
                  <p>Apakah Anda yakin ingin menghapus todo ini?</p>
                  <div>
                    <button className="read-button" onClick={this.handleDelete}>
                      Ya
                    </button>
                    <button
                      className="read-button"
                      onClick={() => this.setState({ showDeletePopup: false })}
                    >
                      Tidak
                    </button>
                  </div>
                </Modal>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }
}

export default Home;
