const db = require("../models");
const Reservation = db.reservations;
const Op = db.Sequelize.Op;
const nodemailer = require("nodemailer");
async function sendMail(data) {

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.live.com",
    port: 587,
    auth: {
      user: "OverAngelixDevelop@outlook.fr", // generated ethereal user
      pass: "DeathNote123", // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = transporter.sendMail({
    from: 'OverAngelixDevelop@outlook.fr', // sender address
    to: data.email, // list of receivers
    subject: "Confirmation reservation", // Subject line
    text: "La reservation au nom de " +
      data.nom +
      " le " +
      data.dateReservation +
      " à " +
      data.heureReservation +
      " a été validé avec succès !", // plain text body
    //  html: "<b>Hello world?</b>", // html body
  });
}


// Create and Save a new Tutorial
exports.create = (req, res) => {
  // Validate request
  if (!req.body.nom && !req.body.prenom) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }
  // Create a Reservation
  const reservation = {
    nom: req.body.nom,
    prenom: req.body.prenom,
    email: req.body.email,
    informationComplementaires: req.body.informationComplementaires,
    nbPersonne: req.body.nbPersonne,
    dateReservation: req.body.dateReservation,
    heureReservation: req.body.heureReservation,
    idTable: req.body.idTable,
  };


  // Save Tutorial in the database
  Reservation.create(reservation)
    .then(data => {
      res.send(data);
      sendMail(reservation).catch(console.error);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the reservation."
      });
    });
};

//https://sequelize.org/master/manual/model-querying-basics.html
//http://sequelize.org/master/manual/model-basics.html#data-types
//http://localhost:3001/api/reservations?heureReservation=16%3A30%3A00&dateReservation=2021-09-14%0102:00:00.000%00
//http://localhost:3001/api/reservations
// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
  const heureReservation = req.query.heureReservation;
  const dateReservation = req.query.dateReservation;
  console.log(heureReservation + "   " + dateReservation)
  var condition = heureReservation ? { heureReservation: { [Op.eq]: `%${heureReservation}%` } } : null;
  var condition2 = dateReservation ? { dateReservation: { [Op.eq]: `%${dateReservation}%` } } : null;


  Reservation.findAll({ where: { ...condition, ...condition2 } })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
};


// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {

};