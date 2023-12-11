const express = require("express");
const cors = require("cors");
const app = express();
const { format } = require("date-fns");

app.use(cors());
app.use(express.json());

const rooms = [{
    "seats": 50,
    "amenities": "Wi-Fi, Projector",
    "price": 1000
  }
  ];
const bookings = [{
    "message": "Room added successfully",
    "room": {
      "roomName": "Room 01",
      "roomId": "01",
      "seats": 50,
      "amenities": "Wi-Fi, Projector",
      "price": 1000
    }
  }
  ];


//API Endpoint for App Home
app.get("/", (req, res) => {
    res.send("<h1>hallo world</h1>");
  });

// API for get
  app.get("/rooms", (req, res) => {
    res.json(rooms);
  });
// Creating a Room
app.post("/rooms", (req, res) => {
  const { seats, amenities, price } = req.body;

  const room = {
    roomName: `Room ${rooms.length + 1}`,
    roomId: (rooms.length + 1).toString().padStart(2, "0"),
    seats,
    amenities,
    price,
  };

  rooms.push(room);
  res.status(201).json({ message: "Room added successfully", room });
});

// Booking a Room
app.post("/bookings", (req, res) => {
  const { customerName, date, start, end, roomId } = req.body;

  const room = rooms.find((r) => r.roomId === roomId);
  if (!room) {
    return res.status(404).json({ message: "Room not found" });
  }

  const booking = {
    bookingId: bookings.length + 1,
    customerName,
    date,
    start,
    end,
    roomId,
    status: "confirmed", // Assuming all bookings 
  };

  bookings.push(booking);
  res.status(201).json({ message: "Booking added successfully", booking });
});

// List for all Rooms with Booked Data
app.get("/bookedRooms", (req, res) => {
  const bookedRoomDetails = bookings.map((book) => {
    const room = rooms.find((r) => r.roomId === book.roomId);
    return {
      "Room Name": room.roomName,
      "Booked Status": book.status,
      "Customer Name": book.customerName,
      Date: book.date,
      "Start Time": book.start,
      "End Time": book.end,
    };
  });

  res.json(bookedRoomDetails);
});

// List for all Customers with Booked Data
app.get("/customers", (req, res) => {
  const customerData = bookings.map((book) => {
    const room = rooms.find((r) => r.roomId === book.roomId);
    return {
      "Customer Name": book.customerName,
      "Room Name": room.roomName,
      Date: book.date,
      "Start Time": book.start,
      "End Time": book.end,
    };
  });

  res.json(customerData);
});

// List for how many times a customer has booked the room
app.get("/customers/:name", (req, res) => {
  const customerName = req.params.name;
  const customerBookings = bookings.filter(
    (book) => book.customerName === customerName
  );

  const customerBookingDetails = customerBookings.map((book) => {
    const room = rooms.find((r) => r.roomId === book.roomId);
    return {
      "Customer Name": book.customerName,
      "Room Name": room.roomName,
      Date: book.date,
      "Start Time": book.start,
      "End Time": book.end,
      "Booking id": book.bookingId,
      "Booking date": book.date,
      "Booking Status": book.status,
    };
  });

  if (customerBookingDetails.length) {
    res.json(customerBookingDetails);
  } else {
    res.status(404).json({
      message: "Customer details not found or customer has not booked any rooms",
    });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
