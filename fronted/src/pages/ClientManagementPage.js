  import React, { useState, useEffect, useRef } from 'react';
  import { useNavigate } from 'react-router-dom';

  function ClientManagementPage({ user }) {
    const [clients, setClients] = useState([]);
    const navigate = useNavigate();
    const containerRef = useRef(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem("token"); 

        const response = await fetch('http://localhost:5000/api/ClientManagementPage', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          },
          credentials: 'include' 
        });

        if (!response.ok) {
          throw new Error('Veri çekme hatası');
        }

        const data = await response.json();
              console.log("API'den gelen veri:", data); 

        setClients(data.clients || []);
      } catch (error) {
        console.error('Client verisi alınamadı:', error);
      }
    };

    fetchClients();
  }, []);

  useEffect(() => {
  const targetElement = containerRef.current;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
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



    
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Müvekkili silmek istediğinize emin misiniz?');
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token"); 

      const response = await fetch(`http://localhost:5000/api/deleteclient/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Silme işlemi başarısız.');
      }

      setClients(prevClients => prevClients.filter(client => client.MID !== id));
      alert('Müvekkil başarıyla silindi.');
    } catch (error) {
      alert('Hata: ' + error.message);
    }
  };


    const handleAddClick = () => {
      navigate('/AddClient');
    };

    const handleEditClick = (id) => {
      navigate(`/EditClient/${id}`);
    };

    return (
      <div ref={containerRef} className="client-management-container">
        <h2>Müvekkil Yönetimi</h2>
        <button className="btn btn-success my-2" onClick={handleAddClick}>Yeni Müvekkil Ekle</button>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>İsim</th>
              <th>Soyisim</th>
              <th>Telefon</th>
              <th>Email</th>
              <th>İşlem</th>
            </tr>
          </thead>
          <tbody>
            {clients.length > 0 ? (
              clients.map(client => (
                <tr key={client.MID}>
                  <td>{client.MIsim}</td>
                  <td>{client.MSoyisim}</td>
                  <td>{client.MTel}</td>
                  <td>{client.MMmail}</td>
                  <td>
                    <button className="btn btn-sm btn-primary me-2" onClick={() => handleEditClick(client.MID)}>Düzenle</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(client.MID)}>Sil</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">Kayıtlı müvekkil yok</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }

  export default ClientManagementPage;
