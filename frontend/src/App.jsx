import React from "react";
import Home from "./home/Home";
import { Navigate, Route, Routes } from "react-router-dom";
import Courses from "./courses/Courses";
import Signup from "./components/Signup";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./context/AuthProvider";
import Contact from "./components/Contact";
import Contacts from "./Contacts/Contacts";
import Abouts from "./Abouts/Abouts";
import Login from "./components/Login";

function App() {
  const [authUser, setAuthUser] = useAuth();
  console.log(authUser);
  return (
    <>
      <div className="dark:bg-slate-900 dark:text-white">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/course"
            element={authUser ? <Courses /> : <Navigate to="/signup" />}
          />
          {/* <Route
            path="/contact"
            element={authUser ? <Contact /> : <Navigate to="/signup" />}
          /> */}
          <Route path="/contact" element={<Contacts />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<Abouts />} />
        </Routes>
        <Toaster />
      </div>
    </>
  );
}

export default App;
