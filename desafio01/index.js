const express = require("express");

const server = express();

server.use(express.json());

const projects = [];
let count = 0;

server.use((req, res, next)=>{
  count++;
  console.log(`Número de contagens das requisições: ${count}`);

  return next()
})

function userExist(req, res, next){
  const {id} = req.params;
  const project = projects[id];
  if(!project){
    return res.status(400).send({error: "Usuário não existe"})
  }
  return next();
}

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.get("/projects/:id", userExist, (req, res) => {
  const {id} = req.params;

  return res.json(projects[id]);
});


server.post("/projects", (req, res) => {
  const { id, title, tasks } = req.body;

  const project = { id, title, tasks };

  projects.push(project);

  return res.json(projects);
});

server.post("/projects/:id/tasks", userExist, (req, res) => {
  const { id } = req.params;
  const { task, duracao } = req.body;

  const tarefa = { task, duracao };

  projects[id].tasks.push(tarefa);

  return res.json(projects[id]);
});

server.put("/projects/:id", userExist, (req, res) => {
  const { title } = req.body;
  const {id} = req.params;

  projects[id].title = title;

  return res.json(projects[id]);
});

server.delete("/projects/:id", userExist, (req, res) => {
  const {id} = req.params;

  projects.splice(id, 1);

  return res.json(projects);
});

server.listen(3000);
