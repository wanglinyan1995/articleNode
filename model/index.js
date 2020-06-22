var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017";
var dbName = "project";

function connect(callback){
    MongoClient.connect(url,function (err, client) {
        if (err) throw err;
        console.log('数据库已创建');
        var dbase = client.db(dbName);
        callback && callback(dbase)
        client.close();

    })
}

module.exports = {
    connect
}
