var express = require('express');
var app = module.exports = express();
var sql = require("mysql");
var http = require('http');
var url = require('url');
var routes = require('routes');
var moment = require('moment');
var twilio = require('twilio');
var path = require('path');
var bodyParser = require('body-parser');
//var bcrypt = require('bcrypt');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('express-flash');
const multer = require("multer");
var nodemailer = require('nodemailer');
const fs = require("fs");
const accountSid='AC024740f97f11f5b08c990482c677dec3';
const authToken='066bec9189ae2ffe50cf3b8c22ebdacb';

app.use(flash());
app.use(bodyParser.json() );       // to support JSON-encoded bodies
//abc=bodyParser.urlencoded({extended: true});

app.use(bodyParser.urlencoded({extended: true}));
app.use(session({ cookie: { maxAge: 60000 },
                  secret: 'woot',
                  resave: false,
                  saveUninitialized: false}));
//database
var con = sql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database: "biddingnew"
});
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, (file.filename = file.originalname));
  }
});
const upload = multer({ storage: storage });
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');


app.set('port', process.env.PORT || 3000);


app.use(express.static(__dirname + '/public'));
//app.use(app.router);

app.get('/', function(req, res){
	res.render('index', {sayHelloTo: 'world'});
});

app.get('/signup', function(req, res){
	res.render('signup');
});
app.get('/about', function(req, res){
	res.render('about');
});app.get('/contact', function(req, res){
	res.render('contact');
});




app.get('/login', function(req, res){
	res.render('login');
});


app.get('/provider/:id', function(req, res){       ////HERE I HAVE CHANGE
 var sql="select id from user where id='"+req.params.id+"'";
 console.log(req.params.id);
con.query(sql,function(err,rows){
  res.render('provider',{data:rows});
})

});

app.get('/admin', function(req, res){
	var sql = "Select * from user where role >1";
	con.query(sql,req.body,function(err,rows){
		//res.send({"code":200,"success":rows});
		res.render('admin',{data:rows});
	});
});
app.get('/jobseeker/:id', function(req, res){
	var sql = "Select * from project";
    var user = req.params.id;
    console.log(user);
	con.query(sql,req.body,function(err,rows){
		//res.send({"code":200,"success":rows});
		res.render('jobseeker',{data:rows,user:user});
	});
});
//HERE I HAVE CHANGED IDDP
app.get('/checkOrder/:id', function(req, res){
  var sql="select p.Id,p.projTitle,p.projDesc,p.Price,b.bidProj, b.bidPrice, b.actionBy,b.bidBy, u.firstName,u.lastName  from project p,bidorder b, user u where b.bidBy=u.id and b.bidProj=p.Id and p.lid='"+req.params.id+"'";
	//var sql = "SELECT project.*, bidorder.bId, bidorder.bidProj, bidorder.bidPrice, bidorder.actionBy,bidorder.bidBy, user.firstName,user.lastName, bidorder.bId FROM bidorder JOIN user ON bidorder.bidBy=user.id JOIN project ON bidorder.bidProj = project.Id   ";
  console.log("j");
	con.query(sql,req.body,function(err,rows){
		//console.log(rows);
		res.render('bidorder',{data:rows});
	});
});

app.get('/bid/:bId/:id', function (req, res) {
	var sql = "Select * from project where Id="+req.params.bId;
  var uner=req.params.id;
	con.query(sql,function(err,rows){
		if(err) throw err;
		res.render('bidProj',{page_title:'Edit Table',data:rows,uner:uner});
	});
})
app.get('/edit/:userId', function (req, res) {
	var sql = "Select * from user where role >1 and id="+req.params.userId;
	con.query(sql,function(err,rows){
		if(err) throw err;
		res.render('editUser',{page_title:'Edit Table',data:rows});
	});
})



app.get('/delete/:userId', function (req, res) {
	var sql = "delete from user where role >1 and id="+req.params.userId;
	con.query(sql,function(err,rows){
		if(err) throw err;
		res.redirect('/admin');
	});
})


app.post('/update', function (req, res) {
	var sql = "Update user set firstName = \'\"+req.body.firstName +\"\', lastName =\'\"+req.body.lastName +\"\', contact =\'\"+req.body.contact +\"\' where id=\"+req.body.id\"";
	con.query(sql,function(err,rows){
		if(err) throw err;
		res.redirect('/admin');

	});
})

