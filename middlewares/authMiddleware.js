const authMiddleware = (req, res, next) => {
    if (req.session && req.session.user && req.session.user.PhanLoai === 0) {
      return next();
    }
    return res.redirect('/login'); // tự động về /login nếu chưa login hoặc kphai admin
  };
  
  module.exports = authMiddleware;