const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'CokGizliBirAnahtar';

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'E-posta ve şifre gereklidir' });
  }

  try {
    const [results] = await db.query(
      'SELECT avukatlar.AID, avukatlar.AMail, giris.Sifre FROM giris INNER JOIN avukatlar ON avukatlar.AID = giris.AID WHERE avukatlar.AMail = ? LIMIT 1',
      [email]
    );

    if (results.length === 0) {
      return res.status(401).json({ message: 'Bu mailde bir kullanici yok' });
    }

    const user = results[0];
    if (user.Sifre !== password) {
      return res.status(401).json({ message: 'Hatalı e-posta veya şifre' });
    }

    const token = jwt.sign({ id: user.AID }, SECRET_KEY, {
      expiresIn: '1h',
    });

    res.json({
       token, user: {
          id: user.AID,
          email: user.AMail }});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Sunucu hatasında' });
  }
});

module.exports = router;
