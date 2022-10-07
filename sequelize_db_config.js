
const Sequelize = require('sequelize')
const sequelize = new Sequelize(
   'school',
   'root',
   'Ka6th1kkdm10@#', {

      dialect: 'mysql',                         
      host: 'localhost'
   }
);


module.exports = sequelize