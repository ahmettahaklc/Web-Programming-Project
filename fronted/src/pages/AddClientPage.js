
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

function AddClientPage() {
  const containerRef = useRef(null);
  const navigate = useNavigate();
  
  useEffect(() => {
  const targetElement = containerRef.current;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        } else {
          entry.target.classList.remove('active');
        }
      });
    },
    { threshold: 0.3 }
  );

  if (targetElement) observer.observe(targetElement);

  return () => {
    if (targetElement) observer.unobserve(targetElement);
  };
}, []);


  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    phone: '',
    email: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch('http://localhost:5000/api/AddClient', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error('Sunucu hatası');
    }

    const data = await response.json();
    alert('Müvekkil başarıyla eklendi!');
    setFormData({ name: '', surname: '', phone: '', email: '' });
    navigate("/ClientManagementPage")

  } catch (error) {
    alert('Müvekkil eklenirken hata oluştu: ' + error.message);
  }
};


  return (
    <div className="container login-container" ref={containerRef}>
      <h2>Yeni Müvekkil Ekle</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>İsim</label>
          <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Soyisim</label>
          <input type="text" name="surname" className="form-control" value={formData.surname} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Telefon</label>
          <input type="text" name="phone" className="form-control" value={formData.phone} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Email</label>
          <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
        </div>
        <button type="submit" className="btn btn-success">Kaydet</button>
      </form>
    </div>
  );
}

export default AddClientPage;
