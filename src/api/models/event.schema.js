const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema({
    eventId: {
        type: Schema.ObjectId,
        auto: true
    },
    title: {
        type: String,
        required: [true, 'Title is required field.']
    },
    description: String,
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date,
        default: Date.now
    },
    location: {
        type: {
            locationName: {
                type: String,
                required: [true, 'Location name is missing']
            },
            lat: {
                type: Number,
                required: [true, 'Location latitude is missing']
            },
            lng: {
                type: Number,
                required: [true, 'Location longitude is missing']
            }
        },
        required: false
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    allDayEvent: {
        type: Boolean,
        default: false
    }
});

EventSchema.pre('save', function (next) {
    const now = new Date();
    if (!this.createdDate) {
        this.createdDate = now;
    }

    next();
});

EventSchema.set('toJSON', {getters: true, virtuals: true});

EventSchema.statics.getUpcomingEvents = function () {
    const now = new Date();

    return this
        .find({
            startDate: {
                $gt: now
            }
        })
        .populate('userId')
        .exec();
};

EventSchema.statics.getUsersActivityData = function () {
    const now = new Date();
    return this.aggregate([
        {
            $project: {
                'startDate': 1,
                'endDate': 1,
                'userId': 1
            }
        },
        {
            $lookup: {
                'from': 'users',
                'localField': 'userId',
                'foreignField': '_id',
                'as': 'user'
            }
        },
        {
            $project: {
                "completed": {$cond: [{$lt: ["$endDate", now]}, 1, 0]},
                "progress": {$cond: [{$and: [{$gte: ["$endDate", now]}, {$lte: ["$startDate", now]}]}, 1, 0]},
                "upcoming": {$cond: [{$gt: ["$startDate", now]}, 1, 0]},
                'userId': 1,
                'user.local.username': 1
            }
        },
        {
            $group: {
                _id: '$userId',
                username: {$first: '$user.local.username'},
                completed: {$sum: '$completed'},
                progress: {$sum: '$progress'},
                upcoming: {$sum: '$upcoming'},
                total: {$sum: 1}
            }
        }
    ]).exec();
};

exports = mongoose.model('Event', EventSchema);
