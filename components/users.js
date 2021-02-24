const express = require('express');
const has = require('has-value');
const router = express.Router();
const usersSchema = require('./schemas/usersSchema.json');
const Ajv = require('ajv').default;
const users = require('../services/users');

//  Return all users information
router.get('/', (req, res) => { 
    const allUsers = users.getAllUsers();
    res.status(200);
    res.json(allUsers);
});

//  Return information of a single user
router.get('/:username', (req, res) => {
    const resultUser = users.getUserByUsername(req.params.username);
    if(resultUser === undefined)
    {
        res.sendStatus(404)
    }
    else
    {
        res.json(resultUser);
    }
})

function validateJSONHeaders(req, res, next)
{
    if(req.get('Content-Type') === 'application/json')
    {
        next();
    }
    else
    {
        const err = new Error('Bad Request - Missing Headers');
        err.status = 400;
        next(err);
    }
}
/* Middleware to validate new user creation */
function validateNewUserSchema(req, res, next)
{
    const ajv = new Ajv();
    const validate = ajv.compile(usersSchema);
    //console.log(req.body);
    const isValid = validate(req.body);
    //console.log('isValid', isValid);
    //console.log(validate.errors);
    if(isValid == false) {
      res.status(400);
      res.send(validate.errors.map(e => e.message));
    }
    next();
}

router.post('/',
    [ validateJSONHeaders, validateNewUserSchema],
    (req, res) => {
    if(users.usernameExist(req.body.username) == false)
    {
        let newUser = users.addUser(req);          
        res.status(201);
        res.json(newUser);
    }
    else
    {
        res.status(409);
        res.send("Conflit, username exist already")
    }
});

module.exports = router;

/*  Template for validation
{
    "username": "gdfgfsdgsd",
    "password": "11d11",
    "firstName": "Hatim",
    "lastName": "M'rabet El Khomssi",
    "dateOfBirth": "2000-06-30",
    "email": "hatimmrabet2@gmail.com",
    "gender": "male",
    "phoneNumber": "+33618256737",
    "city": "Helsinki",
    "contryCode": "FI"
}
*/