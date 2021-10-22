const mongoose = require('mongoose')
const schma = new mongoose.Schema({
    username: { type: String },
    password:{ 
        type: String,
        select:false,
        set(val){
            return require('bcrypt').hashSync(val,10)
        }
    },
    nickname:{ type: String },
    avator:{ type: String },
    onlyCode:{ type: Number },
    historyMeet:[{ type: String }],
})
module.exports = mongoose.model('HMeetUser', schma)