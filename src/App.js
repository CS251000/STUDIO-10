import React, { useState } from 'react';
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import Nav from "./components/Nav";
import Home from "./components/Home";
import AddItem from "./components/AddItem";
import CardDetails from "./components/CardDetails";
import Reordered from "./components/Reordered";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ProtectedRoute from './components/ProtectedRouter';
import { AuthProvider } from "./hooks/useAuth";

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
      { index: true, element: <ProtectedRoute><Home /></ProtectedRoute> },
      { path: "/:itemId", element: <ProtectedRoute><CardDetails /></ProtectedRoute> },
      { path: "add", element: <ProtectedRoute><AddItem /></ProtectedRoute> },
      { path: "reordered", element: <ProtectedRoute><Reordered /></ProtectedRoute> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> }
    ]
  }
]);

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
