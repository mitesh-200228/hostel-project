import React, { useState, useEffect } from "react";
import { Tabs } from "antd";
import axios from "axios";
import Error from "../components/Error";
import Loader from "../components/Loader";

const { TabPane } = Tabs;
// const user = JSON.parse(localStorage.getItem("currentUser"));
const your_email = JSON.parse(localStorage.getItem("currentUser")) ? JSON.parse(localStorage.getItem("currentUser")).email : null;
const isAdmin = JSON.parse(localStorage.getItem("currentUser")) ? JSON.parse(localStorage.getItem("currentUser")).isAdmin : null;

function Adminscreen() {
    return (
        <>
            {isAdmin ? <>
                <div className="ml-3">
                    <h2 className="text-center m-2" style={{ fontSize: "35px" }}>Admin Panel</h2>
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="Bookings" key="1">
                            <div className="row">
                                <Bookings />
                            </div>
                        </TabPane>
                        <TabPane tab="Rooms" key="2">

                            <div className="row">
                                <Room />
                            </div>

                        </TabPane>
                        <TabPane tab="Add Room" key="3">


                            <Addroom />


                        </TabPane>
                    </Tabs>
                </div>
            </> : <>
                <h1>You are not Admin, please log in as a admin</h1>
            </>}
        </>
    );
}

export default Adminscreen;

export function Bookings() {
    const [bookings, setbookings] = useState([]);
    const [loading, setloading] = useState(false);
    const [error, seterror] = useState(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(async () => {
        try {
            setloading(true);
            const data = await (
                await axios.get("/api/bookings/getallbookings")
            ).data;
            var dataFiltered = data.filter(room1 => room1.roomownerid === your_email);
            setbookings(dataFiltered);
            setloading(false);
        } catch (error) {
            setloading(false);
            seterror(true);
        }
    }, []);
    return (
        <div className='col-md-11'>
            <h1>Bookings</h1>
            {loading ? (<Loader />) : error ? (<Error />) : (<div>

                <table className='table table-bordered table-dark'>
                    <thead className='bs'>
                        <tr>
                            <th>Booking Id</th>
                            <th>Userid</th>
                            <th>Room</th>
                            <th>From</th>
                            <th>To</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map(booking => {
                            return <tr>
                                <td>{booking._id}</td>
                                <td>{booking.userid}</td>
                                <td>{booking.room}</td>
                                <td>{booking.fromdate}</td>
                                <td>{booking.todate}</td>
                                <td>{booking.status}</td>
                            </tr>
                        })}
                    </tbody>
                </table>

            </div>)}
        </div>
    )
}


