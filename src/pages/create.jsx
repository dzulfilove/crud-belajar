import React, { Component } from "react";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { getAuthFB, db } from "../firebase/firebase";
import "../css/create.css";
import Swal from "sweetalert2";

class Create extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      description: "",
      userId: "", // tambahkan state userId
      users: [], // tambahkan state users
      error: "",
    };
  }

  componentDidMount() {
    // Ambil data user dari koleksi "users" pada Firebase
    const userCollection = collection(db, "user");

    getDocs(userCollection)
      .then((snapshot) => {
        const users = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        this.setState({ users });
      })
      .catch((error) => {
        this.setState({ error: error.message });
      });
  }

  handleSubmit = async (e) => {
    e.preventDefault();

    const todoCollection = collection(db, "todos");
    const { onTodoAdded } = this.props;

    try {
      await addDoc(todoCollection, {
        title: this.state.title,
        description: this.state.description,
        userId: this.state.userId, // gunakan userId dari state
        completed: false,
      });

      // Panggil fungsi callback untuk memberi tahu Home.jsx bahwa data telah ditambahkan
      if (this.props.onTodoAdded) {
        this.props.onTodoAdded();
      }
      this.handleReset();

      // Handle successful creation (e.g., redirect to a list of todos)
      console.log(this.state.description);
    } catch (error) {
      this.setState({ error: error.message });
    }
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleUserChange = (e) => {
    this.setState({ userId: e.target.value });
  };

  handleReset = () => {
    this.setState({
      title: "",
      description: "",
      userId: "",
    });
  };
  render() {
    return (
      <div id="form" className="create">
        <form className="create-form" onSubmit={this.handleSubmit}>
          <div>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Masukkan Judul"
              className="todo-input"
              value={this.state.title}
              onChange={this.handleChange}
            />
          </div>
          <div>
            <input
              id="description"
              placeholder="Masukkan Deskripsi"
              name="description"
              value={this.state.description}
              onChange={this.handleChange}
              className="todo-input"
            />
          </div>
          <div className="drop-user">
            <select
              id="userDropdown"
              name="userId"
              value={this.state.userId}
              onChange={this.handleUserChange}
              className="todo-input"
            >
              <option value="">Pilih User</option>
              {this.state.users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.nama}
                </option>
              ))}
            </select>
          </div>
          {this.state.error && <div className="error">{this.state.error}</div>}
          <button type="submit" className="todo-btn">
            Create Todo
          </button>
        </form>
      </div>
    );
  }
}

export default Create;