//// here i have done change for userrrr
app.post('/bidDone/:id', function (req, res) {
  console.log(req.params.id);
	var sql="insert into bidorder(bidBy,bidProj,bidPrice) values('"+req.params.id+"','"+req.body.pid+"','"+req.body.userPrice+"')";
	con.query(sql,function(err,rows){
		if(err) throw err;

		res.redirect('/jobseeker/'+req.params.id);
	});
})

app.post('/add/:id',function(req,res)
{  console.log("serverfile");
  console.log(req.params.id);
console.log(req.body.projectname);
	var sql="insert into project(projTitle,projDesc,price,lid) values('"+req.body.projectname+"','"+req.body.projectdescription+"','"+req.body.price+"','"+req.params.id+"')";
	con.query(sql,function(err,rows)
	{
		if(err)
		{
			  console.log(err);
		}
		else{
			 console.log("Print");

			 res.redirect('/provider/'+req.params.id);

		}

});





})

//const client=require('twilio')(accountSid,authToken);

//{ console.log('calling')
//  client.calls
  //    .create({
    //     url: 'http://demo.twilio.com/docs/voice.xml',
      //   to: '+919877392710',
  //       from: '+12053862304'
  //     })
    //  .then(call => console.log(call.sid));


///////////////////////////node tester////var nodemailer = require('nodemailer');

var nodemailer = require('nodemailer');
//var stringify = require('json-stringify');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
var smtpTransport = require('nodemailer-smtp-transport');

var mailAccountUser = 'manavsharma136@gmail.com'
var mailAccountPassword = 'sycomanav13'

var fromEmailAddress = 'manavsharma136@gmail.com'
var toEmailAddress = 'khairamani27@gmail.com'

var transport = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    auth: {
        user: mailAccountUser,
        pass: mailAccountPassword
    }
}))


//app.post('/call1',function(req,res)
//{

//})


//////////////////////////////////email teste//////////////
//var client = new twilio(process.env.AC024740f97f11f5b08c990482c677dec3,'authToken');
app.post('/finaldecision', function (req, res) {
  var x=req.body.decison;
	var sql="Update bidorder set actionBy= '"+req.body.decison+"' where bidBy ='"+req.body.bidby+"' and bidProj ='"+req.body.pid+"'";
  var mail = {
      from: fromEmailAddress,
      to: toEmailAddress,
      subject: "hello your bid got"+x +"contact us for more details",
      text: "Hello you get slected!",
      html: "<b>Hello!</b><p><a href=\"http://www.yahoo.com\">Click Here</a></p>"
  }
	con.query(sql,function(err,rows){
		if(err) console.log('gi');
    transport.sendMail(mail, function(error, response){
        if(error){
            console.log(error);
        }else{
            console.log("Message sent: " + response.message);
        }

        transport.close();
    });

    res.redirect('/checkOrder');

	});
})





app.post('/register', (req, res,next)=> {
		var sql = "Insert into user SET ?";
		con.query(sql,req.body,function(err,rows){
			if(err){
				console.log(err);

			}else{
        console.log('donesignup');
				res.redirect('/signup');
			}
		});
	//});
})



app.post('/admin', function (req, res,next) {
	var sql = "Select * from user where username = '"+req.body.userName +"'";
	con.query(sql,req.body,function(err,rows){
		if(err){
			console.log(err);
		}else{
			if(rows.length>0){
				//bcrypt.compare(req.body.password, rows[0].password, function(err, resDa) {
					if(req.body.password === rows[0].password) {
						if(rows[0].role == 1){
							res.redirect('/admin');
						}else if(rows[0].role == 2){
							res.redirect('/provider/'+rows[0].id);
              //res.render(__dirname + "/list-all-users.html", response);
              /////////HERE I HAVE CHANGED ID NOW
						}else{
              console.log("vv");
							res.redirect('/jobseeker/'+rows[0].id);
						}
						//res.send('userPage',{"code":200,"success":"login sucessfull"});
					} else {
						// Passwords don't match
						res.send({"code":204,"success":"login Unsucessfull"});
						res.end();
					}
				//});
			}
		}
		//res.end();
	});
})

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
