import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function EditCasePage() {
  const { davaId } = useParams();
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const [formData, setFormData] = useState({ 
    caseTitle: '',
    clientName: '',
    clientSurname: '',
    court: '',
    startDate: '',
    caseSituation: '1',
  });

  useEffect(() => {
    if (!davaId) return;

    const fetchCase = async () => {
      try {
        const token = localStorage.getItem('token');

        const res = await fetch(`http://localhost:5000/api/editcase/${davaId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) {
          throw new Error('Dava bulunamadı veya yetkiniz yok');
        }

        const data = await res.json();

        setFormData({ 
          caseTitle: data.DavaBasligi || '',
          clientName: data.MuvekkilAd || '',
          clientSurname: data.MuvekkilSoyad || '',
          court: data.Mahkeme || '',
          startDate: data.AcilisTarihi ? data.AcilisTarihi.split('T')[0] : '',
          caseSituation: data.Durum !== undefined ? String(data.Durum) : '1',
        });
      } catch (err) {
        alert(err.message);
        navigate('/CaseManagementPage');
      }
    };

    fetchCase();
  }, [davaId, navigate]);

  useEffect(() => {
  const target = containerRef.current;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        } else {
          entry.target.classList.remove("active");
        }
      });
    },
    { threshold: 0.3 }
  );

  if (target) observer.observe(target);

  return () => {
    if (target) observer.unobserve(target);
  };
}, []);


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
      console.log(formData.caseSituation);

      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/editcase/${davaId}`, {
        method: 'PUT',
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
          Durum: formData.caseSituation,
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Dava güncellenirken hata oluştu.');
      }

      alert('Dava başarıyla güncellendi.');
      navigate('/CaseManagementPage');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div ref={containerRef} className="editcasepage-container container">
      <h2>Dava Bilgilerini Düzenle</h2>
      <form onSubmit={handleSubmit}>
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
          <label>Muvekkil Ad</label>
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
          <label>Muvekkil Soyad</label>
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
          <label>Açılış Tarihi</label>
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
          <select
            name="caseSituation"
            className="form-control"
            value={formData.caseSituation}
            onChange={handleChange}
            required
          >
            <option value="1">Aktif</option>
            <option value="0">Kapandı</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary me-2">Kaydet</button>
      </form>
    </div>
  );
}

export default EditCasePage;
