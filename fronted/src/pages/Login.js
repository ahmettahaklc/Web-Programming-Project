import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import './style.css';

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const targetRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const targetElement = targetRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.isIntersecting
            ? entry.target.classList.add("active")
            : entry.target.classList.remove("active");
        });
      },
      { threshold: 0.3 }
    );

    if (targetElement) observer.observe(targetElement);

    return () => {
      if (targetElement) observer.unobserve(targetElement);
    };
  }, []);

const handleSubmit = async (e) => {
  e.preventDefault();
  setError(null);

  try {
    const response = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      navigate('/dashboard');    
    } else {
      setError(data.message || 'Giriş başarısız');
    }
  } catch (error) {
    console.error("Hata yakalandı:", error);
    setError('Sunucu ile bağlantı kurulamadı');
  }
};

  return (
    <div className="background">
      <div
        ref={targetRef}
        className="container login-container d-flex justify-content-center align-items-center vh-100"
      >
        <div
          className="card p-4 shadow"
          style={{
            width: "100%",
            maxWidth: "600px",
            backgroundColor: "rgba(0, 0, 0, 0.1)",
          }}
        >
          <h3 className="text-center mb-4">Giriş Yap</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">E-posta</label>
              <input
                type="email"
                className="form-control"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@eposta.com"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Şifre</label>
              <input
                type="password"
                className="form-control"
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <button type="submit" className="btn btn-primary w-100">
              Giriş Yap
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;


 