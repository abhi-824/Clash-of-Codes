const express=require('express');
const passport = require('passport');
const router=express.Router();
const Question=require('../database models/questions')
const User=require('../database models/userModel')
const Contest=require('../database models/contest')
const crypto = require('crypto')

router.get('/contest/test',(req,res)=>{
    var date=new Date()
    console.log(date)
    var t=date.toLocaleString()
    console.log(t);
    // var y=date.toLocaleTimeString()
    // console.log(y)
    res.json({message:"verified"})
})

router.put('/contest/joinRoom/:roomId',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const roomId=req.params.roomId;
    // console.log(req.params)
    Contest.findOne({roomId:roomId})
    .then((foundRoom)=>{
        if(!foundRoom)
        {
            return res.status(400).json({error:"no such room found"})
        }

        console.log(foundRoom.participants.includes(req.user.id))
        if(!foundRoom.participants.includes(req.user.id))
        {
            foundRoom.participants.push(req.user.id)
        }
        
        foundRoom.save()
        .then(()=>{
            res.status(200).json({room:foundRoom})
        })
        
    })
    .catch((err)=>{
        console.log(err)
    })
})

router.post('/contest/createRoom',passport.authenticate('jwt',{session:false}),(req,res)=>{
    
    var roomName;
    if(req.body.name)
    roomName=req.body.name
    else
    roomName='Default'

    var randomCode=crypto.randomBytes(3).toString('hex')
    console.log(randomCode)

    Contest.findOne({randomCode})
    .then((foundRoom)=>{
        if(foundRoom)
        {
            return res.status(400).json({error:true,message:"room already exists"})
        }

        var currentTime=new Date();
        // currentTime=currentTime.toLocaleString();
        
        const newRoom=new Contest({
            roomId:randomCode,
            type:"abc",
            participants:req.user,
            admin:req.user,
            timeOfCreation:currentTime,
            expiry:currentTime + 3*60*60*1000
        })

        newRoom.save()
        .then((savedRoom)=>{
            return res.status(200).json(savedRoom)
        })

    })
    .catch((err)=>{
        console.log(err)
    })
    
})

module.exports=router;