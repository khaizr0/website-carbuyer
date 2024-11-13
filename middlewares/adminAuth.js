const adminAuth = (req, res, next) => {
  if (req.session.user && req.session.user.PhanLoai === 0) {
    next();
  } else {
    res.redirect('/admin/login');
  }
};

module.exports = adminAuth;
