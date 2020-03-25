const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const Users = require('../users/users-model');
const {jwtSecret} = require('../config/secrets.js');


// for endpoints beginning with /api/auth
router.post('/register', (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 10); // 2 ^ n
  user.password = hash;

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.post('/login', (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user); // make token
        res.status(200).json({
          message: `Welcome ${user.username}!`,
          token, // send token upon login
        });
      } else {
        res.status(401).json({ message: 'Invalid Credentials' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.get('/logout', (req, res) => {
    req.session ?
      req.session.destroy(error => {
        error
          ? res.status(500).json({ message: 'YOU SHALL NOT LOG OUT'})
          : res.status(200).json({ message: 'logged out'})
      }) :
      res.status(200).json({message: "I don't know you peasant" })
  });


function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
    department: user.department || 'user'
  };
  const options = {
    expiresIn: '1h',
  };

  return jwt.sign(payload, jwtSecret, options);
}
module.exports = router;