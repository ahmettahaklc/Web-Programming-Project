const express = require('express');
const router = express.Router();
const db = require('../db'); 


router.post('/AddClient', async (req, res) => {
  const { name, surname, phone, email } = req.body;

  if (!name || !surname || !phone || !email) {
    return res.status(400).json({ message: 'Tüm alanlar zorunludur.' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO muvekkiller (MIsim, MSoyisim, MTel, MMmail) VALUES (?, ?, ?, ?)',
      [name, surname, phone, email]
    );
    res.status(201).json({ message: 'Müvekkil başarıyla eklendi.', id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
});

module.exports = router;
