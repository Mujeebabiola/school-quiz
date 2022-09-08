const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');
const port = 3000;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs');
app.use(express.static('public'))

const PurifyString = require('./myfunction.js');

mongoose.connect('mongodb://localhost:27017/studentAndstaffDB');


const students = mongoose.model('students', { username: String,password:String });
const staffs = mongoose.model('staffs', { username: String,password:String });

const questionSchema={
    question:String,

        option1:String,
        option2:String,
        option3:String,
        option4:String,
    answer:String
}
const questions = mongoose.model('questions',questionSchema);


var LoginError = ''
var usernotfound = ''
var pageNum =0;
var totalPoints = 0

app.route('/')
.get((req,res)=>{
    res.render('student/login',{error:LoginError,usernotfound:usernotfound})
    totalPoints =0;
    pageNum = 0;
})
.post(function(req,res){
    var studentID = req.body.username;
    var password = req.body.password;

    students.findOne({username:studentID},function(err,result){
        if(err){
            console.log(err)
        }
        else if(result){
            if(result.password===password){
                res.redirect("test")
            }
            else{
                LoginError = "incorrect password entered"
                usernotfound = ''
                res.redirect('/')
            }
        }
        else{
            usernotfound='User not found, try to register instead'
            LoginError=''
            res.redirect('/')
        }
    })
})

var usernameUnavailable =""
app.route("/register")
.get(function(req,res){
    res.render('student/register',{usernameUnavailable :usernameUnavailable})
})
.post(function(req,res){
    var studentID = req.body.username;
    var password = req.body.password;

    students.findOne({username:studentID},function(err,result){
        if(err){
            console.log(err)
        }
        else if(result){
            //if the username already exists, pop up this error message
          usernameUnavailable ="Sorry, this ID is already taken, choose a new one"
          res.redirect('/register')
        }
        else{
            //save it to to our database
            const student = new students({ username: studentID,password:password });
            student.save(function(err){
                if (err){
                    console.log(err)
                }
                else{
                    res.redirect('test')
                }
            })
           
        }
    })
})


pageNum =0;
totalPoints = 0
var total_length =0
app.route("/test")
.get(function(req,res){
    questions.find(function(err,result){
        if(err){
            console.log(err)
        }
        else{
         total_length=result.length

           if(pageNum<result.length){
            return res.render('student/test',{result:result,pageNum:pageNum})
           }
           else{
            return res.redirect('/test/result')
           }
            
        }
    })
})
.post((req,res)=>{
    var answer = req.body.option
    questions.find(function(err,result){
        if(err){
            console.log(err)
        }
        else if (PurifyString(result[pageNum].answer)===PurifyString(answer )){
            totalPoints = totalPoints+1;
        }
        else if (pageNum===result.length-1){
         return res.redirect('/test/result')
           
        }
        pageNum = pageNum+1;
        return res.redirect('/test')
    
    
    })
})

app.get('/test/result',function(req,res){
    res.render('student/result',{totalPoints:totalPoints,overallPoints : total_length})
    totalPoints =0;
    pageNum = 0;
})









//Working on the staff page now!






app.route('/staff')
.get((req,res)=>{
    res.render('staff/login',{error:LoginError,usernotfound:usernotfound})
})
.post(function(req,res){
    var staffID = req.body.username;
    var password = req.body.password;

    staffs.findOne({username:staffID},function(err,result){
        if(err){
            console.log(err)
        }
        else if(result){
            if(result.password===password){
                res.redirect("/staff/post")
            }
            else{
                LoginError = "incorrect password entered"
                usernotfound = ''
                res.redirect('/staff')
            }
        }
        else{
            usernotfound='User not found, try to register instead'
            LoginError=''
            res.redirect('/staff')
        }
    })
})

usernameUnavailable =''
app.route("/staff/register")
.get(function(req,res){
    res.render('staff/register',{usernameUnavailable:usernameUnavailable})
})
.post(function(req,res){
    var staffID = req.body.username;
    var password = req.body.password;

    staffs.findOne({username:staffID},function(err,result){
        if(err){
            console.log(err)
        }
        else if(result){
            //if the username already exists, pop up this error message
          usernameUnavailable ="Sorry, this ID is already taken, choose a new one"
          res.redirect('/staff/register')
        }
        else{
            //save it to to our database
            const staff = new staffs({ username: staffID,password:password });
            staff.save(function(err){
                if (err){
                    console.log(err)
                }
                else{
                    res.render('staff/post')
                }
            })
           
        }
    })
})


app.route("/staff/questions")
.get(function(req,res){
   questions.find(function(err,questionList){
    if(err){
        console.log(err)
    }
    else{
        res.render('staff/questions',{questionList:questionList})
    }
   })
})
app.listen(port,()=>{
    console.log(`The app is listening on the port ${port}`)
})


