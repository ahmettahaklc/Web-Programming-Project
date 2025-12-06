const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/AuthM'); 

router.post('/case', auth, async (req, res) => {
  try {
    console.log("POST /api/case isteği geldi.");

    const AID = req.user.id;

  let { DavaBasligi, MuvekkilAd, MuvekkilSoyad, Mahkeme, AcilisTarihi, Durum } = req.body;

    if (!DavaBasligi ||
        !MuvekkilAd ||
        !MuvekkilSoyad ||
        !Mahkeme ||
        !AcilisTarihi ||
        !Durum) {
      return res.status(400).json({ message: "Tüm alanlar zorunludur." });
    }

    const [rows] = await db.query(
      `SELECT MID FROM muvekkiller WHERE MIsim = ? AND MSoyisim = ? LIMIT 1`,
      [MuvekkilAd, MuvekkilSoyad]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Muvekkil bulunmadı." });
    }

    const MID = rows[0].MID;

    if(Durum == "Aktif" || "aktif"){
        Durum = 1;
    }
    if(Durum == "Kapandı" || "kapandı"){
        Durum = 0;
    }

    const [result] = await db.query(
      `INSERT INTO davalar (DavaBasligi, MID, Mahkeme, AcilisTarihi, Durum, AID) 
      VALUES (?, ?, ?, ?, ?, ?)`,
      [DavaBasligi, MID, Mahkeme, AcilisTarihi, Durum, AID]
    );

    if (result.affectedRows === 1) {
      res.json({ message: "Dava başarıyla oluşturuldu.", caseId: result.insertId });
    } else {
      res.status(500).json({ message: "Dava oluşturulurken hata meydana geldi." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Sunucu hatasında." });
  }
});

module.exports = router;

