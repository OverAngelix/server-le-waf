const db = require("../models");
const Reservation = db.reservations;
const Op = db.Sequelize.Op;
const nodemailer = require("nodemailer");

var rand = function () {
  return Math.random().toString(36).substr(2); // remove `0.`
};

var token = function () {
  return rand() + rand(); // to make it longer
};

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
      " a été validé avec succès !\n\n"+
      "Si vous desirez annuler votre reservation cliquer ici :"+
     //  "http://localhost:8080/annulation/"+
       "https://le-waf-fr.herokuapp.com/annulation/"+
       data.token, // plain text body

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
    valide: false,
    token: token(),
  };


  // Save Tutorial in the database
  Reservation.create(reservation)
    .then(data => {
      res.send(data);
      if (reservation.email != "") {
        sendMail(reservation).catch(console.error);
      }
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


exports.findById = (req, res) => {
  const id = req.params.id;

  Reservation.findByPk(id)
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

exports.update = (req, res) => {
  const id = req.params.id;

  Reservation.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Reservation was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Reservation with id=${id}. Maybe Reservation was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Reservation with id=" + id
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Reservation.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Reservation was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Reservation with id=${id}. Maybe Reservation was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Reservation with id=" + id
      });
    });
};

exports.deleteToken = (req, res) => {
  const token = req.params.token;

  Reservation.destroy({
    where: { token: token }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Reservation was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Reservation with token=${token}. Maybe Reservation was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Reservation with token=" + token
      });
    });
};
