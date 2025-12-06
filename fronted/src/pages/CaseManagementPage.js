import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function CaseManagementPage() {
  const [cases, setCases] = useState([]);
  const navigate = useNavigate();
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("Giriş yapılmadan bu sayfaya erişilemez.");
          navigate('/login'); 
          return;
        }

        const res = await fetch('http://localhost:5000/api/CaseManagementPage', {
          headers: {
            Authorization: `Bearer ${token}`
          },
        });

        if (!res.ok) {
          throw new Error('Sunucudan hata döndü: ' + res.status);
        }
        const data = await res.json();

        const casesWithId = data.cases.map(c => ({
          ...c,
          davaId: c.DavaID,
          DavaBasligi: c.DavaBasligi,
          MuvekkilAdi: c.MuvekkilAdi,
          Mahkeme: c.Mahkeme,
          AcilisTarihi: c.AcilisTarihi,
          Durum: c.Durum
        }));

        setCases(casesWithId);
      } catch (error) {
        console.error('Fetch hatasında!', error);
      }
    };
    fetchCases();
  }, [navigate]);

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


  const handleAddClick = () => {
    navigate('/AddCase');  
  };

  const handleEditClick = (davaId) => {
    navigate(`/editcase/${davaId}`);
  };

  const handleDelete = async (davaId) => {
    if (!window.confirm('Bu davayı silmek istediğine emin misiniz?')) return;

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("Giriş yapılmadan bu sayfaya erişilemez.");
        navigate('/login'); 
        return;
      }

      const res = await fetch(`http://localhost:5000/api/deletecase/${davaId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        },
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }

      setCases((prev) => prev.filter((c) => c.davaId !== davaId));

      alert("Dava başarıyla silindi.");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div ref={containerRef} className="case-management-container">
      <h2>Dava Yönetimi</h2>
      <button className="btn btn-success my-2" onClick={handleAddClick}>
        Yeni Dava Ekle
      </button>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Dava Başlığı</th>
            <th>Müvekkil</th>
            <th>Mahkeme</th>
            <th>Açılış Tarihi</th>
            <th>Durum</th>
            <th>İşlem</th>
          </tr>
        </thead>
        <tbody>
          {cases.map((c) => (
            <tr key={c.davaId}>
              <td>{c.DavaBasligi}</td>
              <td>{c.MuvekkilAdi}</td>
              <td>{c.Mahkeme}</td>
              <td>{new Date(c.AcilisTarihi).toLocaleDateString('tr-TR')}</td>
              <td>{c.Durum}</td>
              <td>
                <button 
                    className="btn btn-sm btn-primary me-2" 
                    onClick={() => handleEditClick(c.davaId)}
                >
                    Düzenle
                </button>
                <button 
                    className="btn btn-sm btn-danger" 
                    onClick={() => handleDelete(c.davaId)}
                >
                    Sil
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CaseManagementPage;
