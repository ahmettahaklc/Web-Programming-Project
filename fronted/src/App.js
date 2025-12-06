
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SignIn from "./pages/SignIn";
import TopBar from './pages/TopBar';
import Login from "./pages/Login";
import Communication from "./pages/Communicaton";
import ClientManagementPage from "./pages/ClientManagementPage";
import CaseManagementPage from "./pages/CaseManagementPage";
import Dashboard from "./pages/Dashboard";
import AddClientPage from "./pages/AddClientPage";
import EditClientPage from "./pages/EditClientPage";
import EditCasePage from "./pages/EditCasePage";
import AddCasePage from "./pages/AddCasePage";
import { useState, useEffect } from "react";


function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  return (  
    
    <Router>
      <TopBar user={user} setUser={setUser}/>
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={user ? <Navigate to="/Dashboard" /> : <Login setUser={setUser} />} />  
          <Route path="/" element={<Login setUser={setUser} />} />  
          <Route path="/Login" element={<Login setUser ={setUser} />} />
          <Route path="/SignIn" element={<SignIn />} />
          <Route path="/Dashboard" element={<Dashboard user={user} />} />
          <Route path="/Comunication" element={<Communication />} />
          <Route path="/ClientManagementPage" element={<ClientManagementPage user={user} />}/>
          <Route path="/CaseManagementPage" element={<CaseManagementPage user={user} />}/>
          <Route path="/EditClient/:id" element={<EditClientPage user={user} />}/>
          <Route path="/AddClient" element={<AddClientPage user={user} />}/>
          <Route path="/AddCase" element={<AddCasePage user={user} />}/>
          <Route path="/editcase/:davaId" element={<EditCasePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;