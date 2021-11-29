
exports.connexion = (req, res) => {
  res.send(req.body.password == process.env.pass);
};
