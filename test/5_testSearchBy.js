const chai = require('chai');
const expect = require('chai').expect;
chai.use(require('chai-http'));
chai.use(require('chai-json-schema-ajv'))
const server = require('../server');
const apiAddress = "http://localhost:4000";

describe('Testing route : [/items/search-by]', function () {
    before(function () {    //start the server
        server.startTest();
    });

    after(function () {     //close the server
        server.close();
    });

    describe('[GET /items/search-by]', function () {
        it('[GET /items/search-by/location/{contryCode}/{cityName}] => should return statut 200 with array data', async function () {
            await chai.request(apiAddress)
                .get('/items/search-by/location/FI/Oulu')
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(200);
                    expect(response.body).to.be.an("array");
                })
                .catch(error => {
                    throw error
                });
        });

        it('[GET /items/search-by/location/{contryCode}/{cityName}] => should return statut 400 if contryCode parametre is incorrect', async function () {
            await chai.request(apiAddress)
                .get('/items/search-by/location/FIN/Oulu')
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(400);
                })
                .catch(error => {
                    throw error
                });
        });

        it('[GET /items/search-by/category/{categoryName}] => should return statut 200 with array data', async function () {
            await chai.request(apiAddress)
                .get('/items/search-by/category/cars')
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(200);
                })
                .catch(error => {
                    throw error
                });
        });

        it('[GET /items/search-by/date/{startDate}/{endDate}] => should return statut 200 with array data', async function () {
            await chai.request(apiAddress)
                .get('/items/search-by/date/2014-10-11/2015-06-18')
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(200);
                })
                .catch(error => {
                    throw error
                });
        });
    })
})