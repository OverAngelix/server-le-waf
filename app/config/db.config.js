module.exports = {
  HOST:"ec2-54-73-152-36.eu-west-1.compute.amazonaws.com",
  USER:"ewhqaiwlylrjsi",
  PASSWORD:"9904bfb3f0665bcd4ad4d02ccf4e1a37f692748d7c1e85874ad20000093e89f8",
  DB:"d3rng9a1j2ck1q",
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