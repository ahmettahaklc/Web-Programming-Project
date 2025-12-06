const express = require('express');
const router = express.Router();
const db = require('../db'); 
const auth = require('../middleware/AuthM');

router.get('/dashboard/stats', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const [totalCasesRows] = await db.query('SELECT COUNT(*) AS count FROM davalar WHERE AID = ?', [userId]);
    const [activeCasesRows] = await db.query('SELECT COUNT(*) AS count FROM davalar WHERE Durum=1 AND AID = ?', [userId]);
    const [clientsCountRows] = await db.query('SELECT COUNT(DISTINCT MID) AS count FROM davalar WHERE AID = ?', [userId]);

    res.json({
      stats: [
        { title: "Toplam Dava", count: totalCasesRows[0].count, bg: "primary" },
        { title: "Aktif Dava", count: activeCasesRows[0].count, bg: "success" },
        { title: "Müvekkil Sayısı", count: clientsCountRows[0].count, bg: "warning" },
      ],
    });
  } catch (err) {
    console.error('Dashboard stats hata:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  } 
});


router.get('/dashboard/recent-cases', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const [recentCases] = await db.query(`
      SELECT DavaBasligi, CONCAT(muvekkiller.MIsim, ' ', muvekkiller.MSoyisim) AS MuvekkilAdi, Mahkeme, AcilisTarihi, 'Aktif' AS Durum
      FROM davalar 
      INNER JOIN muvekkiller ON davalar.MID = muvekkiller.MID 
      WHERE Durum = 1 and AID = ?
    `,[userId]);

    res.json({ recentCases });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});


module.exports = router;
