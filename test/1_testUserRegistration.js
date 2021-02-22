const chai = require('chai');
const expect = require('chai').expect;
chai.use(require('chai-http'));
chai.use(require('chai-json-schema-ajv'))
const server = require('../server');
const jsonwebtoken = require('jsonwebtoken');
const apiAddress = "http://localhost:4000";
const objCreatedSchema = require('./schemas/objCreated.json');
const objModifiedSchema = require('./schemas/objModified.json');


describe('Testing route : [/users]', function () {
    before(function () {    //start the server
        server.startTest();
    });

    after(function () {     //close the server
        server.close();
    })

    describe('[GET /users]', function () {
        it('[GET /users] => Should return status 200 with correct request', async function () {
            await chai.request(apiAddress)
                .get('/users')
                .then(response => {
                    expect(response.status).to.equal(200);
                })
                .catch(error => {
                    throw error
                });
        })
    })
    describe('[POST /users]', function () {
        it('[POST /users] => Should return status 400 with missing fields in request body', async function () {
            await chai.request(apiAddress)
                .post('/users')
                .send({
                    username: "hatimmrabet2",
                    password: "123456789",
                    lastName: "M'rabet El Khomssi",
                    dateOfBirth: "2020-06-30",
                    email: "Hatimmrabet2@gmail.com",
                    gender: "male",
                    city: "Helsinki",
                    contryCode: "FI"
                })
                .then(response => {
                    expect(response.status).to.equal(400);
                })
                .catch(error => {
                    throw error
                });

            await chai.request(apiAddress)
                .post('/users')
                .send({
                    firstName: "Hatim",
                    lastName: "M'rabet El Khomssi",
                    dateOfBirth: "2020-06-30",
                    email: "Hatimmrabet2@gmail.com",
                    gender: "male",
                    phoneNumber: "+33618256737",
                    city: "Helsinki",
                    contryCode: "FI"
                })
                .then(response => {
                    expect(response.status).to.equal(400);
                })
                .catch(error => {
                    throw error
                });
        })

        it('[POST /users] => should reject (status 400) the request if username is empty', async function () {
            await chai.request(apiAddress)
                .post('/users')
                .send({
                    username: "",
                    password: "123456789",
                    firstName: "Hatim",
                    lastName: "M'rabet El Khomssi",
                    dateOfBirth: "2020-06-30",
                    email: "Hatimmrabet2@gmail.com",
                    gender: "male",
                    phoneNumber: "+33618256737",
                    city: "Helsinki",
                    contryCode: "FI"
                })
                .then(response => {
                    expect(response.status).to.equal(400);
                })
                .catch(error => {
                    throw error
                });
        })

        it('[POST /users] => should reject (status 400) the request if password is too short(5 chars)', async function () {
            await chai.request(apiAddress)
                .post('/users')
                .send({
                    username: "hatimmrabet2",
                    password: "1234",
                    firstName: "Hatim",
                    lastName: "M'rabet El Khomssi",
                    dateOfBirth: "2020-06-30",
                    email: "Hatimmrabet2@gmail.com",
                    gender: "male",
                    phoneNumber: "+33618256737",
                    city: "Helsinki",
                    contryCode: "FI"
                })
                .then(response => {
                    expect(response.status).to.equal(400);
                })
                .catch(error => {
                    throw error
                });
        })

        it('[POST /users] => should reject (status 400) the request if gender different than (male/female)', async function () {
            await chai.request(apiAddress)
                .post('/users')
                .send({
                    username: "hatimmrabet2",
                    password: "123456789",
                    firstName: "Hatim",
                    lastName: "M'rabet El Khomssi",
                    dateOfBirth: "2020-06-30",
                    email: "Hatimmrabet2@gmail.com",
                    gender: "dkar",
                    phoneNumber: "+33618256737",
                    city: "Helsinki",
                    contryCode: "FI"
                })
                .then(response => {
                    expect(response.status).to.equal(400);
                })
                .catch(error => {
                    throw error
                });
        })

        it('[POST /users] => should reject (status 400) the request if data fields (Date Of Birth) don\'t match pattern', async function () {
            await chai.request(apiAddress)
                .post('/users')
                .send({
                    username: "hatimmrabet2",
                    password: "123456789",
                    firstName: "Hatim",
                    lastName: "M'rabet El Khomssi",
                    dateOfBirth: "200-06-30",
                    email: "Hatimmrabet2@gmail.com",
                    gender: "male",
                    phoneNumber: "+33618256737",
                    city: "Helsinki",
                    contryCode: "FI"
                })
                .then(response => {
                    expect(response.status).to.equal(400);
                })
                .catch(error => {
                    throw error
                });
        })

        it('[POST /users] => should reject (status 400) the request if data fields (email) don\'t match pattern', async function () {
            await chai.request(apiAddress)
                .post('/users')
                .send({
                    username: "hatimmrabet2",
                    password: "123456789",
                    firstName: "Hatim",
                    lastName: "M'rabet El Khomssi",
                    dateOfBirth: "2020-06-30",
                    email: "Hatimmrabet2gmail.com",
                    gender: "male",
                    phoneNumber: "+33618256737",
                    city: "Helsinki",
                    contryCode: "FI"
                })
                .then(response => {
                    expect(response.status).to.equal(400);
                })
                .catch(error => {
                    throw error
                });
        })

        it('[POST /users] => should reject (status 400) the request if data fields (Phone Number) don\'t match pattern', async function () {
            await chai.request(apiAddress)
                .post('/users')
                .send({
                    username: "hatimmrabet2new",
                    password: "123456789",
                    firstName: "Hatim",
                    lastName: "M'rabet El Khomssi",
                    dateOfBirth: "2020-06-30",
                    email: "Hatimmrabet2@gmail.com",
                    gender: "male",
                    phoneNumber: "0618256737",
                    city: "Helsinki",
                    contryCode: "FI"
                })
                .then(response => {
                    expect(response.status).to.equal(400);
                })
                .catch(error => {
                    throw error
                });
        })

        it('[POST /users] => should reject (status 400) the request if data fields (Contry Code) don\'t match pattern', async function () {
            await chai.request(apiAddress)
                .post('/users')
                .send({
                    username: "hatimmrabet2",
                    password: "123456789",
                    firstName: "Hatim",
                    lastName: "M'rabet El Khomssi",
                    dateOfBirth: "2020-06-30",
                    email: "Hatimmrabet2@gmail.com",
                    gender: "male",
                    phoneNumber: "+33618256737",
                    city: "Helsinki",
                    contryCode: "FIN"
                })
                .then(response => {
                    expect(response.status).to.equal(400);
                })
                .catch(error => {
                    throw error
                });
        })
        it('[POST /users] => should reject (status 409) the request if username exist already', async function () {
            await chai.request(apiAddress)
                .post('/users')
                .send({
                    username: "hatimmrabet2",
                    password: "123456789",
                    firstName: "Hatim",
                    lastName: "M'rabet El Khomssi",
                    dateOfBirth: "2020-06-30",
                    email: "Hatimmrabet2@gmail.com",
                    gender: "male",
                    phoneNumber: "+33618256737",
                    city: "Helsinki",
                    contryCode: "FI"
                })
                .then(response => {
                    expect(response.status).to.equal(409);
                })
                .catch(error => {
                    throw error
                });
        })
        it('[POST /users] => should response with (status 201) user ID and created time if all information is correct', async function () {
            await chai.request(apiAddress)
                .post('/users')
                .send({
                    username: "hatimmrabet2_newone",
                    password: "123456789",
                    firstName: "Hatim",
                    lastName: "M'rabet El Khomssi",
                    dateOfBirth: "2020-06-30",
                    email: "Hatimmrabet2@gmail.com",
                    gender: "male",
                    phoneNumber: "+33618256737",
                    city: "Helsinki",
                    contryCode: "FI"
                })
                .then(response => {
                    expect(response.status).to.equal(201);
                    expect(response.body).to.be.jsonSchema(objCreatedSchema);
                })
                .catch(error => {
                    throw error
                });
        })
    })

})