const express = require('express');
const router = express.Router();
const db = require('../db'); 
const auth = require('../middleware/AuthM');

router.delete('/deletecase/:id', auth, async (req, res) => {
  const caseId = req.params.id;

  try {
    
    const [result] = await db.query('DELETE FROM davalar WHERE DavaId = ?', [caseId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Dava bulunmadı' });
    }

    res.json({ message: 'Dava başarıyla silindi' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Veritabanı hatası' });
  }
});


module.exports = router;
