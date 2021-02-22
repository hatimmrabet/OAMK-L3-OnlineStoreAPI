const chai = require('chai');
const expect = require('chai').expect;
chai.use(require('chai-http'));
chai.use(require('chai-json-schema-ajv'))
const server = require('../server');
const jsonwebtoken = require('jsonwebtoken');
const apiAddress = "http://localhost:4000";
const items = require("../services/items.js");

describe('Testing route : [/items/{ItemID}/images]', function () {
    before(function () {    //start the server
        server.startTest();
    });

    after(function () {     //close the server
        server.close();
    });

    describe('[GET POST PUT DELETE]', function () {
        let userJwt = null;
        let decodedJwt = null;
    
        before(async function(){
          await chai.request(apiAddress)
            .get('/users/login')
            .auth('hatimmrabet2', '12345')
            .then(response => {
              expect(response).to.have.property('status');
              expect(response.status).to.equal(200);
              expect(response.body).to.have.property('token');
    
              userJwt = response.body.token;
              decodedJwt = jsonwebtoken.decode(userJwt, { complete: true });
            });
        });

        it('[POST /items/{ItemID}/images] => Should return status 200 with all correct info', async function() {
            await chai.request(apiAddress)
                .post('/items/a52fa527-33c8-400a-b8bf-4e734ca963b0/images')
                .set('Authorization', 'Bearer ' + userJwt)
                .attach("images","./test/picture/testPicture.jpg")
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(201);
                })
                .catch(error => {
                    throw error;
                });
        });
        
        it('[POST /items/{ItemID}/images] => Should return status 403 if the item don\'t belong to connected user', async function() {
            await chai.request(apiAddress)
                .post('/items/e51298e8-f811-4fa9-8386-05035144f00a/images')
                .set('Authorization', 'Bearer ' + userJwt)
                .attach("images","./test/picture/testPicture.jpg")
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(403);
                })
                .catch(error => {
                    throw error;
                });
        });

        it('[POST /items/{ItemID}/images] => Should return status 404 if the item not exist', async function() {
            await chai.request(apiAddress)
                .post('/items/0000220000000/images')
                .set('Authorization', 'Bearer ' + userJwt)
                .attach("images","./test/picture/testPicture.jpg")
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(404);
                })
                .catch(error => {
                    throw error;
                });
        });

        it('[POST /items/{ItemID}/images] => Should return status 400 if try to add more than 4 images', async function() {
            await chai.request(apiAddress)
                .post('/items/a52fa527-33c8-400a-b8bf-4e734ca963b0/images')
                .set('Authorization', 'Bearer ' + userJwt)
                .attach("images","./test/picture/testPicture.jpg")
                .attach("images","./test/picture/testPicture.jpg")
                .attach("images","./test/picture/testPicture.jpg")
                .attach("images","./test/picture/testPicture.jpg")
                .attach("images","./test/picture/testPicture.jpg")
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(400);
                    expect(response.body.err.code).to.equal("LIMIT_UNEXPECTED_FILE");
                })
                .catch(error => {
                    throw error;
                });
        });

        it('[POST /items/{ItemID}/images] => Should return status 401 if user not logged in', async function() {
            await chai.request(apiAddress)
                .post('/items/a52fa527-33c8-400a-b8bf-4e734ca963b0/images')
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(401);
                })
                .catch(error => {
                    throw error;
                });
        });

        it('[PUT /items/{itemID}/images] => Should return status 200 if everything is good', async function() {
            await chai.request(apiAddress)
                .put('/items/a52fa527-33c8-400a-b8bf-4e734ca963b0/images')
                .set('Authorization', 'Bearer ' + userJwt)
                .attach("images","./test/picture/testPicture.jpg")
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(200);
                })
                .catch(error => {
                    throw error;
                });
        });

        it('[PUT /items/{itemID}/images] => Should return status 403 if the item don\'t belong to the connected user', async function() {
            await chai.request(apiAddress)
                .put('/items/e51298e8-f811-4fa9-8386-05035144f00a/images')
                .set('Authorization', 'Bearer ' + userJwt)
                .attach("images","./test/picture/testPicture.jpg")
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(403);
                })
                .catch(error => {
                    throw error;
                });
        });

        it('[PUT /items/{itemID}/images] => Should return status 404 if item not found', async function() {
            await chai.request(apiAddress)
                .put('/items/0000000000000/images')
                .set('Authorization', 'Bearer ' + userJwt)
                .attach("images","./test/picture/testPicture.jpg")
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(404);
                })
                .catch(error => {
                    throw error;
                });
        });

        it('[PUT /items/{ItemID}/images] => Should return status 404 if try to add more than 4 images', async function() {
            await chai.request(apiAddress)
                .post('/items/a52fa527-33c8-400a-b8bf-4e734ca963b0/images')
                .set('Authorization', 'Bearer ' + userJwt)
                .attach("images","./test/picture/testPicture.jpg")
                .attach("images","./test/picture/testPicture.jpg")
                .attach("images","./test/picture/testPicture.jpg")
                .attach("images","./test/picture/testPicture.jpg")
                .attach("images","./test/picture/testPicture.jpg")
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(400);
                    expect(response.body.err.code).to.equal("LIMIT_UNEXPECTED_FILE");
                })
                .catch(error => {
                    throw error;
                });
        });
        
        it('[PUT /items/{itemID}/images] => Should return status 401 if user not logged in', async function() {
            await chai.request(apiAddress)
                .put('/items/a52fa527-33c8-400a-b8bf-4e734ca963b0/images')
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(401);
                })
                .catch(error => {
                    throw error;
                });
        });

    });
})