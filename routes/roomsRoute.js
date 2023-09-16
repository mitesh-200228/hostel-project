const express = require("express");
const router = express.Router();
const Room = require("../models/room")
const mongoose = require("mongoose");
router.get("/getallrooms", async (req, res) => {

     try {
          const rooms = await Room.find()
          res.send(rooms)
     } catch (error) {
          return res.status(400).json({ message: 'something went wrong' });
     }

});


router.post("/getroombyid", async (req, res) => {
     console.log(req.body);
     try {
          const room = await Room.findOne({ '_id': req.body.roomid })
          res.send(room)
     } catch (error) {
          return res.status(400).json({ message: error });
     }
});

router.get("/getallrooms", async (req, res) => {
     console.log(req.body);
     try {
          const rooms = await Room.find({})
          res.send(rooms)
     } catch (error) {
          return res.status(400).json({ message: error });
     }
});

router.post("/addroom", async (req, res) => {
     const { room,
          rentperday, maxcount, description, phonenumber, type, image1, image2, image3, your_email, breakfast, lunch, dinner,area } = req.body
     console.log(breakfast, lunch, dinner);
     if (!room || !rentperday || !maxcount || !description || !phonenumber || !image1 || !image2 || !image3 || !your_email || !type || !area) {
          return res.status(400).json({ message: 'send all details' });
     }
     let food = "bldinner";
     if(breakfast && dinner && !lunch){
          food = "bdinner";
     }else if(!breakfast && dinner && !lunch){
          food = "dinner";
     }
     const newroom = new Room({
          name: room,
          rentperday,
          maxcount, description, phonenumber, type, imageurls: [image1, image2, image3], currentbookings: [], your_email, foods:food, area
     })
     try {
          await newroom.save()
          return res.status(200).send('New Room Added Successfully')
     } catch (error) {
          console.log(error);
          return res.status(400).json({ error });
     }
});


module.exports = router