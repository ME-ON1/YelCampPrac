let express = require("express")
let app = express()
let bp = require("body-parser")
let path = require('path')
const mongoose = require('mongoose');
const mongo = require('./controllers/add')
const seedDB = require('./seed');   
const controllers = require("./controllers/add")
const addnewComm = require("./routes/addnewComm")
const passport = require("passport")
const LocalStrategy = require('passport-local').Strategy; 
const methodover    = require("method-override")
const localmongoose = require("passport-local-mongoose")

const url = 'mongodb://localhost:27017/campgrounsds';
let Campground = mongoose.model("Campground");
let Comment = mongoose.model("comment")
let User = mongoose.model("user")
let ObjectID = require('mongodb').ObjectID

app.use(require("express-session")({ 
    secret : "NOT TELLING YOU",
     resave : false,
     saveUninitialized : false 
}))


app.use(express.static(path.join(__dirname,'css')))
app.use(bp.urlencoded({extended : true}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodover("_method"))
app.set("view engine","jade")
app.set("views", "views")

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(function(req,res,next){
    // if(req.isAuthenticated()){
    res.locals.currentUser = req.user
    next();
    // }
 })

app.get("/register",(req,res,next)=>{
    res.render("homepage")
})

app.post("/register",(req,res,next)=>{
   User.register(new User({username : req.body.username}),req.body.password,(err,user)=>{
       if(err){
           return res.json(err)
       }
       passport.authenticate("local")(req,res,function(){
           res.redirect('/campgrounds');
       })
    })
})

app.get("/login",(req,res,next)=>{
    res.render("login")
})


app.post("/login",passport.authenticate("local",{
    successRedirect : '/campgrounds',
    failureRedirect : '/error'
}),(req,res,next)=>[
     next()
])

app.get("/error",(req,res,next)=>{
    res.render("error")
})

function isLogin(req,res,next){
    console.log(req.isAuthenticated());
    
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect("/login")
}

app.get("/logout",(req,res,next)=>{
    req.logOut();
    res.redirect("/login")
})


app.get('/campgrounds',isLogin,(req,res,next)=>{
   
    Campground.find({},(err,obj)=>{
        if(!err){
            res.render("index",{
                obj : obj
            })
        }
        else{
                res.json({msg:"there's a error in get /campgrounds"})
            }
        })
        // console.log(req.user._id);
        // next();
    })


  
app.get('/campgrounds/:id/edit',isLogin,checkAuth,(req,res,next)=>{
    
    Campground.findById(req.params.id).then((foundcamp)=>{
        // if(foundcamp.author.id.equals(req.user._id)){
            res.render('edit',{
                foundcamp : foundcamp
            })
        }).catch((e)=>{
            console.log(e);
            
        })
        // else{
        //     res.send("WAITA MIN YOU ARE NOT THE OWNER")
        // }
        

})

app.put('/campgrounds/:id/edit',isLogin,checkAuth,(req,res,next)=>{
    let t = {name : req.body.name, description : req.body.desc, url : req.body.url}
    Campground.findByIdAndUpdate(req.params.id,t).then((editCamp)=>{
            
        res.redirect("/campgrounds/" + req.params.id)
    }).catch((e)=>{
        console.log(e);
        
    })
    // res.send("OK")
})

app.delete("/campgrounds/:id/delete",isLogin,checkAuth,(req,res,next)=>{
    Campground.findById(req.params.id).then((foundcamp)=>{ 
        // if(foundcamp.author.id.equals(req.user._id)){
            Campground.findByIdAndDelete(req.params.id).then(()=>{
                res.redirect("/campgrounds")
            })
        }).catch((e)=>{
                console.log(e);
                
            })
        
        // else{
        //     res.send("JYDAADA ShYAANPATTI M+NH APNA DELETE KAR")
        // }
    })

app.get("/campgrounds/new",(req,res,next)=>{
    res.render("newform")
})

app.post('/campgrounds/new',isLogin,(req,res,next)=>{
    //  console.log(req.body)
    let author = {
        id : req.user._id,
        username : req.user.username
    }
     let t = {id: req.body.id, name : req.body.name, description : req.body.desc, url : req.body.url, author :author}
     Campground.create(t,(err,docs)=>{
        if(!err){
            // console.log("it has been created"
            console.log(docs);
            
            res.redirect('/campgrounds')
            
        }else{
            res.json({msg : "there has been a error"});
            
        }
    })
    // res.send("SEND")
    //  console.log(obj)
})


app.get("/campgrounds/:id/comment/new",isLogin,(req,res,next)=>{
    // Campground.findById(req.params.id).then((foundCamp)=>{
        res.render("addcomment",{
            id : req.params.id,
            username : req.user.username
        // })             
    })
    
})

app.post("/campgrounds/:id/comment",isLogin,(req,res,next)=>{
Campground.findById(req.params.id).then((foundCamp)=>{
    Comment.create({commentdf : req.body.title, author : req.user.username}).then((newComm)=>{
        // console.log("before" + newComm);
        
        newComm.author.id = req.user._id
        newComm.author.username = req.user.username;
        // console.log(newComm);
        
        newComm.save();
        // console.log("newComment"  + newComm);
        foundCamp.commment.push(newComm)
        foundCamp.save()
        req.user.comment.push(newComm._id)
        req.user.save()
        
        
    })
}).then(()=>{
    res.redirect('/campgrounds/' + req.params.id)
}).catch((e)=>{
    console.log(e);
    
    res.json(e);
    
})

    console.log(req.user);
    
});

app.get("/campgrounds/:id/comment/:comm/edit",checkAuth,(req,res,next)=>{
    Campground.findById(req.params.id).then((foundCamp)=>{
        res.render("editComment",{
          foundCamp,
          id1 : req.params.id,
          id :  req.params.comm 
        })
    })
   
})

app.put("/campgrounds/:id/comment/edit/:comm",checkAuth,(req,res,next)=>{
    // let t = {}
    Comment.findById(req.params.comm).then((foundComment)=>{
    //   console.log("before" + foundCamp);
    console.log(req.body.title)
      foundComment.commentdf = req.body.title;
      foundComment.save()
        res.redirect("/campgrounds/" + req.params.id)
    //   console.log("before" + foundCamp)
    //   res.redirect("/campgrounds/" + req.params.id )
  }).catch((e)=>{
      console.log(e)
  })
})

app.delete("/campgrounds/:id/comment/:comm",checkAuth,(req,res,next)=>{
    Comment.findByIdAndDelete(req.params.comm).then(()=>{
        res.redirect("/campgrounds/" + req.params.id)
    }).catch((e)=>{
        console.log(e);
    })
})

app.get('/campgrounds/:id',isLogin,(req,res,next)=>{
    
    Campground.findById(req.params.id).populate("commment").then((result)=>{
               res.render("show",{
                result : result,
                username : req.user.username
    })
    // console.log(result);
    
    }).catch((e)=>{
        
        res.json("theres a ERROR AMY!!!")
    })
   
    
});


function checkAuth(req,res,next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id).then((foundcamp)=>{
            if(foundcamp.author.id.equals(req.user._id)){
                return next()
            }
            else{
                return res.redirect("back")
            }
            
    
        })
    }
    else{
        return res.redirect("back")
    }
    
}

app.listen(3000)