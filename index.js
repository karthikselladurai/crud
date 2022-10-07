const express = require('express');
const school = require('./routes/route')
const bodyparser = require('body-parser');
const app = express();
const bcrypt = require('bcryptjs');
const cookieParser = require('cookies-parser')

app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());
//app.use(cookieParser())
app.use('/school',school);
//app.use(bcrypt.bcrypt())




//mysql db
require('./config/mysql_db_config')


//sequelize db 
const sequelize = require('./config/sequelize_db_config');
const library_data = require('./config/library_db_config'); 
sequelize.authenticate().then(() => {
    console.log(' sequelize Connection has been established successfully.');
 }).catch((error) => {
    console.error('Unable to connect to the database: ', error);
 });

// const sequelize = require('./config/sequelize_db_config')
// const library_data = require('./config/library_db_config')
sequelize.sync();
//sequelize.sync({force:true})
//library_data.drop();

app.listen(8000,function(){
    console.log('running at port 3000');
});

app.get('/',function(req,res){
    res.status(200).json({message:'welcome'})
});
app.get('/school',school);


module.exports = app;





