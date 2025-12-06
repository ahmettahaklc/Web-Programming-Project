const express = require('express');
const router = express.Router();
const db = require('../db'); 
const auth = require('../middleware/AuthM');


router.get('/CaseManagementPage', auth, async (req, res) => {
  try {

    const userId = req.user.id;

    const [cases] = await db.query(`
      SELECT DavaID, DavaBasligi, CONCAT(muvekkiller.MIsim, ' ', muvekkiller.MSoyisim) AS MuvekkilAdi, Mahkeme, AcilisTarihi,
        CASE WHEN Durum = 1 THEN 'Aktif' WHEN Durum = 0 THEN 'Kapandı' END AS Durum
      FROM davalar 
      INNER JOIN muvekkiller ON davalar.MID = muvekkiller.MID
    `);

    res.json({ cases });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Sunucu hatasında' });
  }
});

module.exports = router;
