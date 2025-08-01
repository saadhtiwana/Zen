import jwt from 'jsonwebtoken'

const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '15d' });
  res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV !== 'production', maxAge: 15 * 24 * 60 * 60 * 1000, sameSite: "strict" }); // 15 days in milliseconds
}

export default generateTokenAndSetCookie;