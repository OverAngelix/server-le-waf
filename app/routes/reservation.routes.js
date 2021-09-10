module.exports = app => {
  const reservations = require("../controllers/reservation.controller.js");

  var router = require("express").Router();

  // Create a new Reservation
  router.post("/", reservations.create);

  // Retrieve all Reservations
  router.get("/", reservations.findAll);

  // Retrieve Reservation by id
  router.get("/:id", reservations.findById);

  // Update a Tutorial with id
  router.put("/:id", reservations.update);
  // Delete a Reservation with id
  
  router.delete("/:id", reservations.delete);

  router.delete("/deleteToken/:token", reservations.deleteToken);

  app.use('/api/reservations', router);
};