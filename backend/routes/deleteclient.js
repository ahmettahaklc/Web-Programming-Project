const express = require('express');
const router = express.Router();
const db = require('../db');  
const auth = require('../middleware/AuthM'); 

router.delete('/deleteclient/:id', auth, async (req, res) => {
  try {
    const userId = req.user.id;       
    const clientId = req.params.id;  
    console.log(clientId);

    await db.query(`DELETE FROM davalar WHERE MID = ?`, [clientId]);
    await db.query(`DELETE FROM muvekkiller WHERE MID = ?`, [clientId]);

    res.json({ message: 'Müvekkil başarıyla silindi.' });
  } catch (err) {
    console.error('Müvekkil silme hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
});

module.exports = router;
