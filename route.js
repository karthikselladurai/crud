
const express = require('express');
const { query } = require('express');
const  route =  express.Router();
const dao = require('../dao/dao')
const check_token = require('../middle_ware/jwt_check_token')
//routes for mysql query
route.post('/library/registor',dao.function_registor_tutor);
//login
route.post('/library/login',dao.function_login)
route.post('/insert',dao.function_insert_all);
route.delete('/delete/:student_Id',dao.function_delete);
route.get('/student/:student_Id',dao.function_studentdetails_id);
route.put('/update',dao.function_update_studntsconatct);
route.get('/tutor/:tutor_Id',dao.function_get_details_tutorid);
route.get('/tutor',dao.function_search);        
//routes for sequelize
route.get('/',dao.function_entry);
route.get('/library/read',check_token.function_check_token,dao.function_read_All);
route.post('/library/insert',check_token.function_check_token,dao.function_insert); 
route.get('/library/search',check_token.function_check_token,dao.function_library_findbook);
route.delete('/library/delete/:book_Name',check_token.function_check_token,dao.function_library_deletebook);
route.put('/library/update',check_token.function_check_token,dao.function_update)
route.get('/library/read/:book_Id',check_token.function_check_token,dao.function_read_id)
//promise
route.get('/count',dao.function_countall)




module.exports = route;