import React, { useState } from 'react';
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import Nav from "./components/Nav";
import Home from "./components/Home";
import AddItem from "./components/AddItem";
import CardDetails from "./components/CardDetails";
import Reordered from "./components/Reordered";
import Login from "./components/Login";
import Signup from "./components/Signup";


const Layout = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      <Nav onSearch={setSearchQuery} />
      <Outlet context={{ searchQuery }} />
    </>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home/> },
      { path: "/:itemId", element: <CardDetails /> },
      { path: "add", element: <AddItem /> },
      { path: "reordered", element: <Reordered /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> }

    ]
  }
]);

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}
