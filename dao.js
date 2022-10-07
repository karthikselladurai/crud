const con = require('../config/mysql_db_config')
var library_data = require("../config/library_db_config");
const sequelize = require("../config/sequelize_db_config");
const { Op} = require('sequelize');
const jwt = require('jsonwebtoken')
const jwtconfig = require('../config/jwt/jwt_config');
const library_logins = require('../config/library_login_schema');
var promise = require('promise');
const { json } = require('body-parser');

exports.function_entry = function (req, res) {
    res.status(200).json({massage:"wellcome school "})
}

//for mysql querys

//login
exports.function_login =async function (req, res) {
    var body = req.body;
    if (!body.user_Name || !body.password) {
        res.status(400).json({ massage: "error", result: "enter username and password" })
    } else {
        //console.log("yes")
        await library_logins.findAll({
            where:{
                [Op.and]:[{ user_Name:body.user_Name},
                {password:body.password}]
            }
        }).then(result=>{
            if(result.length!=0){

                let token= jwt.sign({results:result},jwtconfig.secret,{expiresIn:"1h"})
                res.status(200).json({message:"access granded",token:token})
            }
        }).catch(err=>{
            res.status(400).json({massage:"error",data:"invalid username or password"})
            console.log(err)
        })
    }

}
//registor tutor 
exports.function_registor_tutor = async function (req, res) {

    var body = req.body;
    if (!body.user_Name || !body.password) {
        res.status(400).json({ massage: "error", result: "enter username and password" })
    } else {
        await library_logins.create({
            user_Name:req.body.user_Name,
            password:req.body.password

        }).then(result =>{
            res.status(200).json({massage:"sucessfully registor",data:result})

        }).catch(err =>{
            console.log(err)
            res.status(400).json({message:"error",error:err})
        })
        
        
    }
}
//insert all details------------------------
exports.function_insert_all = function (req, res) {
    var sql_teacher = 'insert into teachers_details (teacher_Name,teacher_Qualification,teacher_Contact_no)values ( "' + req.body.teacher_Name + '"' + ' ,"' + req.body.teacher_Qualification + '",' +
        req.body.teacher_Contact_no + ' ); '
    var sql_student = 'insert into students_details (student_Name,student_Class,student_Contact_no )values ( ' +
        '"' + req.body.student_Name + '",' + req.body.student_Class + ',' + req.body.student_Contact_no + ' ); ';

    if (req.body.teacher_Contact_no != undefined && req.body.student_Contact_no != undefined) {
        console.log("condition 1 ok")



        if (req.body.teacher_Contact_no.toString().length == 10 && req.body.student_Contact_no.toString().length == 10) {
            console.log("condition 2 ok")
            var sql_teacher = 'insert into teachers_details (teacher_Name,teacher_Qualification,teacher_Contact_no)values ( "' + req.body.teacher_Name + '"' + ' ,"' + req.body.teacher_Qualification + '",' +
                req.body.teacher_Contact_no + ' ); '
            var sql_student = 'insert into students_details (student_Name,student_Class,student_Contact_no )values ( ' +
                '"' + req.body.student_Name + '",' + req.body.student_Class + ',' +
                req.body.student_Contact_no + ' ); ';



            con.query(sql_teacher, function (err, teacher_result) {
                if (err) throw err;
                console.log(teacher_result)
                console.log(teacher_result['insertId'])
                con.query(sql_student, function (err, student_result) {
                    if (err) throw err;
                    console.log(student_result['insertId'])
                    var sql_tutor = 'insert into tutor  (teacher_Id,student_Id) values (' + teacher_result['insertId'] + "," + student_result['insertId'] + ' );';
                    con.query(sql_tutor, function (err, tutor_result) {
                        if (err) {
                            res.send(err);
                        } else {
                            res.status(200).json({message:"sucess",data:tutor_result})
                        }
                    })
                });
            });

        } else {
            res.status(400).json({ massage: " ", contact_number: "invalid mobile number" })
            console.log("invalid mobile number")


        }

    } else {
        var sql_teacher = 'insert into teachers_details (teacher_Name,teacher_Qualification,teacher_Contact_no)values ( "' + req.body.teacher_Name + '"' + ' ,"' + req.body.teacher_Qualification + '",' +
            'null ); '
        var sql_student = 'insert into students_details (student_Name,student_Class,student_Contact_no )values ( ' +
            '"' + req.body.student_Name + '",' + req.body.student_Class + ',null ); ';


        console.log(sql_student)


        con.query(sql_teacher, function (err, teacher_result) {
            if (err) throw err;
            console.log(teacher_result['insertId'])
            con.query(sql_student, function (err, student_result) {
                if (err) throw err;
                console.log(student_result['insertId'])
                var sql_tutor = 'insert into tutor  (teacher_Id,student_Id) values (' + teacher_result['insertId'] + "," + student_result['insertId'] + ' );';
                con.query(sql_tutor, function (err, tutor_result) {
                    if (err) {
                        res.send(err);
                    } else {
                        res.status(200).json({massage:"sucess",data:"insert successfully"});
                    }
                })
            });
        });

    }

}


