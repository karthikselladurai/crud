const Sequelize = require('sequelize');
const sequelize = require('../config/sequelize_db_config');
const library_logins = sequelize.define('library_logins',{
    user_Name:{
        type:Sequelize.STRING(30),
        allowNull:false,
    },
    password:{
        type:Sequelize.STRING(30),  
        allowNull:false
    }

})
module.exports = library_logins;