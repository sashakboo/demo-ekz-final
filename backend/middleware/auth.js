const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({msg: 'Не авторизован'});
  }

  try {
    const decoded = jwt.verify(token.replace('Bearer', ''), process.env.JWT_SECRET || '10');
    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({msg: 'Неправильный токен'})
  }
}