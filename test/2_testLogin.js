const chai = require('chai');
const expect = require('chai').expect;
chai.use(require('chai-http'));
chai.use(require('chai-json-schema-ajv'))
const server = require('../server');
const apiAddress = "http://localhost:4000";

describe('Testing route : [/users/login]', function () {
    before(function () {    //start the server
        server.startTest();
    });

    after(function () {     //close the server
        server.close();
    })

    describe('[GET /users/login]', function () {
        it('[GET /users/login] => Should login succesfully', async function () {
            await chai.request(apiAddress)
                .get('/users/login')
                .auth('hatimmrabet2', '12345')
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(200);
                    expect(response.body).to.have.property('token');
                })
                .catch(error => {
                    throw error
                });
        })

        it('[GET /users/login] => Should not login with incrorrect username', async function () {
            await chai.request(apiAddress)
                .get('/users/login')
                .auth('usernameIncorrect', '12345')
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(401);
                })
                .catch(error => {
                    throw error
                });
        })

        it('[GET /users/login] => Should not login with incrorrect password', async function () {
            await chai.request(apiAddress)
                .get('/users/login')
                .auth('hatimmrabet2', 'wrongCode')
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(401);
                })
                .catch(error => {
                    throw error
                });
        })

        it('[GET /users/login] => Should not login with missing username', async function () {
            await chai.request(apiAddress)
                .get('/users/login')
                .auth(null, "password")
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(401);
                })
                .catch(error => {
                    throw error
                });
        })

        it('[GET /users/login] => Should not login with missing password', async function () {
            await chai.request(apiAddress)
                .get('/users/login')
                .auth('hatimmrabet2', null)
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(401);
                })
                .catch(error => {
                    throw error
                });
        })

        it('[GET /users/login] => Should not login without auth information', async function () {
            await chai.request(apiAddress)
                .get('/users/login')
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(401);
                })
                .catch(error => {
                    throw error
                });
        })
    })
})