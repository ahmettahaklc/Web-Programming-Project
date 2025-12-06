import React, { useEffect, useState, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Dashboard = () => {
  const [stats, setStats] = useState([]);
  const [recentCases, setRecentCases] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
  
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("Token bulunmadı.");
          return;
        }

        const res = await fetch("http://localhost:5000/api/dashboard/stats", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) {
          throw new Error("Sunucudan hata döndü: " + res.status);
        }

        const data = await res.json();
        setStats(data.stats);
      } catch (error) {
        console.error("Fetch hatasında.", error);
      }
    };

    fetchStats();
  }, []);

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


  useEffect(() => {
    const fetchRecentCases = async () => {
      try {
    
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("Token bulunmadı.");
          return;
        }

        const res = await fetch("http://localhost:5000/api/dashboard/recent-cases", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) {
          throw new Error("Sunucudan hata döndü: " + res.status);
        }

        const data = await res.json();
        setRecentCases(data.recentCases);
      } catch (error) {
        console.error("Fetch hatasında.", error);
      }
    };

    fetchRecentCases();
  }, []);

  return (
    <div ref={containerRef} className="dashboard-container container mt-4">
      <h2>Dashboard</h2>

      {/* İstatistik Kartları */}
      <div className="row mb-4">
        {stats.length > 0 ? (
          stats.map((stat, idx) => (
            <div className="col-md-4" key={idx}>
              <div className={`card text-white bg-${stat.bg} mb-3`}>
                <div className="card-body">
                    <h5 className="card-title">{stat.title}</h5>
                    <p className="card-text fs-4">{stat.count}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>Yükleniyor...</p>
        )}

      </div>

      {/* Son Davalar Tablosu */}
      <div className="card">
        <div className="card-header">Son Davalar</div>
        <div className="card-body">
          {recentCases.length > 0 ? (
            <table className="table table-hover">
              <thead>
                <tr>
                    <th>Dava Adı</th>
                    <th>Müvekkil</th>
                    <th>Mahkeme</th>
                    <th>Tarih</th>
                    <th>Durum</th>
                </tr>
              </thead>
              <tbody>
                {recentCases.map((item, index) => (
                    <tr key={index}>
                      <td>{item.DavaBasligi}</td>
                      <td>{item.MuvekkilAdi}</td>
                      <td>{item.Mahkeme}</td>
                      <td>{new Date(item.AcilisTarihi).toLocaleDateString('tr-TR')}</td>
                      <td>
                        <span
                          className={`badge bg-${item.Durum === "Aktif" ? "success" : "secondary"}`}
                        >
                          {item.Durum}
                        </span>
                      </td>
                    </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Yükleniyor...</p>
          )}

        </div>
      </div>
    </div>
  );
};

export default Dashboard;

