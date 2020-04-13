const mongoose = require("mongoose")

let Campground = mongoose.model("Campground");
let comment = mongoose.model("comment")

let datas = [{
    id : 1,
    name : "pta m",
    url : "https://images.pexels.com/photos/2793456/pexels-photo-2793456.jpeg?cs=srgb&dl=aerial-shot-of-a-building-2793456.jpg&fm=jpg",
    description : "some abstract"
}, {
    id : 2,
    name : "kyu btau",
    url : "https://images.pexels.com/photos/4049990/pexels-photo-4049990.jpeg?cs=srgb&dl=people-woman-coffee-desk-4049990.jpg&fm=jpg",
    description : "kitchen"
},{
    id : 3,
    name : "bikul ng",
    url : "https://images.pexels.com/photos/3467149/pexels-photo-3467149.jpeg?cs=srgb&dl=buildings-near-body-of-water-3467149.jpg&fm=jpg",
    description : "bridge"
}] 


let comm  = [,
{
    author : "hiin",
    commentdf : "v v good"
}];


function seed(){
    Campground.deleteMany({}).then(()=>{
        console.log("deleted everything");
        
    }).then(()=>{
        datas.forEach((data)=>{
        Campground.create(data,(err,resultData)=>{
            if(!err){
                console.log("SUCESS IN CREATING resultDATA");
                comment.create({
                    author : "heleen",
                    commentdf : "this a very  good pic"
                },(err,newcomment)=>{
                    if(err){
                        console.log("erroe in making comment");
                        
                    }
                    else{
                        resultData.commment.push(newcomment);
                        resultData.save()
                        console.log("succes");
                        
                    }
                })
            }
            else{
                console.log("ERRR");
            }
        })
        })
    }).catch((err)=>{
        console.log(err);
        
    })

    
}




module.exports = seed;