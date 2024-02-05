import React from "react";
import { Card, Button } from "react-bootstrap";
import { db } from "../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";

const TodoCard = () => {
  const [todos, setTodos] = React.useState([]);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    const todoCollection = collection(db, "todos");

    getDocs(todoCollection)
      .then((snapshot) => {
        const todos = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTodos(todos);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, []);

  const handleUpdateClick = (todo) => {
    // Handle update click
  };

  const handleDeleteClick = (todo) => {
    // Handle delete click
  };

  return (
    <div>
      {error && <div className="error mb-4">{error}</div>}
      {todos.length > 0 ? (
        <table className="min-w-full border border-collapse border-gray-800">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="py-2 px-4">Title</th>
              <th className="py-2 px-4">Description</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {todos.map((todo) => (
              <tr key={todo.id} className="border-t">
                <td className="py-2 px-4">{todo.title}</td>
                <td className="py-2 px-4">{todo.description}</td>
                <td className="py-2 px-4">
                  <Button
                    variant="primary"
                    onClick={() => handleUpdateClick(todo)}
                    className="bg-blue-500 text-white py-1 px-2 rounded mr-2"
                  >
                    Update
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteClick(todo)}
                    className="bg-red-500 text-white py-1 px-2 rounded"
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="mt-4">Belum ada data todo.</div>
      )}
    </div>
  );
};

export default TodoCard;
