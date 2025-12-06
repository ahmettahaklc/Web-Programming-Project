const express = require('express');
const router = express.Router();
const db = require('../db'); 
const auth = require('../middleware/AuthM');

router.get('/ClientManagementPage', auth, async (req, res) => {
  try {
    const userId = req.user.id;
   const [clientsRows] = await db.query(`
  SELECT muvekkiller.MID, muvekkiller.MIsim, muvekkiller.MSoyisim, muvekkiller.MTel, muvekkiller.MMmail
  FROM davalar 
  INNER JOIN muvekkiller ON davalar.MID = muvekkiller.MID 
  WHERE davalar.AID = ? GROUP BY MID
`, [userId]);


    res.json({ clients: clientsRows });

  } catch (err) {
    console.error('CaseManagementPage hata:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

module.exports = router;