//delete with student_Id-------------------------------
exports.function_delete = function (req, res) {
    //console.log(req.params['student_Id'])
    var check_sql = 'select '
    var sql = "delete from students_details where student_Id=" + req.params['student_Id'];
    con.query(sql, function (err, result) {

        if (err) {
            console.log(err);
        } else {
            console.log("delete successfully");
            res.status(200).json({message:"sucess",deta:"delete succesfully"});
        }
    });

}

//get teacher_name ,contact no ,student name ,contact 

exports.function_get_details_tutorid = function (req, res) {
    var check_sql = 'select tutor_Id from tutor where tutor_Id =' + req.params['tutor_Id']
    con.query(check_sql, function (err, result) {
        if (err) throw err;
        console.log(result);

        //     console.log(result.tutor_Id)
        //})

        if (result.length != 0) {
            var sql = 'select  teachers_details.teacher_Name,students_details.student_Name from' +
                '((tutor inner join teachers_details on tutor.teacher_Id =teachers_details.teacher_Id)' +
                'inner join students_details on tutor.student_Id=students_details.student_Id)where tutor_id=' + req.params['tutor_Id'];
            con.query(sql, function (err, result) {
                if (err) {
                    console.log(err);
                    res.send("error")
                }
                else {
                    res.status(200).json({message:"sucess",data:result});
                }
            });

        } else {
            res.status(400).json({message:"error",data:"enter a valid tutor id "})
        }
    })
}


//using serach get details

exports.function_search = function (req, res) {
    var sql1 = 'select  teachers_details.teacher_Name, teachers_details.teacher_Contact_no,students_details.student_Name ,students_details.student_Contact_no ' +
        'from ((tutor inner join teachers_details on tutor.teacher_Id =teachers_details.teacher_Id) ' +
        'inner join students_details on tutor.student_Id=students_details.student_Id) ';

    var sql2 = 'where teacher_Name like ' + "'" + req.query['search'] + '%' + "'" + 'or    '
        + 'student_Name like ' + "'" + req.query['search'] + '%' + "'";


    var sorted = 'order by teacher_Name  asc ';

    var sort_desc = 'order by teacher_Name  desc ';
    if (req.query['search'] != undefined) {
        sql1 = sql1 + sql2;
        console.log("search check sucessfully")

    }
    if (req.query['sort'] != undefined) {
        if (req.query['sort'] == 1) {
            sql1 = sql1 + sorted;
            console.log("sort 1 check sucessfully")
            //console.log(sql1)

        }
        else if (req.query['sort'] == 0) {
            sql1 = sql1 + sort_desc;
            console.log("sort 0 check sucessfully")
            //console.log(sql1)

        }
    }
    if (req.query['start'] == 0 && req.query['limit'] != undefined) {
        var sql3 = 'limit ' + req.query['limit'];
        sql1 = sql1 + sql3;
        console.log("limit checked")
        //console.log(sql1)

    }
    con.query(sql1, function (err, result) {
        //console.log(sql1)

        if (err) {
            console.log(err);
        } else {
            //var arr= result
            //res.send(result);
            res.status(200).json({ massage: " ", data: result })

            console.log("read  sucessfully ");

        }

    })
}

