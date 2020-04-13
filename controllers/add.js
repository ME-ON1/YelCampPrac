const express = require('express')
const mongo = require('mongoose')
const localmongoose = require("passport-local-mongoose")


const router = express.Router();

const url = 'mongodb://localhost:27017/campgrounsds';

mongo.connect(url,{useNewUrlParser:true , useUnifiedTopology:true},(err,docs)=>{
    if(!err){
        console.log("DB is runnig");
    }
    else{
        console.log("there is a error!");
        
    }
})


let commentSchema = new mongo.Schema({
    commentdf : {
        type : String
    },
    author : {
        id : {
            type : mongo.Schema.Types.ObjectId,
            ref : "user" 
        },
        username : {
            type : String        
        }
    },
})


mongo.model("comment",commentSchema);

let campgroundSchema = new mongo.Schema({
    id : {
        type : Number,
        require: "REQUIRES"
    },
    name : {
        type: String,

    },
    description : {
        type: String,
        // require: "REQUIRES"
    },
    url : {
        type : String
    },
    author : { 
        id : {
            type : mongo.Schema.Types.ObjectId,
            ref : "user"
        },
        username : String
    },
    commment : [{
        
        type : mongo.Schema.Types.ObjectId,
        ref : "comment"
    }]
})

let userSchema = new mongo.Schema({
    username : String,
    password : String,
    comment : [{
        type : mongo.Schema.Types.ObjectId,
        ref : "comment"
    }]
})

userSchema.plugin(localmongoose)
mongo.model("user",userSchema,"users")
// let Campground = 




module.exports = mongo.model("Campground",campgroundSchema);
