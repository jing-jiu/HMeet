const mongoose = require('mongoose')
const schma = new mongoose.Schema({
    email: { type: String },
    code: { type: Number },
    createdAt: {
        type: Date,
        index: {expires: 60}
    }
})
module.exports = mongoose.model('CheckCode', schma)