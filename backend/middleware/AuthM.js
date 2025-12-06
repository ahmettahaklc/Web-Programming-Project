const jwt = require('jsonwebtoken');
const SECRET_KEY = 'CokGizliBirAnahtar';

function auth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Geçersiz veya süresi dolmuş token' });
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ message: 'Yetkilendirilmedi' });
  }
}

module.exports = auth;