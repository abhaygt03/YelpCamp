var v=require("express");
var bodyparser=require("body-parser");
var mongoose=require("mongoose");
var passport=require("passport");
var methodoverride=require("method-override");
var passportlocal=require("passport-local");
var User=require("./models/user")
var expresssession=require("express-session"); 
var flash=require("connect-flash");


var app=v();
app.use(flash());
app.use(bodyparser.urlencoded({ extended: true }));
// mongoose.connect("mongodb://localhost/yelpcamp",{useNewUrlParser:true});
mongoose.connect("mongodb+srv://abhay_gt03:gautams1303@cluster0-q5c2n.mongodb.net/test?retryWrites=true&w=majority",{useNewUrlParser:true});



app.use('/public', v.static('public'));
app.use(methodoverride("_method"));
app.use(expresssession({
	secret:"my name is khan",
	resave:false,
	saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportlocal(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

var commentschema=new mongoose.Schema({
	comment:String,
	author:String,
	likes:Number
});
var commentmodel=mongoose.model("comment",commentschema);

var yelpschema=new mongoose.Schema({
	name:String,
	img:String,
	description:String,
	submittedby:String,
	comment:[commentschema]
});
var yelpmodel=mongoose.model("campground",yelpschema);

//==============================================================================================================//
//To Add Comments
app.get("/comments/:id",isLoggedIn,function(req,res){
	var id=req.params.id;
	yelpmodel.findById(id,function(err,ret){
		if(err){
			console.log("Something went wrong");
			console.log(err);
		}
		else{
			res.render("comments.ejs",{obj:ret,currentuser:req.user});
}
});
});



app.post("/comments/:id",isLoggedIn,function(req,res){
	var id=req.params.id;
	var cm=req.body.data;
	var author=req.user.username;
	var author=author[0].toUpperCase()+author.slice(1);

	yelpmodel.findById(id,function(err,ret){
		if(err){
			console.log(err);
		}
		else{
			ret.comment.push({
				comment:cm,
				author:author,
				likes:0
			});
			var len = ret.comment.length;
			var cmt = commentmodel.create({
				_id: ret.comment[len-1]._id,
				comment: cm,
				author: author,
				likes: 0
			}, function(err, ret) {
				if (!err) {
					console.log(ret)
				} else {
					console.log(err)
				}
			})
		}
		ret.save(function(err,ret){
			if(err)
			{
				console.log("error in saving data");
				console.log(err);
			}
		});
		res.redirect("/campgrounds/"+id);
	});
});

app.get("/register",function(req,res){
	res.render("register.ejs",{message:req.flash("err")});
});

app.post("/register",function(req,res){
var username=req.body.username;
var password=req.body.password;

User.register(new User({username:username}),password,function(err,user){
	if(err)
	{
		console.log(err);
		req.flash("err",err.message);
		return res.redirect("/register");
	}
		passport.authenticate("local")(req,res,function(){
			req.flash("success","Welcome to YelpCamp "+username);
			res.redirect("/campgrounds");
		})
})
});
app.get("/campgrounds",function(req,res){
	yelpmodel.find({},
		function(err,ret){
			if(err){
				console.log("Something went wrong while getting data from database");
				console.log(err);
			}
			else{
				res.render("campgrounds.ejs",{arr:ret,currentuser:req.user,message:req.flash("logout"),msg:req.flash("success")});
			}
		}
		)});


app.get("/login",function(req,res){
	res.render("login.ejs",{message:req.flash("error")});
});

app.post("/login",passport.authenticate("local",{
	// req.flash("login","Your Have Succefully Logged In")
	successRedirect:"/campgrounds",
	failureRedirect:"/login"
}),function(res,req){
});

app.get("/logout",function(req,res){
	req.logout();
	req.flash("logout","Logged Out Successfully!!");
	res.redirect("/campgrounds");
});



app.get("/",function(req,res){

	res.render("landing.ejs",{currentuser:req.user});
})

app.post("/campgrounds",function(req,res){
var name=req.body.name;
var img=req.body.img;
var des=req.body.description;
yelpmodel.create({
	name:name,
	img:img,
	description:des,
	submittedby:req.user.username[0].toUpperCase()+req.user.username.slice(1)
	},function(err,ret){
	if(err){
		console.log("Something went wrong");
		console.log(err);
	}
	else{
		res.redirect("/campgrounds");
	}
});

});

app.get("/likes/:id/:i",function(req,res){
var	backURL=req.header('Referer') || '/';
var id=req.params.id;
var i=req.params.i;
yelpmodel.findById(id,function(err,ret){
		if(!err)
		{
			ret.comment[i].likes +=1;
			ret.save();
		}
	});
res.redirect(backURL);
});

app.get("/maps",function(req,res){
	res.render("map.ejs");
})


app.get("/campgrounds/new",isLoggedIn,function(req,res){
	res.render("new.ejs",{currentuser:req.user});
})

app.get("/campgrounds/:id",function(req,res){
	yelpmodel.findById(req.params.id,function(err,ret){
		if(err)
		{
			res.send("Something went wrong!!");
		}
		else{
			res.render("show.ejs",{obj:ret,currentuser:req.user});		
		}})});

app.get("/edit/:id",isLoggedIn,function(req,res){
var id=req.params.id;
yelpmodel.findById(id,function(err,ret){
	if(err)
	{
		console.log("error in accessing the campground");
	}
	else{
		if(req.user.username.toUpperCase()==ret.submittedby.toUpperCase())
		{
	res.render("edit.ejs",{obj:ret,currentuser:req.user});
}
else{
	res.send("Your are not authorised to perform this action");
	}
}
})
});

app.put("/update/:id",isLoggedIn,function(req,res){
	var id=req.params.id;
	yelpmodel.findByIdAndUpdate(id,req.body.camp,function(err,ret){
		if(err)
		{
			console.log("Error while updating the campground");
		}
		else{
			if(req.user.username.toUpperCase()==ret.submittedby.toUpperCase())
			{
			res.redirect("/campgrounds/"+id);
		}
		else{
	res.send("Your are not authorised to perform this action");

		}
	}
	})
});

app.get("/delete/:id",isLoggedIn,function(req,res){
var id=req.params.id;
yelpmodel.findById(id,function(err,ret){
	if(!err)
	{
		if(req.user.username.toUpperCase()==ret.submittedby.toUpperCase())
		{
			yelpmodel.deleteOne({_id:id},function(err,ret){
	if(err)
	{
		console.log("Error while deleting the campground");
	}
	else{
		
		res.redirect("/campgrounds");
	}
})
		}
		else{
	res.send("Your are not authorised to perform this action");

	}
	}

})
});

app.get("/delete/comment/:id/:i",isLoggedIn,function(req,res){
	var	backURL=req.header('Referer') || '/';
	var id=req.params.id;
	var i=req.params.i;

	yelpmodel.findById(id,function(err,ret){
		if(!err)
		{
			if(req.user.username.toUpperCase()==ret.comment[i].author.toUpperCase())
			{
			ret.comment[i].remove();
			ret.save();
			res.redirect(backURL);
		}
		else{
			res.send("Your are not authorised to perform this action");
		}
		}
	})
});

app.get("/update/comment/:id/:i",isLoggedIn,function(req,res){
		var currentuser=req.user;
		var id=req.params.id;
		var i=req.params.i;
		yelpmodel.findById(id,function(err,ret){
			if(!err)
			{
				if(req.user.username.toUpperCase()==ret.comment[i].author.toUpperCase())
				{
		res.render("updatecmt.ejs",{obj:ret,i:i,currentuser:currentuser});
				}
				else{
					res.send("Your are not authorised to perform this action");
				}
			}
		})
});

app.put("/update/comment/:id/:i",function(req,res){
	var id=req.params.id;
	var i=req.params.i;
	yelpmodel.findById(id,function(err,ret)
	{if(err)
		{
			console.log("Errorwhile updating the comment");
		}
		else{
			if(req.user.username.toUpperCase()==ret.comment[i].author.toUpperCase())
			{
		      ret.comment[i].comment=req.body.cmt;
			  ret.save();
			  res.redirect("/campgrounds/"+id);
		}
		else{
	res.send("Your are not authorised to perform this action");

		}
	}
	});
});

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
	return next();
	}
	req.flash("error","Your Must Be Logged In First");
	res.redirect("/login");
}

app.listen(process.env.PORT || 5000,function(){
	console.log("The YelpCamp Server has started!!");
});