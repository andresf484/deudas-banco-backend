const { Schema, model } = require('mongoose');

const userSchema = Schema({
    user_id: {
        type: String
    },
    token: {
        type: String
    },
    secret_key: {
        type: String
    },
}, { timestamps: true,  collection: 'sessiontokens' });

module.exports = model('SessionToken', userSchema);