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
    host: "ssl0.ovh.net",
    port: 465,
    secure: true,
    auth: {
      user: process.env.mail, // generated ethereal user
      pass: process.env.pass, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = transporter.sendMail({
    from: 'reservation@lewaf.fr', // sender address
    to: data.email, // list of receivers
    subject: "Confirmation de votre reservation WAF", // Subject line
    html: `
    <p>Bonjour ${data.prenom}</p>
<p>Votre reservation le ${data.dateReservation} &agrave; ${data.heureReservation} pour ${data.nbPersonne} personne(s) est not&eacute;e.</p>
<p><br />Si vous desirez annuler votre reservation cliquer <a href="http://localhost:8080/annulation/${data.token}" target="_blank" >ici</a></p>
<p>--</p>
<p>Important : Le Buffet de boissons de 7&euro; est toujours factur&eacute; m&ecirc;me en cas de non consommation et ce sont des cr&eacute;neaux d'1H15 par table, merci de votre compr&eacute;hension !</p>
<p>Marine et Justin,<br />Les g&eacute;rants<br /><br /><img src="https://lewaf.files.wordpress.com/2016/06/cropped-cropped-logo-petit-trans2-1-1.png" alt="" width="229" height="104" /></p>
<p>57 rue de la Barre, 59800 Lille<br />09 83 74 60 21<br /><a href="https://lewaf.fr" target="_blank" >https://lewaf.fr</a><br /><a href="https://www.facebook.com/lewaf" target="_blank">https://www.facebook.com/lewaf</a><br /><br />&agrave; bient&ocirc;t !<br />WAF</p>
    `
  });

}

async function sendMailReservation(data) {

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "ssl0.ovh.net",
    port: 465,
    secure: true,
    auth: {
      user: "reservation@lewaf.fr", // generated ethereal user
      pass: "X5G9f19mph", // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = transporter.sendMail({
    from: 'reservation@lewaf.fr', // sender address
    to: 'reservation@lewaf.fr', // list of receivers
    subject: "Nouvelle reservation", // Subject line
    text: "" +
      data.nom +
      " " +
      data.prenom +
      " a reservé le " +
      data.dateReservation +
      " à " +
      data.heureReservation +
      " pour " +
      data.nbPersonne
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
        sendMailReservation(reservation).catch(console.error);
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

exports.findReservationDuJour = (req, res) => {
  const dateReservation = req.query.date;
  var condition = dateReservation ? { dateReservation: { [Op.eq]: `%${dateReservation}%` } } : null;

  Reservation.findAll({
    where: condition,
    order: [
      ['idTable', 'DESC'],
    ],
  })
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
