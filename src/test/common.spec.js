const Mockgoose = require('mockgoose').Mockgoose;
const mongoose = require('mongoose');
const Promise = require('bluebird');
mongoose.Promise = Promise;

const mockgoose = new Mockgoose(mongoose);

require('../api/models/user.schema');
require('../api/models/event.schema');

const User = require('mongoose').model('User');
const Event = require('mongoose').model('Event');
const httpStatus = require('http-status');

const mock = require('./data/mock.json');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../config/express');
const {initInMemoryDB, removeInMemoryCollections} = require("./helper/helper");
const should = chai.should();

chai.use(chaiHttp);

describe('TESTING COMMON FUNCTIONALITY', function () {
    let user, token, requester;

    before(function (done) {
        requester = chai.request(server);

        mockgoose.prepareStorage()
            .then(function () {
                initInMemoryDB(mongoose, User, Event, mock, requester)
                    .then(function ({testUser, testToken}) {
                        user = testUser;
                        token = testToken;

                        done();
                    })
                    .catch(function (error) {
                        console.log('Error: ', error);

                        done();
                    })
            });
    });

    it('it should get users activities data', function (done) {
        requester
            .get('/api/v1/common/activity')
            .set('x-auth-token', token)
            .end(function (err, res) {
                res.should.have.status(httpStatus.OK);
                res.body.should.have.property('data');
                res.body['data'].should.be.a('array');
                res.body['data'][0].username[0].should.be.eql(user.local.username);
                res.body['data'][0].total.should.be.eql(3);
                res.body['data'][0].upcoming.should.be.eql(res.body['data'][0].total);

                done();
            })
    });

    after(function (done) {
        removeInMemoryCollections(mockgoose, done);
    });
});
