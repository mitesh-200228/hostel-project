/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useEffect } from "react";
import { Modal, Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";

function Room({ room, fromdate, todate }) {

  const [show, setShow] = useState(false);
  const id = room._id;
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const wishlistFunction = async (e) => {
    const userid = JSON.parse(localStorage.getItem('currentUser'));
    try {
      const result = await axios.post('/api/users/wishlist', { id, userid });
      if (result.status === 200) {
        window.alert("Your room added to wishlist");
      }
    } catch (error) {
      window.alert("Some error occurred");
      console.log(error);
    }
  }
  return (
    <div className="row m-3 p-3 bs">
      <div className="col-md-4">
        <img src={room.imageurls[0]} className="img-fluid" />
      </div>
      <div className="col-md-8">
        <h1>{room.name}</h1>
        <p>Parking , Reception , Free Wifi</p>
        <p>
          <b>Price: {room.rentperday} INR / Day</b>
        </p>
        <p>
          <b>Max Count : {room.maxcount}</b>
        </p>
        <p>
          <b>Phonenumber : </b>
          {room.phonenumber}
        </p>
        <p>
          <b>Type : {room.type}</b>
        </p>
        <p>
          <b>Area : {room.area}</b>
        </p>
        <div style={{ float: "right" }}>

          {(fromdate && todate) && (<Link to={`/book/${room._id}/${fromdate}/${todate}`}>
            <button className="btn btn-dark m-2">Book Now</button>
          </Link>)}

          <button className="btn btn-danger m-2" onClick={handleShow}>
            View Details
          </button>

          <button className="btn btn-danger m-2" onClick={(e) => wishlistFunction(e)}>
            Add to Wishlist
          </button>
        </div>
      </div>

      <Modal show={show} onHide={handleClose} size="lg" data--aos='zoom-in'>
        <Modal.Header>
          <Modal.Title>{room.name}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Carousel nextLabel="" prevLabel="">
            {room.imageurls.map((url) => {
              return (
                <Carousel.Item>
                  <img
                    src={url}
                    className="img-fluid"
                    style={{ height: "400px" }}
                  />
                </Carousel.Item>
              );
            })}
          </Carousel>
          <p>{room.description}</p>
        </Modal.Body>

        <Modal.Footer>
          <button className="btn btn-primary" onClick={handleClose}>
            CLOSE
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Room;
