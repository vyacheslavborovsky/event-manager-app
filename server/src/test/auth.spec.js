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
const config = require("../config/variable");
const removeInMemoryCollections = require("./helper/helper").removeInMemoryCollections;
const should = chai.should();

chai.use(chaiHttp);

describe('TESTING AUTH FUNCTIONALITY', function () {
    let requester;

    before(function (done) {
        requester = chai.request(server);

        mockgoose.prepareStorage()
            .then(() => mongoose.connect(config.mongo.uri + config.mongo.db, {
                keepAlive: 1,
                useMongoClient: true,
            }))
            .then(() => done())
    });

    it('User should be registered', function (done) {
        requester
            .post('/api/v1/auth/register/local')
            .send(mock.user.local)
            .end(function (err, res) {
                res.should.have.status(httpStatus.OK);
                res.body.should.have.property('success');
                res.body.success.should.be.true;
                res.body.should.have.property('account');
                res.body.account.local.username.should.be.eql(mock.user.local.username);

                done();
            })
    });

    it('User should be logged in', function (done) {
        requester
            .post('/api/v1/auth/login/local')
            .send({
                username: mock.user.local.username,
                password: mock.user.local.password
            })
            .end(function (err, res) {
                res.should.have.status(httpStatus.OK);
                res.body.should.have.property('success');
                res.body.success.should.be.true;
                res.body.should.have.property('config.common.jwtHeader');
                res.body['config.common.jwtHeader'].length.should.be.gt(0);

                done();
            })
    });

    after(function (done) {
        removeInMemoryCollections(mockgoose)
            .then(() => done());
    });
});
