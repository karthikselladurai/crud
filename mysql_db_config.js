var mysql = require('mysql');
var con = mysql.createConnection(
    {
        host:'localhost',
        user:'root',
        password:'Ka6th1kkdm10@#',
        database:'school'
    }
);
    con.connect(function(err){
    if (err) {
            console.log(err)

    }
    console.log('mysql db connected')
    
})
module.exports = con;