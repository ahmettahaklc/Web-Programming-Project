const express = require('express');
const router = express.Router();
const db = require('../db'); // mysql2/promise pool
const auth = require('../middleware/AuthM');

// GET: Belirli davanın bilgilerini getir
router.get('/editcase/:davaId', auth, async (req, res) => {
  try {


    const { davaId } = req.params;

    const [rows] = await db.query(
      `SELECT d.DavaBasligi, 
              m.MIsim AS MuvekkilAd, 
              m.MSoyisim AS MuvekkilSoyad, 
              d.Mahkeme, 
              d.AcilisTarihi, 
              d.Durum 
       FROM davalar d
       JOIN muvekkiller m ON d.MID = m.MID
       WHERE d.DavaID = ? LIMIT 1`,
      [davaId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Dava bulunamadı' });
    }


    res.json(rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Veritabanı hatası' });
  }
});

router.put('/editcase/:davaId', auth, async (req, res) => {
  try {
    const { davaId } = req.params;
    
    const avukatId = req.user.id;   
    const { DavaBasligi, MuvekkilAd, MuvekkilSoyad, Mahkeme, AcilisTarihi, Durum } = req.body;


    
    const [muvekkilRows] = await db.query(
      'SELECT MID FROM muvekkiller WHERE LOWER(MIsim) = LOWER(?) AND LOWER(MSoyisim) = LOWER(?) LIMIT 1',
      [MuvekkilAd, MuvekkilSoyad]
    );


    if (muvekkilRows.length === 0) {
      return res.status(404).json({ message: 'Muvekkil bulunamadı' });
    }

    const muvekkilId = muvekkilRows[0].MID;

    const [result] = await db.query(
      'UPDATE davalar SET DavaBasligi = ?, MID = ?, Mahkeme = ?, AcilisTarihi = ?, Durum = ? WHERE DavaID = ? AND AID = ?',
      [DavaBasligi, muvekkilId, Mahkeme, AcilisTarihi, Durum, davaId, avukatId]
    );



    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Dava bulunamadı veya yetkiniz yok' });
    }

    res.json({ message: 'Dava başarıyla güncellendi' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Veritabanı hatası' });
  }
});
module.exports = router;
