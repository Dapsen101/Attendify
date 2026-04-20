// This is the entry point for the React application.
// It imports React, ReactDOM, and the main App component.
// The app is wrapped in BrowserRouter for client-side routing,
// and rendered into the DOM element with id 'root'.
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);