module.exports = {
    HOST: "ec2-54-73-152-36.eu-west-1.compute.amazonaws.com",
    USER: process.env.USER,
    PASSWORD: process.env.PASSWORD,
    DB: process.env.DB,
    dialect: "postgres",
    native: true,
    ssl: true,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };