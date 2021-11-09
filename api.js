const { Pool } = require("pg");
const secrets = require("./secrets.json");
const pool = new Pool(secrets);
const dbHotels = require("./dbHotels.js");

const api = () => {
  const db = dbHotels();
  const getHotels = async (request, response) => {
    const hotels = await db.get();
    response.json(hotels);
  };
  const saveHotel = async (request, response) => {
    const newHotel = request.body;
    if (!Number.isInteger(newHotel.rooms) || newHotel.rooms <= 0) {
      return response
        .status(400)
        .send("number of rooms should be a positive integer.");
    }
    const result = await pool.query(
      "insert into hotels (name, rooms, postcode) values ($1, $2, $3) returning id",
      [newHotel.name, newHotel.rooms, newHotel.postcode]
    );
    const responseBody = { hotelId: result.rows[0].id };
    return response.status(201).json(responseBody);
  };
  const saveCustomer = async (request, response) => {
    const newCustomer = request.body;
    const result = await pool.query(
      "insert into customers (name, email, address, city, postcode, country) values ($1, $2, $3, $4, $5, $6) returning id",
      [
        newCustomer.name,
        newCustomer.email,
        newCustomer.city,
        newCustomer.postcode,
        newCustomer.country,
      ]
    );
    const responseBody = { customerId: result.rows[0].id };
    return response.status(201).json(responseBody);
  };
  const getBookingsByCustomerId = async (request, response) => {
    const customerId = request.params.customerId;
    if (!Number.isInteger(customerId)) {
      return response.status(400).json({ message: "send me an integer!!" });
    }
    const result = await pool.query(
      `select c.name as customerName, c.email as customerEmail, h.name as hotelName, b.checkin_date as checkingDate, b.nights 
       from customers c
       inner join bookings b on b.customer_id=c.id
       inner join hotels h on h.id=b.hotel_id
       where c.id=$1;`,
      [customerId]
    );
    return response.status(200).json(result.rows);
  };

  return {
    getHotels,
    saveHotel,
    saveCustomer,
    getBookingsByCustomerId,
  };
};

module.exports = api;
