const express = require("express");

const router = express.Router();

const Checklist = require("../models/checklist");

router.get("/", async (req, res) => {
  try {
    let checklists = await Checklist.find({}).populate("tasks");
    res.status(200).render("checklists/index", { checklists: checklists });
  } catch (error) {
    res.status(400).render("pages/error", { error: "Erro ao exibir as listas" });
  }
});

router.post("/", async (req, res) => {
  let { name } = req.body.checklist;

  try {
    await Checklist.create({ name });
    res.redirect("/checklists");
  } catch (error) {
    res.status(422).render("checklists/new", { checklist: { ...checklist, error } });
  }
});

router.get("/new", async (req, res) => {
  try {
    let checklist = new Checklist();
    res.status(200).render("checklists/new", { checklist: checklist });
  } catch (error) {
    res.status(500).render("pages/error", { error: "Erro ao carregar o Formulário" });
  }
});

router.get("/:id/edit", async (req, res) => {
  try {
    let checklist = await Checklist.findById(req.params.id);
    res.status(200).render("checklists/edit", { checklist: checklist });
  } catch (error) {
    res.status(500).render("pages/error", { error: "Erro ao exibir a edição de lista de taregas" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    let checklist = await Checklist.findById(req.params.id).populate("tasks");
    console.log(checklist);
    res.status(200).render("checklists/show", { checklist: checklist });
  } catch (error) {
    res.status(400).render("pages/error", { error: "Erro ao exibir a Tarefa" });
  }
});

router.put("/:id", async (req, res) => {
  let { name } = req.body.checklist;
  let checklist = await Checklist.findById(req.params.id);

  try {
    await checklist.updateOne({ name });
    res.redirect("/checklists");
  } catch (error) {
    let errors = error.errors;
    res.status(422).render("checklists/edit", { checklist: { ...checklist, errors } });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    let checklist = await Checklist.findByIdAndRemove(req.params.id);
    res.redirect("/checklists");
  } catch (error) {
    res.status(500).render("pages/error", { error: "Erro ao deletar a Tarefa" });
  }
});

module.exports = router;
