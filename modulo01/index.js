const express = require("express");

const server = express();

server.use(express.json()); //faz com que o express leia Json

//Query params = ?teste=1
//Route params = /user/1
//Request body = {"name": "Reinaldo", "email": "reinaldo@gmail.com" }

//CRUD - create - Read - Update - Delete

const users = ["Reinaldo", "Diego", "Claudio"];

//middlewares são interceptadores que param o fluxo até que algo seja feito
//para seguir basta usar o parametro next

server.use((req, res, next) => {
  console.log(`O metodo: ${req.method}; URL: ${req.url}`);

  return next();
});

function checkUserExist(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: "User name is required" });
  }
  return next();
}

function checkUserInArray(req, res, next) {
  const user = users[req.params.index];
  if (!user) {
    return res.status(400).json({ error: "User does not exist" });
  }

  req.user = user;
  //assim todas as chamadas que utilizarem esse middleware poderão usar essa variavel; 
  return next();
}

server.get("/users", (req, res) => {
  return res.json(users);
});

server.post("/users", checkUserExist, (req, res) => {
  const { name } = req.body;

  users.push(name);

  return res.json(users);
});

server.get("/users/:index", checkUserInArray, (req, res) => {
  //const nome = req.query.nome; -- Query params
  //const { id } = req.params; // desestruturação para pegar um valor especifico ou varios
  //const { index } = req.params;
  return res.json(req.user);
});

server.put("/users/:index", checkUserExist, checkUserInArray, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;

  users[index] = name;

  return res.json(users);
});

server.delete("/users/:index", checkUserInArray, (req, res) => {
  const { index } = req.params;

  users.splice(index, 1);

  return res.send();
});

server.listen(3000); //porta em que o servidor vai ser chamado
