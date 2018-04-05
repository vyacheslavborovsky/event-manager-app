const config = require("../../config/variable");
const bcrypt = require('bcryptjs');


function initInMemoryDB(mongoose, User, Event, mockData, requester) {
    return mongoose.connect(config.mongo.uri + config.mongo.db, {
        keepAlive: 1,
        useMongoClient: true,
    })
        .then(connection => {
            let user1 = {
                ...mockData.user,
                local: {
                    ...mockData.user.local,
                    password: bcrypt.hashSync(mockData.user.local.password, 8)
                }
            };

            let testUser = new User(user1);

            return testUser.save();
        })
        .then(testUser => {
            let now = new Date();
            let promisesArray = [];

            for (let event of mockData.events) {

                let newEvent = new Event(
                    Object.assign(event, {
                        startDate: now.setHours(now.getHours() + 1),
                        endDate: now.setHours(now.getHours() + 3),
                        userId: testUser.id
                    }));

                promisesArray.push(newEvent.save());
                now.setDate(now.getDate() + 1);
            }

            return Promise.all([...promisesArray, testUser]);
        })
        .then((response) => {
            console.log('Response: ', response);

            let testToken;

            requester
                .post('/api/v1/auth/login/local')
                .send({
                    username: mockData.user.local.username,
                    password: mockData.user.local.password
                })
                .end((error, res) => {
                    if (error) {
                        return Promise.reject(`login error: ${error}`);
                    } else {
                        testToken = res.body['config.common.jwtHeader'];
                        return Promise.resolve({testUser: response.testUser, testToken: testToken})
                    }
                });
        });
}

function removeInMemoryCollections(mockgoose) {
    return mockgoose.helper.reset();
}

exports.initInMemoryDB = initInMemoryDB;
exports.removeInMemoryCollections = removeInMemoryCollections;
