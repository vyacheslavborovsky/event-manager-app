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

describe('TESTING EVENTS ENDPOINTS:', function () {
    let user, token, eventIds, requester;

    before(function (done) {
        requester = chai.request(server);

        mockgoose.prepareStorage()
            .then(() => initInMemoryDB(mongoose, User, Event, mock, requester))
            .then(({testUser, testToken}) => {
                user = testUser;
                token = testToken;

                done();
            })
            .catch(error => {
                console.log('Error: ', error);
                done();
            })
    });

    it('MongoDB should be mocked', function (done) {
        mockgoose.helper.isMocked().should.be.true;
        done();
    });

    it('it should GET all events by user', function (done) {
        requester
            .get('/api/v1/events')
            .set('x-auth-token', token)
            .end(function (err, res) {

                res.should.have.status(200);
                res.body.events.should.be.a('array');
                res.body.events.length.should.be.eql(3);
                res.body.events[0].title.should.be.eql('Event title 1');

                eventIds = res.body.events.map(function (item) {
                    return item.eventId;
                });

                done();
            });
    });

    describe('ADD functionality', function () {
        it('it should add new event', function (done) {
            let now = new Date();

            let event = Object.assign(mock.newEvent, {
                startDate: now.setHours(now.getHours() + 6),
                endDate: now.setHours(now.getHours() + 12)
            });

            requester
                .patch('/api/v1/events')
                .set('x-auth-token', token)
                .send(event)
                .end(function (err, res) {
                    res.should.have.status(httpStatus.CREATED);
                    res.body.should.have.property('event');
                    res.body.should.have.property('message');
                    res.body.event.title.should.be.eql(event.title);
                    res.body.message.should.be.eql('Event has been created successfully.');

                    done();
                })
        });

        it('it should NOT create event without startDate or endDate', function (done) {
            let now = new Date();

            let event = Object.assign(mock.newEvent, {
                startDate: now.setHours(now.getHours() + 6)
            });

            requester
                .patch('/api/v1/events')
                .set('x-auth-token', token)
                .send(event)
                .end(function (err, res) {
                    res.should.have.status(httpStatus.BAD_REQUEST);
                    res.body.should.have.property('success');
                    res.body.success.should.be.false;
                });

            delete event.startDate;
            event.endDate = now;

            requester
                .patch('/api/v1/events')
                .set('x-auth-token', token)
                .send(event)
                .end(function (err, res) {
                    res.should.have.status(httpStatus.BAD_REQUEST);
                    res.body.should.have.property('success');
                    res.body.should.have.property('message');
                    res.body.success.should.be.false;
                    res.body.message.should.be.eql('Invalid request payload');

                    done();
                })
        });
    });

    it('it should update event', function (done) {
        let now = new Date();

        let event = Object.assign(mock.newEvent, {
            startDate: now.setHours(now.getHours() + 6),
            endDate: now.setHours(now.getHours() + 12)
        });

        new Event(event)
            .save()
            .then(newEvent => {
                const payload = {
                    title: 'Updated Title',
                    description: 'Updated Description',
                    endDate: new Date(newEvent.endDate.setDate(newEvent.endDate.getDate() + 2))
                };

                requester
                    .post('/api/v1/events/' + newEvent.eventId)
                    .set('x-auth-token', token)
                    .send(payload)
                    .end(function (err, res) {
                        res.should.have.status(httpStatus.OK);
                        res.body.should.have.property('event');
                        res.body.event.title.should.be.eql('Updated Title');
                        res.body.event.description.should.be.eql('Updated Description');
                        new Date(res.body.event.endDate).getTime().should.be.eql(payload.endDate.getTime());

                        done();
                    })
            })
            .catch(error => {
                console.log("Error: ", error);
                done();
            })
    });

    describe('DELETE functionality:', function () {
        it('it should delete SINGLE event', function (done) {
            let now = new Date();

            let event = Object.assign(mock.newEvent, {
                startDate: now.setHours(now.getHours() + 6),
                endDate: now.setHours(now.getHours() + 12)
            });

            new Event(event)
                .save()
                .then(newEvent => {
                    requester
                        .delete('/api/v1/events/' + newEvent.eventId)
                        .set('x-auth-token', token)
                        .end(function (err, res) {
                            res.should.have.status(httpStatus.OK);
                            res.body.should.have.property('event');
                            res.body.event.eventId.toString().should.be.eql(newEvent.eventId.toString());

                            done();
                        })
                })
                .catch(error => {
                    console.log("Error: ", error);
                    done();
                })
        });

        it('it should delete MULTIPLE events', function (done) {
            requester
                .delete('/api/v1/events')
                .set('x-auth-token', token)
                .send({eventIds: eventIds})
                .end(function (err, res) {
                    res.should.have.status(httpStatus.OK);
                    res.body.should.have.property('message');
                    res.body.message.should.be.eql('Events has been deleted successfully.');

                    done();
                })
        });
    });

    after(function (done) {
        removeInMemoryCollections(mockgoose)
            .then(() => done());
    });
});
