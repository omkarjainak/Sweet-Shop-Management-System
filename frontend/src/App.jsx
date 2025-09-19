// src/App.jsx
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login, NotFound, SignUp, Sweet, Home,Users,Inventory} from "./pages";
import { Main } from "./layouts";

function App() {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Protected routes */}
        {token !== null ? (
          <Route path="/" element={<Main />}>
            <Route index element={<Sweet/>} />
            <Route path="sweet" element={<Sweet />} />
            <Route path="users" element={<Users />} />
            <Route path="inventory" element={<Inventory />} />
          </Route>
        ) : (
          // If no token, unknown paths go to NotFound
          <Route path="*" element={<NotFound />} />
        )}

        {/* Fallback route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
