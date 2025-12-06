  import React, { useState, useEffect, useRef } from 'react';
  import { useParams, useNavigate } from 'react-router-dom';

  function EditClientPage() {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const containerRef = useRef(null);

    const [formData, setFormData] = useState({
      name: '',
      surname: '',
      phone: '',
      email: ''
    });

    useEffect(() => {
      const fetchClient = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`http://localhost:5000/api/editclient/${id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            credentials: 'include',
          });

          if (!response.ok) {
            throw new Error('Müvekkil bilgileri alınamadı.');
          }

          const data = await response.json();
          setFormData({
            name: data.MIsim || '',
            surname: data.MSoyisim || '',
            phone: data.MTel || '',
            email: data.MMmail || '',
          });
        } catch (error) {
          alert(error.message);
        }
      };

      fetchClient();
    }, [id]);

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
      setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const token = localStorage.getItem('token');


        const response = await fetch(`http://localhost:5000/api/editclient/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: formData.name,
            surname: formData.surname,
            phone: formData.phone,
            email: formData.email,
          }),
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.message || 'Güncelleme başarısız.');
        }
        
        const data = await response.json();
        alert('Müvekkil bilgileri başarıyla güncellendi!');


        navigate('/ClientManagementPage');
      } catch (error) {
        alert('Hata: ' + error.message);
      }
    };

    return (
      <div ref={containerRef} className="editclientpage-container container">
        <h2>Müvekkil Bilgilerini Düzenle</h2>
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
          <button type="submit" className="btn btn-primary">Kaydet</button>
        </form>
      </div>
    );
  }

  export default EditClientPage;
