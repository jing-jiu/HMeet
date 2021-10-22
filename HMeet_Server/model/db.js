const mongo = require('mongoose')
mongo.connect('mongodb://127.0.0.1:27017/hmeet',{
    useNewUrlParser: true,
    useUnifiedTopology: true 
},(err)=>{
    if(err){
        console.log(err);
    }else{
        console.log('数据库连接成功');
    }
})
module.exports = mongo