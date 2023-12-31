const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const moment = require("moment");
const stripe = require("stripe")(
  "sk_test_51KVaPpSBoH9Q6SnmLGZRJAK4m2xpkAWhYfUTHOiQcuK8Bo22JbqpUs0p49QTgsesuRhLcMMf9DOrfFYqMd9yXzpK00rJImYpKB"
);
const Booking = require("../models/booking");
const Room = require("../models/room");
router.post("/bookroom", async (req, res) => {
  const { room, fromdate, todate, totalDays, totalAmount, user, token } = req.body;
  const YOUR_DOMAIN = 'http://localhost:5000';
  try {
    // res.redirect(303, session.url);
    // if (payment) {
    let owneremail = "";
    try {
      const data = await Room.findOne({ _id: room._id });
      owneremail = data.your_email;
    } catch (error) {
      return res.status(500).json({ message: error });

    }
    try {
      const newbooking = new Booking({
        userid: user._id,
        room: room.name,
        roomid: room._id,
        totalDays: totalDays,
        fromdate: moment(fromdate).format("DD-MM-YYYY"),
        todate: moment(todate).format("DD-MM-YYYY"),
        totalAmount: totalAmount,
        transactionId: "1234",
        status: 'booked',
        roomownerid: owneremail
      });

      await newbooking.save(async (err, booking) => {
        const oldroom = await Room.findOne({ _id: room._id });

        oldroom.currentbookings.push({
          bookingid: booking._id,
          fromdate: moment(fromdate).format("DD-MM-YYYY"),
          todate: moment(todate).format("DD-MM-YYYY"),
          userid: user._id,
          status: 'booked'
        });
        await oldroom.save();
      });
      const data = await Room.findOne({ _id: room._id });
      // console.log(data.maxcount, data._id);
      await Room.findOneAndUpdate({ _id: (room._id) }, { maxcount: parseInt(data.maxcount) - 1 });
      res.send("Room Booked Successfully");
    } catch (error) {
      return res.status(400).json({ message: error });
    }

  } catch (error) {
    return res.status(400).json({ message: "Something went wrong" + error });
  }

});

router.post("/cancelbooking", async (req, res) => {
  const { bookingid, roomid } = req.body;

  try {
    const bookingitem = await Booking.findOne({ _id: bookingid })
    bookingitem.status = 'cancelled'
    await bookingitem.save();
    const room = await Room.findOne({ _id: roomid });
    await Room.findByIdAndUpdate({ _id: roomid }, { $inc: { maxcount: 1 } });
    const bookings = room.currentbookings
    const temp = bookings.filter(booking => booking.bookingid.toString() !== bookingid)
    room.currentbookings = temp;
    await room.save();

    res.send('Booking deleted successfully')
  } catch (error) {
    return res.status(400).json({ message: "something went wrong" });
  }
});

router.post("/getuserbookings", async (req, res) => {
  const { userid } = req.body;
  try {
    const bookings = await Booking.find({ userid: userid }).sort({ _id: -1 });
    res.send(bookings);
  } catch (error) {
    return res.status(400).json({ message: "Something went wrong" });
  }
});

router.get("/getallbookings", async (req, res) => {
  try {
    const bookings = await Booking.find({});
    res.send(bookings);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

module.exports = router;
