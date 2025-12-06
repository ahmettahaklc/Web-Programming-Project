import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AddCasePage() {
  const [formData, setFormData] = useState({ 
    caseTitle: '',
    clientName: '',
    clientSurname: '',
    court: '',
    startDate: '',
    caseSituation: '' 
  });

  const containerRef = useRef(null);  
  const navigate = useNavigate();

  useEffect(() => {
    const targetElement = containerRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if(entry.isIntersecting) {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/case', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ 
          DavaBasligi: formData.caseTitle,
          MuvekkilAd: formData.clientName,
          MuvekkilSoyad: formData.clientSurname,
          Mahkeme: formData.court,
          AcilisTarihi: formData.startDate,
          Durum: formData.caseSituation
        })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message);
      }

      const data = await response.json();
      alert('Dava başarıyla oluşturuldu!');
      navigate('/CaseManagementPage'); 
    } catch (error) {
      alert('Hata: ' + error.message);
    }
  };

  return (
    <div 
      className="container login-container"  
      ref={containerRef}
    >
      <h2>Yeni Dava Ekle</h2>
      <form onSubmit={handleSubmit}>
        {/* Form alanları */}
        <div className="mb-3">
          <label>Dava Başlığı</label>
          <input
            type="text"
            name="caseTitle"
            className="form-control"
            value={formData.caseTitle}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Müvekkil Ad</label>
          <input
            type="text"
            name="clientName"
            className="form-control"
            value={formData.clientName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Müvekkil Soyad</label>
          <input
            type="text"
            name="clientSurname"
            className="form-control"
            value={formData.clientSurname}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Mahkeme</label>
          <input
            type="text"
            name="court"
            className="form-control"
            value={formData.court}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Başlangıç Tarihi</label>
          <input
            type="date"
            name="startDate"
            className="form-control"
            value={formData.startDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Dava Durumu</label>
          <input
            type="text"
            name="caseSituation"
            className="form-control"
            value={formData.caseSituation}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-info">
          Kaydet
        </button>
      </form>
    </div>
  );
}

export default AddCasePage;
