module.exports = {
    HOST: "ec2-54-73-152-36.eu-west-1.compute.amazonaws.com",
    USER: "rcqxqjepvjvnma",
    PASSWORD: "db9ed626d113cf9de7f5f3323aafd9cb75668b302fa2bfdcca3b5950a18ad309",
    DB: "d3rng9a1j2ck1q",
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