const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');

exports.token = async (req, res) => {
  const { refreshToken } = req.body;
  try {
    const user = await User.findOne({refreshToken});
    if(user){
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN, async (err, user) => {
        if(err) return res.status(400).json({message: 'Please log in'});
        const {name, email, password} = user;
        const token = jwt.sign({name, email, password}, process.env.ACCESS_TOKEN, {expiresIn: '60m'});
        const updated = await User.updateOne({ email }, { token });
        return res.status(201).json({ token });
      })
    }  
  } catch (error) {
    return res.status(400).json({message: 'Invalid Token. Please login'});
  }
  
}

exports.login = async (req, res) => {
  let found = false;
  try {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    found = true;
    if(bcrypt.compareSync(password, user.password)){
      const token = jwt.sign({name: user.name, email, password}, process.env.ACCESS_TOKEN, {expiresIn: '60m'});
      const refreshToken = jwt.sign({name: user.name, email, password}, process.env.REFRESH_TOKEN);
      await User.findByIdAndUpdate(user._id, {refreshToken, token});
      return res.status(200).json({token, refreshToken});
    }
    return res.status(400).json({message: 'Wrong email or password'});
  } catch (error) {
    return res.status(found ? 400 : 500).json({message: found ? 'Wrong email or password' : 'Please try again'});
  }
  
};


exports.register = async (req, res) => {
  const {name, email, password} = req.body;
  const userExists = await User.exists({email});
  if(userExists) return res.status(400).json({ message: 'User already exists' });
  const user = {name, email, password: bcrypt.hashSync(password, 10)};
  User.create(user);
  return res.status(201).json(user);
};

exports.logout = async (req, res) => {
  const {refreshToken} = req.body;
  try {
    const user = await User.findOneAndUpdate({refreshToken}, {refreshToken: '', token: ''});
    if(!user) return res.status(400).json({message: 'Invalid Token'});
    return res.status(200).json({message: 'logged out successfully'});
  } catch (error) {
    return res.status(400).json({message: 'Invalid token'});
  }
};

exports.authenticateToken = async (req, res, next) => {
  const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
  if(!token) return res.status(400).json({message: 'Invalid Token Format. The correct format is "Bearer Token"'});
  try {
    req.user = await User.findOne({token});
    next();
  } catch (error) {
    return res.status(400).json({message: 'Incorrect Token'});
  }
}
