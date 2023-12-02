// Login.js
import React, { useState } from "react";
import './loginStyle.css'

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Add your authentication logic here
    // For simplicity, let's assume the login is successful
    const user = { username, password };
    onLogin(user);
  };

  return (
    <div className="container">

   
    <div className="login">
      <h1>Login Page</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
    </div>
  );
};

export default Login;
