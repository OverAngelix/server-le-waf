
exports.connexion = (req, res) => {
  res.send(req.body.password == "123");
};
