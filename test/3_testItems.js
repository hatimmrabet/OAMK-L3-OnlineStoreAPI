const chai = require('chai');
const expect = require('chai').expect;
chai.use(require('chai-http'));
chai.use(require('chai-json-schema-ajv'))
const server = require('../server');
const jsonwebtoken = require('jsonwebtoken');
const apiAddress = "http://localhost:4000";
const objCreatedSchema = require('./schemas/objCreated.json');
const objModifiedSchema = require('./schemas/objModified.json');

describe('Testing route : [/items]', function () {
    before(function () {    //start the server
        server.startTest();
    });

    after(function () {     //close the server
        server.close();
    })

    describe('[GET POST PUT DELETE /items]', function () {
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
    
        it('[GET /items]  => Should return status 200 with all user items', async function() {
          await chai.request(apiAddress)
            .get('/items')
            .set('Authorization', 'Bearer ' + userJwt)
            .then(response => {
              expect(response).to.have.property('status');
              expect(response.status).to.equal(200);
              expect(response.body).to.be.an('array');
            })
            .catch(error => {
              throw error;
            });
        });

        it('[POST /items] => Should return status 201 and create a new user item', async function() {
            await chai.request(apiAddress)
                .post('/items')
                .set('Authorization', 'Bearer ' + userJwt)
                .send({
                    title: "Phone S10+",
                    description: "new phone without problems",
                    category: "phones",
                    city: "Tetouan",
                    contryCode: "MA",
                    price: 650.15,
                    delivery: "Shipping"
                })
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(201);
                    expect(response.body).to.be.jsonSchema(objCreatedSchema);
                })
                .catch(error => {
                    throw error;
                });
        });

        it('[POST /items] => Should return status 400 if missing fields', async function() {
            await chai.request(apiAddress)
                .post('/items')
                .set('Authorization', 'Bearer ' + userJwt)
                .send({
                    title: "Phone S10+",
                    description: "new phone without problems",
                    category: "phones",
                    contryCode: "MA",
                    price: 650.15,
                    delivery: "Shipping"
                })
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(400);
                })
                .catch(error => {
                    throw error;
                });
        });

        it('[POST /items] => Should return status 400 if incorrect data (price < 0)', async function() {
            await chai.request(apiAddress)
                .post('/items')
                .set('Authorization', 'Bearer ' + userJwt)
                .send({
                    title: "Phone S10+",
                    description: "new phone without problems",
                    category: "phones",
                    city: "Tetouan",
                    contryCode: "MA",
                    price: -99,
                    delivery: "Shipping"
                })
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(400);
                })
                .catch(error => {
                    throw error;
                });
        });

        it('[POST /items] => Should return status 400 if delivery is not (Shipping/Pickup)', async function() {
            await chai.request(apiAddress)
                .post('/items')
                .set('Authorization', 'Bearer ' + userJwt)
                .send({
                    title: "Phone S10+",
                    description: "new phone without problems",
                    category: "phones",
                    city: "Tetouan",
                    contryCode: "MA",
                    price: 100,
                    delivery: "test"
                })
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(400);
                })
                .catch(error => {
                    throw error;
                });
        });

        it('[POST /items] => Should return status 401 if user not logged in', async function() {
            await chai.request(apiAddress)
                .post('/items')
                .send({
                    title: "Phone S10+",
                    description: "new phone without problems",
                    category: "phones",
                    city: "Tetouan",
                    contryCode: "MA",
                    price: 650.15,
                    delivery: "Shipping"
                })
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(401);
                })
                .catch(error => {
                    throw error;
                });
        });


        it('[PUT /items/{itemID}] => Should return status 200 with no problems', async function() {
            await chai.request(apiAddress)
                .put('/items/25978153-bced-4ff4-ab54-a86517cafaee')
                .set('Authorization', 'Bearer ' + userJwt)
                .send({
                    title: "Phone S10+",
                    description: "new phone without problems",
                    category: "phones",
                    city: "Tetouan",
                    contryCode: "MA",
                    price: 100,
                    delivery: "Shipping"
                })
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(200);
                    expect(response.body).to.be.jsonSchema(objModifiedSchema);
                })
                .catch(error => {
                    throw error;
                });
        });

        it('[PUT /items/{itemID}] => Should return status 400 if missing fields', async function() {
            await chai.request(apiAddress)
                .put('/items/25978153-bced-4ff4-ab54-a86517cafaee')
                .set('Authorization', 'Bearer ' + userJwt)
                .send({
                    title: "Phone S10+",
                    description: "new phone without problems",
                    category: "phones",
                    contryCode: "MA",
                    price: 100,
                    delivery: "Shipping"
                })
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(400);
                })
                .catch(error => {
                    throw error;
                });
        });

        it('[PUT /items/{itemID}] => Should return status 404 if itemID not found', async function() {
            await chai.request(apiAddress)
                .put('/items/00000000000000000000000')
                .set('Authorization', 'Bearer ' + userJwt)
                .send({
                    title: "Phone S10+",
                    description: "new phone without problems",
                    category: "phones",
                    city: "Tetouan",
                    contryCode: "MA",
                    price: 100,
                    delivery: "Shipping"
                })
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(404);
                })
                .catch(error => {
                    throw error;
                });
        });

        it('[PUT /items/{itemID}] => Should return status 403 if item don\'t belong to the logged user', async function() {
            await chai.request(apiAddress)
                .put('/items/e51298e8-f811-4fa9-8386-05035144f00a')
                .set('Authorization', 'Bearer ' + userJwt)
                .send({
                    title: "Phone S10+",
                    description: "new phone without problems",
                    category: "phones",
                    city: "Tetouan",
                    contryCode: "MA",
                    price: 100,
                    delivery: "Shipping"
                })
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(403);
                })
                .catch(error => {
                    throw error;
                });
        });

        it('[PUT /items/{itemID}] => Should return status 401 if the user is not logged in', async function() {
            await chai.request(apiAddress)
                .put('/items/e51298e8-f811-4fa9-8386-05035144f00a')
                .send({
                    title: "Phone S10+",
                    description: "new phone without problems",
                    category: "phones",
                    city: "Tetouan",
                    contryCode: "MA",
                    price: 100,
                    delivery: "Shipping"
                })
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(401);
                })
                .catch(error => {
                    throw error;
                });
        });

        it('[DELETE /items/{itemID}] => Should return status 200 if item is deleted', async function() {
            await chai.request(apiAddress)
                .delete('/items/25978153-bced-4ff4-ab54-a86517cafaee')
                .set('Authorization', 'Bearer ' + userJwt)
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(200);
                })
                .catch(error => {
                    throw error;
                });
        });

        it('[DELETE /items/{itemID}] => Should return status 404 if itemID is not found', async function() {
            await chai.request(apiAddress)
                .delete('/items/00000000000000000000000000')
                .set('Authorization', 'Bearer ' + userJwt)
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(404);
                })
                .catch(error => {
                    throw error;
                });
        });

        it('[DELETE /items/{itemID}] => Should return status 403 if itemID don\'t belond to the logged user', async function() {
            await chai.request(apiAddress)
                .delete('/items/e51298e8-f811-4fa9-8386-05035144f00a')
                .set('Authorization', 'Bearer ' + userJwt)
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(403);
                })
                .catch(error => {
                    throw error;
                });
        });

        it('[DELETE /items/{itemID}] => Should return status 401 if user is not logged in', async function() {
            await chai.request(apiAddress)
                .delete('/items/e51298e8-f811-4fa9-8386-05035144f00a')
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(401);
                })
                .catch(error => {
                    throw error;
                });
        });
    })
    

    describe("[POST PUT DELETE] same file :", function(){
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
        
    })
})