const express  = require('express'),
      mongoose = require("mongoose"),
      ObjectID = require("mongoose").ObjectID
      mongo    = require("../controllers/add")


const router = express.Router()

// console.log("router msf");


let Campground = mongoose.model("Campground")

router.get('/')

router.get('/commment/new',(req,res,next)=>{
        res.send(req.params.id)
})

// router.post()

module.exports = router;

