/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { Calendar } from "react-date-range";
import { DateRangePicker } from "react-date-range";
import moment from "moment";

import axios from "axios";
import Loader from "../components/Loader";
import Room from "../components/Room";
import { DatePicker, Space } from "antd";
import AOS from 'aos';
import 'aos/dist/aos.css';
AOS.init();
const { RangePicker } = DatePicker;
function Homescreen() {
  const [hotels, sethotels] = useState([]);
  const [duplicatehotes, setduplicatehotes] = useState([]);
  const [fromdate, setfromdate] = useState('');
  const [todate, settodate] = useState('')
  const [loading, setloading] = useState(false);
  const [searchkey, setsearchkey] = useState('')
  const [area, setArea] = useState('')
  const [type, settype] = useState('all')
  const [btype, bsettype] = useState('bldinner');
  const [value, setValue] = useState('ASC');
  function filterByDate(dates) {
    setfromdate(moment(dates[0]).format('DD-MM-YYYY'))
    settodate(moment(dates[1]).format('DD-MM-YYYY'))

    var temp = []
    for (var room of duplicatehotes) {
      var availability = false;

      for (var booking of room.currentbookings) {

        if (room.currentbookings.length) {
          if (
            !moment(moment(dates[0]).format('DD-MM-YYYY')).isBetween(booking.fromdate, booking.todate) &&
            !moment(moment(dates[1]).format('DD-MM-YYYY')).isBetween(booking.fromdate, booking.todate)
          ) {
            if (
              moment(dates[0]).format('DD-MM-YYYY') !== booking.fromdate &&
              moment(dates[0]).format('DD-MM-YYYY') !== booking.todate &&
              moment(dates[1]).format('DD-MM-YYYY') !== booking.fromdate &&
              moment(dates[1]).format('DD-MM-YYYY') !== booking.todate
            ) {
              availability = true;
            }
          }
        }


      }
      if (availability || room.currentbookings.length == 0) {
        temp.push(room)
      }
      sethotels(temp)
    }

  }

  useEffect(async () => {
    try {
      setloading(true);
      const rooms = await (await axios.get("/api/rooms/getallrooms")).data;
      console.log(rooms);
      sethotels(rooms);
      setduplicatehotes(rooms)
      setloading(false);
    } catch (error) {
      console.log(error);
      setloading(false);
    }
  }, []);

  function filterBySearch() {
    const dupdate = duplicatehotes.filter(room => room.name.toLowerCase().includes(searchkey))
    sethotels(dupdate)
  }

  function filterByType(e) {
    settype(e)
    console.log(e);
    console.log(duplicatehotes);
    if (e !== 'both') {
      const dupdate = duplicatehotes.filter(room => room.type.toLowerCase() === (e))
      sethotels(dupdate)
    }
    else {
      sethotels(duplicatehotes)
    }
  }

  function filterByFood(e) {
    bsettype(e);
    console.log(e);
    console.log(duplicatehotes);
    if (e !== 'bldinner') {
      const dupdate = duplicatehotes.filter(room => room.foods.toLowerCase() === (e))
      sethotels(dupdate)
    }
    else if (e !== 'bdinner') {
      const dupdate = duplicatehotes.filter(room => room.foods.toLowerCase() === (e))
      sethotels(dupdate)
    } else {
      const dupdate = duplicatehotes.filter(room => room.foods.toLowerCase() === (e))
      sethotels(dupdate)
    }
  }

  function filterByValue(e) {
    setValue(e)
    console.log(e);
    let x = duplicatehotes
    const dupdate = x.sort(room => room.rentperday)
    if (e === 'ASC') { 
      const decRoom = dupdate.reverse()
      sethotels(decRoom)
    }
    else if (e === 'DEC') {
      const decRoom = dupdate.reverse()
      sethotels(decRoom)
    }
  }

  function filterByArea() {
    const dupdate = duplicatehotes.filter(room => room.area.toLowerCase().includes(area))
    sethotels(dupdate)
  }

  return (
    <div className="mt-5">
      <div className="container">
        <div className="row bs p-3 m-5">
          <div className="col-md-4">
            <RangePicker style={{ height: "38px" }} onChange={filterByDate} format='DD-MM-YYYY' className='m-2' />
          </div>

          <div className="col-md-4">
            <input
              type="text"
              className="form-control i2 m-2"
              placeholder='Search Rooms'
              value={searchkey}
              onKeyUp={filterBySearch}
              onChange={(e) => { setsearchkey(e.target.value) }}
            />
          </div>
          <div className="col-md-4">
            <input
              type="text"
              className="form-control i2 m-2"
              placeholder='Search By Area'
              value={area}
              onKeyUp={filterByArea}
              onChange={(e) => { setArea(e.target.value) }}
            />
          </div>
          <div className="col-md-4">
            <select className="form-control m-2" value={type} onChange={(e) => { filterByType(e.target.value) }} >

              <option value="both">both</option>
              <option value="male">male</option>
              <option value="female">female</option>

            </select>
          </div>
          <div className="col-md-4">
            <select className="form-control m-2" value={btype} onChange={(e) => { filterByFood(e.target.value) }} >
              <option value="bldinner">Breakfast,Lunch,Dinner</option>
              <option value="bdinner">Breakfast,Dinner</option>
              <option value="dinner">Dinner</option>
            </select>
          </div>
          <div className="col-md-4">
            <select className="form-control m-2" value={value} onChange={(e) => { filterByValue(e.target.value) }} >
              <option value="ASC">Ascending</option>
              <option value="DEC">Decending</option>
            </select>
          </div>
        </div>
      </div>

      <div className="row justify-content-center">
        {loading ? (
          <Loader />
        ) : (
          hotels.map((room) => {
            return (
              <div className="col-md-8" data-aos='zoom-in'>
                <Room room={room} fromdate={fromdate} todate={todate} />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Homescreen;
