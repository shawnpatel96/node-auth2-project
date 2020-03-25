  
const router = require('express').Router();

const Users = require('./users-model');
const restricted = require('../auth/restricted-middleware');

router.get('/', restricted, (req, res)=>{
    Users.find()
    .then(users =>{
        res.status(200).json(users)
    })
    .catch(error=>{
        error:`There is a server error${error}`
    })
});

module.exports = router;