export function Room() {
    let bookings = [];
    const [rooms, setrooms] = useState([]);
    const [loading, setloading] = useState(false);
    const [error, seterror] = useState(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(async () => {
        try {
            setloading(true);
            const data = await (
                await axios.get("/api/rooms/getallrooms")
            ).data;
            const ddata = data.filter(room => room.your_email === your_email);
            bookings = ddata;
            setrooms(ddata);
            setloading(false);
        } catch (error) {
            setloading(false);
            seterror(true);
        }
    }, []);
    return (
        <div className='col-md-11'>
            <h1>Rooms</h1>
            {loading ? (<Loader />) : error ? (<Error />) : (<div>

                <table className='table table-bordered table-dark'>
                    <thead className='bs'>
                        <tr>
                            <th>Room Id</th>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Rent Per day</th>
                            <th>Max Count</th>
                            <th>Phone Number</th>
                            <th>Want to Remove?</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rooms.map(room => {
                            return <tr>
                                <td>{room._id}</td>
                                <td>{room.name}</td>
                                <td>{room.type}</td>
                                <td>{room.rentperday}</td>
                                <td>{room.maxcount}</td>
                                <td>{room.phonenumber}</td>
                                <button onClick={async (e) => {
                                    // console.log(room._id);
                                    await axios.post('/api/rooms/deleteroom', { roomid: room._id }).then((data) => {
                                        if (data.status === 200) {
                                            window.alert("Room Deleted");
                                        } else {
                                            window.alert("Something Unusual happened");
                                        }
                                    }).catch(err => {
                                        window.alert("Error happened, try again later!");
                                    });
                                }}>Remove</button>
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>)}
        </div>
    )
}



export function Users() {

    const [users, setusers] = useState()
    const [loading, setloading] = useState(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(async () => {

        try {
            const data = await (await axios.get('/api/users/getallusers')).data
            setusers(data)
            setloading(false)
        } catch (error) {
            console.log(error)
            setloading(false)
        }

    }, [])

    return (
        <div className='row'>
            {loading && (<Loader />)}

            <div className="col-md-10">
                <table className='table table-bordered table-dark'>
                    <thead className='bs'>
                        <tr>
                            <th>Id</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>isAdmin</th>
                        </tr>
                    </thead>

                    <tbody>



                        {users && (users.map(user => {
                            return <tr>
                                <td>{user._id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.isAdmin ? 'YES' : 'NO'}</td>
                            </tr>
                        }))}
                    </tbody>
                </table>
            </div>
        </div>
    )

}


export function Addroom() {
    const [room, setroom] = useState("");
    const [rentperday, setrentperday] = useState();
    const [maxcount, setmaxcount] = useState();
    const [description, setdescription] = useState("");
    const [phonenumber, setphonenumber] = useState("");
    const [type, settype] = useState("");
    //   const [your_email, setYourEmail] = useState("");
    const your_email = JSON.parse(localStorage.getItem('currentUser')).email;
    console.log(your_email);
    // console.log(localStorage.getItem('currentUser'));
    const [breakfast, setbreakfast] = React.useState(false);
    const [lunch, setlunch] = React.useState(false);
    const [dinner, setdinner] = React.useState(false);
    const hostelfunc1 = (event) => {
        setbreakfast(current => !current)
    }
    const hostelfunc2 = (event) => {
        setlunch(current => !current)
    }
    const hostelfunc3 = (event) => {
        setdinner(current => !current)
    }
    const [image1, setimage1] = useState("");
    const [image2, setimage2] = useState("");
    const [image3, setimage3] = useState("");
    const [Area, setArea] = useState("");
    async function addRoom() {
        const roomobj = {
            room,
            rentperday, maxcount, description, phonenumber, type, image1, image2, image3, your_email, breakfast, lunch, dinner, area: Area
        }
        try {
            const result = await axios.post('/api/rooms/addroom', roomobj);
            console.log(result);
            console.log(result.status)
            if (result.status === 200) {
                window.alert("Room added successfully");
            }
            setroom("");
            setmaxcount("");
            setdescription("");
            settype("");
            setimage1("");
            setimage2("");
            setimage3("");
            setphonenumber("");
            setArea("")
            setrentperday("");
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div className="row">

            <div className="col-md-5">
                <input
                    type="text"
                    className="form-control mt-1"
                    placeholder="name"
                    value={room}
                    onChange={(e) => {
                        setroom(e.target.value);
                    }}
                />

                <input
                    type="text"
                    className="form-control mt-1"
                    placeholder="rentperday"
                    value={rentperday}
                    onChange={(e) => {
                        setrentperday(e.target.value);
                    }}
                />

                <input
                    type="text"
                    className="form-control mt-1"
                    placeholder="maxcount"
                    value={maxcount}
                    onChange={(e) => {
                        setmaxcount(e.target.value);
                    }}
                />

                <input
                    type="text"
                    className="form-control mt-1"
                    placeholder="description"
                    value={description}
                    onChange={(e) => {
                        setdescription(e.target.value);
                    }}
                />

                <input
                    type="text"
                    className="form-control mt-1"
                    placeholder="phonenumber"
                    value={phonenumber}
                    onChange={(e) => {
                        setphonenumber(e.target.value);
                    }}
                />

            </div>

            <div className="col-md-6">
                <input
                    type="text"
                    className="form-control mt-1"
                    placeholder="type"
                    value={type}
                    onChange={(e) => {
                        settype(e.target.value);
                    }}
                />
                <input
                    type="text"
                    className="form-control mt-1"
                    placeholder="Image url 1"
                    value={image1}
                    onChange={(e) => {
                        setimage1(e.target.value);
                    }}
                />
                <input
                    type="text"
                    className="form-control mt-1"
                    placeholder="Image url 2"
                    value={image2}
                    onChange={(e) => {
                        setimage2(e.target.value);
                    }}
                />
                <input
                    type="text"
                    className="form-control mt-1"
                    placeholder="Image url 3"
                    value={image3}
                    onChange={(e) => {
                        setimage3(e.target.value);
                    }}
                />
                <input
                    type="text"
                    className="form-control mt-1"
                    placeholder="Address/Area of your PG"
                    value={Area}
                    onChange={(e) => {
                        setArea(e.target.value);
                    }}
                />
                <div>
                    <label htmlFor="subscribe">
                        <input
                            type="checkbox"
                            value={breakfast}
                            onChange={hostelfunc1}
                            id="subscribe"
                            name="subscribe"
                        />
                        Breakfast
                    </label>
                </div>
                <div>
                    <label htmlFor="subscribe">
                        <input
                            type="checkbox"
                            value={lunch}
                            onChange={hostelfunc2}
                            id="subscribe"
                            name="subscribe"
                        />
                        Lunch
                    </label>
                </div>
                <div>
                    <label htmlFor="subscribe">
                        <input
                            type="checkbox"
                            value={dinner}
                            onChange={hostelfunc3}
                            id="subscribe"
                            name="subscribe"
                        />
                        Dinner
                    </label>
                </div>
                <div className='mt-1 text-right'>
                    <button className="btn btn-primary" onClick={addRoom}>ADD ROOM</button>
                </div>
            </div>

        </div>
    );
}

