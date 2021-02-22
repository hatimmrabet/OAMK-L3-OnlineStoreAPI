const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

//  Some fixed example data of users
let usersData = {
    users: [
        {
            id: "b9e16741-54c2-423e-9fd1-760a918a8800",
            username: "hatimmrabet2",
            password: "$2a$12$bqyCSyQK2wty/67qi5PmN.JeXunMKOsPctJrXyL7r3Yii8JcAnANa", //12345
            firstName: "Hatim",
            lastName: "M'rabet El Khomssi",
            dateOfBirth: "2000-06-30",
            email: "hatimmrabet2@gmail.com",
            gender: "Male",
            phoneNumber: "+33618256737",
            city: "Helsinki",
            contryCode: "FI",
            created: "2021-02-15T16:20:59.591Z"
        },
        {
            id: "f1475893-f1a5-46aa-a952-3bf299d2a661",
            username: "ihabova",
            password: "$2a$12$bqyCSyQK2wty/67qi5PmN.JeXunMKOsPctJrXyL7r3Yii8JcAnANa",
            firstName: "iheb",
            lastName: "chemkhi",
            dateOfBirth: "1999-06-30",
            email: "ihebova@gmail.com",
            gender: "Male",
            phoneNumber: "+33618256737",
            city: "Helsinki",
            contryCode: "FI",
            created: "2021-02-15T16:20:59.591Z"
        }
    ]
}
function getUserById(id)
{
    let result = usersData.users.find(u => u.id == id);
    return result;
    /*
    return {
        id: result.id,
        username: result.username,
        firstName: result.firstName,
        lastName: result.lastName,
        dateOfBirth: result.dateOfBirth,
        email: result.email,
        gender: result.gender,
        phoneNumber: result.phoneNumber,
        city: result.city,
        contryCode: result.contryCode,
        created: result.created
    }
    */
}
function getUserByUsername(username)
{
    let result = usersData.users.find(u => u.username == username);
    return result;
}
function addUser(req)
{
    let newUser = {
        id: uuidv4(),
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password),
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        dateOfBirth: req.body.dateOfBirth,
        email: req.body.email,
        gender: req.body.gender,
        phoneNumber: req.body.phoneNumber,
        city: req.body.city,
        contryCode: req.body.contryCode,
        created: new Date().toISOString()
    }
    usersData.users.push(newUser);
    return {
        id: newUser.id,
        created: newUser.created
    }
}
function usernameExist(username)
{
    if(getUserByUsername(username) === undefined)
    {
        return false;
    }
    else
    {
        return true;
    }
}
function getContactInfo(sellerID)
{
    let result = getUserById(sellerID);
    return {
        firstName: result.firstName,
        lastName: result.lastName,
        email: result.email,
        phoneNumber: result.phoneNumber,
    };
}
module.exports = 
{
    getAllUsers: () => usersData.users,
    getUserById: (id) => getUserById(id),
    getUserByUsername: (username) => getUserByUsername(username),
    usernameExist: (username) => usernameExist(username),
    addUser: (newUser) => addUser(newUser),
    getContactInfo: (sellerID) => getContactInfo(sellerID)
};
