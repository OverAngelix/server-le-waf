module.exports = (sequelize, Sequelize) => {
    const Reservation = sequelize.define("reservations", {
      nom: {
        type: Sequelize.STRING(100) 
      },
      prenom: {
        type: Sequelize.STRING(100)
      },
      email: {
        type: Sequelize.STRING
      },
      informationComplementaires: {
        type: Sequelize.STRING
      },
      nbPersonne: {
        type: Sequelize.INTEGER
      },
      dateReservation: {
        type: Sequelize.DATE
      },
      heureReservation: {
        type: Sequelize.TIME
      },
      idTable: {
        type: Sequelize.INTEGER
      },
      valide: {
        type: Sequelize.BOOLEAN
      },
      token: {
        type: Sequelize.STRING
      },
    });
  
    return Reservation;
  };