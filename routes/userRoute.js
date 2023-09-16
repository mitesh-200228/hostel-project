const express = require("express");
const router = express.Router();
const User = require("../models/user")
const Room = require("../models/room");

router.post("/register", async (req, res) => {

    const { name, email, password, stg } = req.body
    let isAdmin = true;
    console.log(stg);
    if (stg === 1) {
        isAdmin = false;
    } else {
        isAdmin = true;
    }
    const newUser = new User({ name, email, password, isAdmin });
    try {
        const user = await User.findOne({ email: email });
        if (!user) res.status(404).send({ message: 'User Already Exists' });
    } catch (error) {
        res.status(500).send({ message: 'Internal server error' });
    }
    try {
        newUser.save()
        res.send('User Registered successfully')
    } catch (error) {
        return res.status(400).json({ message: error });
    }

});


router.post("/login", async (req, res) => {

    const { email, password } = req.body

    try {

        const user = await User.find({ email, password })

        if (user.length > 0) {
            const currentUser = {
                name: user[0].name,
                email: user[0].email,
                isAdmin: user[0].isAdmin,
                _id: user[0]._id
            }
            res.send(currentUser);
        }
        else {
            return res.status(400).json({ message: 'User Login Failed' });
        }

    } catch (error) {
        return res.status(400).json({ message: 'Something went weong' });
    }

});


router.get("/getallusers", async (req, res) => {

    try {
        const users = await User.find({})
        res.send(users)
    } catch (error) {
        return res.status(400).json({ message: error });
    }

});

router.post("/wishlist", async (req, res) => {
    const { userid, id } = req.body;
    try {
        let array = await User.findOne({ email: (userid.email) });
        let another = array.wishlist.push(id);
        await User.findOneAndUpdate({ email: (userid.email) }, { $push: { wishlist: id } });
        res.status(200).send('Wishlisted')
    } catch (error) {
        console.log(error);
        res.status(400).send('Error Occured')
    }
})

router.post("/getwishlist", async (req, res) => {
    const { userid } = req.body;
    console.log(userid);
    try {
        const array = await User.findOne({ email: (userid.email) });
        console.log(array.wishlist);
        let rooms = [];
        for (let i = 0; i < array.wishlist.length; i++) {
            const room = await Room.findOne({ _id: array.wishlist[i] });
            if (room !== null) {
                rooms.push(room);
            }
        }
        console.log(rooms);
        res.status(200).send(rooms)
    } catch (error) {
        console.log(error);
        res.status(400).send('Error Occured')
    }
});

router.post("/deleteuser", async (req, res) => {

    const userid = req.body.userid

    try {
        await User.findOneAndDelete({ _id: userid })
        res.send('User Deleted Successfully')
    } catch (error) {
        return res.status(400).json({ message: error });
    }

});



module.exports = router