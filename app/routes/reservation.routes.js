module.exports = app => {
  const reservations = require("../controllers/reservation.controller.js");
  const login = require("../controllers/login.controller.js");

  var router = require("express").Router();

  // Create a new Reservation
  router.post("/", reservations.create);

  // Retrieve all Reservations
  router.get("/", reservations.findAll);

  // Complet or not ? 
  router.get("/complet/jour", reservations.complet);

  router.get("/confirmation/email", reservations.findReservationEmailPerDate);

  // Retrieve Reservation by id
  // router.get("/:id", reservations.findById);

  // Retrieve Reservation by date
  router.get("/reservationDuJour/jour", reservations.findReservationDuJour);

  // Update a Tutorial with id
  router.put("/:id", reservations.update);

  // Delete a Reservation with id
  router.delete("/:id", reservations.delete);

  router.delete("/deleteToken/:token", reservations.deleteToken);

  router.post("/connexion/password", login.connexion);

  app.use('/api/reservations', router);
};