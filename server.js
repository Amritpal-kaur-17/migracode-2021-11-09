const PORT = 4000;
const express = require("express");
const app = express();
const apiFunction = require("./api.js");
const api = apiFunction();

app.get("/hotels", api.getHotels);
app.get("/customers/:customerId/bookings", api.getBookingsByCustomerId);
app.use(express.json());
app.post("/hotels", api.saveHotel);
app.post("/customers", api.saveCustomer);

app.listen(PORT, () => console.log(`APP LISTENING ON PORT: ${PORT}`));
