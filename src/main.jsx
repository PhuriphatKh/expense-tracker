import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, createBrowserRouter, RouterProvider } from "react-router";
import App from "./App";
import AddExpense from "./components/AddExpense";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
]);

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <RouterProvider router={router} />
);