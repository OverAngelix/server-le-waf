module.exports = app => {
    const reservations = require("../controllers/reservation.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Tutorial
    router.post("/", reservations.create);
  
    // Retrieve all Tutorials
    router.get("/", reservations.findAll);

    // Delete a Tutorial with id
    router.delete("/:id", reservations.delete);
  
    app.use('/api/reservations', router);
  };