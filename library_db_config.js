const Sequelize = require('sequelize');
const sequelize = require('../config/sequelize_db_config')

const library_data = sequelize.define('library_details',

{

    book_Name:{ 
        type: Sequelize.STRING(100),
        allowNull:false
               
    },
    book_Author:{
        type: Sequelize.STRING,
        allowNull:false
        
    },
    book_Bublish_date:{
        type: Sequelize.STRING,
        allowNull:false
    }

})
module.exports = library_data;