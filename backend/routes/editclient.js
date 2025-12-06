const express = require('express');
const router = express.Router();
const db = require('../db'); 
const auth = require('../middleware/AuthM');


router.get('/editclient/:id', auth, (req, res) => {
  const clientId = req.params.id;

  
  const query = 'SELECT * FROM muvekkiller WHERE MID = ?';
  db.query(query, [clientId], (err, results) => {
    if (err) return res.status(500).json({ message: 'Veritabanı hatası' });

    if (results.length === 0) {
      return res.status(404).json({ message: 'Müvekkil bulunamadı' });
    }

    res.json(results[0]);
  });
});

router.put('/editclient/:id', auth, async (req, res) => {
  try {

    const clientId = req.params.id;
    

    const { name, surname, phone, email } = req.body;

    const query = 'UPDATE muvekkiller SET MIsim = ?, MSoyisim = ?, MTel = ?, MMmail = ? WHERE MID = ?';

    const [result] = await db.query(query, [name, surname, phone, email, clientId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Müvekkil bulunamadı' });
    }

    return res.json({ message: 'Müvekkil başarıyla güncellendi' });
  } catch (err) {
    console.error('Güncelleme hatası:', err);
    return res.status(500).json({ message: 'Güncelleme hatası' });
  }
});


module.exports = router;