//get students details using student id 
exports.function_studentdetails_id = function (req, res) {
    var check_sql = 'select student_Id from students_details where student_Id = ' + req.params['student_Id'];
    con.query(check_sql, function (err, result) {
        if (err) {
            res.send(err)
        } else {
            if (result.length != 0) {
                var sql = "select * from students_details where student_Id= " + req.params['student_Id'];
                con.query(sql, function (err, result) {
                    //console.log(result);
                    if (err) {
                        console.log(err);
                    } else {
                        res.status(200).json({message:"sucess",data:result});
                         console.log("readsucessfully");
                    }

                });
            } else {
                res.status(400).json({message:"error",data:"student is not available "})
            }
        }

    })



}
//update student contact details with student id
exports.function_update_studntsconatct = function (req, res) {
    if (req.body.student_contact_no.toString().length == 10) {
        console.log("codition ok")
        var sql = 'update students_details set student_Contact_no = ' + req.body.student_contact_no + ' where student_Id =' + req.body.student_id;
        var set = { student_Contact_no: req.body.student_conatct_no };

        con.query(sql, [set], function (err, result) {
            if (err) {
                console.log(err);
            } else {
                console.log("update successfully");
                res.status(200).json({message:"sucess",data:"update successfully"});
            }
        });
    }
    else {
        res.status(400).json({message:"error",data:"invalid numbers"})
    }
}
//read all books
exports.function_read_All = function (req, res) {
    // console.log("read all")
    try {

        library_data.findAll().then(user => {
            res.status(200).json({ massage: "success ", data: user });
            console.log('read sucessfully')
        })
    } catch (err) {
        res.status(400).json({message:"error",data:err});
    }

}
//read book by id
exports.function_read_id = async function(req,res){
    if (req.params.book_Id) {
        await library_data.findOne({ where: { id: req.params.book_Id } }).then(result => {
            if(result){
            res.status(200).json({ message: "success", data: result })
            }else{
                res.status(400).json({ message: "error", data:"invalid book id " })  
            }
        }).catch(err => {
            console.log(err);
            res.status(400);
        })
    }else{
        res.status(400).json({message:"error",data:"please enter book id "})
    }
}
//insert book
exports.function_insert = function (req, res) {
    console.log(req.body.book_Name)
    try {
        if (req.body.book_Name != undefined ||req.body.book_Name!=null||req.body.book_Name.length>0) {
            //console.log(req.body.book_name)
            library_data.create({
                book_Name: req.body.book_Name,
                book_Author: req.body.book_Author,
                book_Bublish_date: req.body.book_Bublish_date
            }).then(user => {
                res.json({message:"success",data:"data insert sucessfully"});
                console.log("data fetch sucessfully")
            });
           
        } else {
            res.json({message:"error",data:"book name is must"})
        }
    } catch (err) {
       res.json({message:"error",details:"unable to insert the data"})
        console.log(err)
    }


}
//find by book name
exports.function_library_findbook = async function (req, res) {

    // try{
    await library_data.findAll({
        where: {
            book_Name: req.query.book_Name


        }
    }).then(user => {



        if (user.length > 0) {
            res.json({ massage: " ", data: user })
            console.log("get book")
        } else {
            res.json({message:"error",data:"no book like that"})
        }
    }).catch(err => {
        console.log(err)
        //res.send("error")
    })

}
//delete book by book_Name
exports.function_library_deletebook = function (req, res) {
    //console.log("gflgd")
    try {
        if (req.params.book_Name.length > 0) {
            
            library_data.findAll({ where: { book_Name: req.params.book_Name } }, { attribute: ['book_Name'] }).then(user_check => {
                if (user_check.length > 0) {

                    library_data.destroy({
                        where: {
                            book_Name: req.params.book_Name
                        }

                    })
                    res.json({massage:"sucess",data:"delete sucessfully"})
                } else {
                    res.json({massage:"error",data:"no book available"})
                }
            })
        } else {
            res.json({message:"error",data:"please enter the book name"})
        }

    } catch (err) {
        console.log(err)
    }
}
//update
exports.function_update = function (req, res) {
    console.log(req.body.book_Name)
    if (req.body.book_Name != undefined) {
        console.log("hi")
        try {
            library_data.findAll({ where: { book_Name: req.body.book_Name } }, { attribute: ['id'] }).then(result_id => {
                //console.log(datavalue instanceof datavalues);


                console.log(result_id[0].id)
                //res.json({data:datavalues})
                //var jsonstring = JSON.stringify(datavalues);

                if (result_id.length > 0) {
                    library_data.update({
                        book_Name: req.body.book_Name,
                        book_Author: req.body.book_Author,
                        book_Bublish_date: req.body.book_Bublish_date},
                       { where: {id:result_id[0].id}  } 
                            
                    ).then(result=> {
                        console.log(result)
                        res.json({ message: "success", data:"update sucessfully" });
                    });

                } else {
                    res.json({message:"error",data:"invalid book name"})
                }
            })
        } catch (err) {
            console.log(err)
        }
    } else {
        res.json({message:"error",data:"please enter the book name"})
    }
}
//count all
const function_countStudents = new promise((resolve,reject)=>{
    var sql = `select count(student_Name) as numberOfStudents from students_details ;`
    con.query(sql,function(err,student_count){
        if(err){
            console.log(err);
            //res.status(400).json({message:"error",data:"sorry"});
            reject(err);
        }else{
            console.log(student_count)
            resolve(student_count[0]);
           }
    })

    
})
const function_countteachers = new promise(function(resolve,reject){
    var sql = `select count(teacher_Name) as numberOfTeachrs from teachers_details ;`
    con.query(sql,function(err,teachers_count){
        if(err){
            console.log(err);
            //res.status(400).json({message:"error",data:"sorry"})
            reject(err);
        }else{
            //  console.log(teachers_count.teacher_Name);
            resolve(teachers_count[0]);
        }
    })
})
const function_librarycount = new promise( function(resolve,reject){
    library_logins.count().then(library_count=>{
        console.log(library_count)
        resolve({numberOfLibraryUser:library_count});
    }).catch(err=>{
        // console.log(err);
        // res.status(400).json({message:"error",data:"sorry"})
        reject();
    })
})
exports.function_countall = function (req, res) {
    promise.all([function_countStudents,function_countteachers,function_librarycount])
        .then(countall => {
            console.log(countall    )
            countall = Object.assign({},...countall);
            res.status(200).json({massage:"success", data:countall})
        })
        .catch(err => {
            console.log(err);
            res.status(400).json({ message: "error", data: "sorry" })
        })
}   