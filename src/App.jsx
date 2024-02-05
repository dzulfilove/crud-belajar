// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavbarComp from "./components/navbar";
import Home from "./pages/home";
import Create from "./pages/create";
import "./app.css";
import "bootstrap/dist/css/bootstrap.min.css";
import TodoCard from "../src/components/card";
import "../src/css/home.css";

const App = () => {
  return (
    <Router>
      <div>
        <NavbarComp />
        <div id="header">
          {/* <div className="flexrow-container">
            <div className="standard-theme theme-selector"></div>
            <div className="light-theme theme-selector"></div>
            <div className="darker-theme theme-selector"></div>
          </div> */}
          <h1 className="title">
            To Do List<div id="border"></div>
          </h1>
        </div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<Create />} />
          <Route path="/read" element={<TodoCard />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
