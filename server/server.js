'use strict';

const express = require('express');
const morgan = require("morgan"); // logging middleware
const { check, validationResult } = require("express-validator"); // validation middleware
const dbInterface = require("./dbInterface"); // module for accessing the DB
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

// init express
const app = new express();
const port = 3001;

// set-up the middlewares
app.use(morgan("dev"));
app.use(express.json());

/**** AUTH ****/
//TODO - copy from server.js

/**** API ****/
// GET /api/surveys
app.get("/api/surveys", (req, res) => {
  dbInterface.db_getSurveys()
    .then((surveys) => res.status(200).json(surveys))
    .catch((err) => res.status(500).json({ errors: `Database error: ${err}` }))
})

//GET /api/survey/:id 
// REVIEW - errors!
app.get("/api/survey/:id", [check("id").isInt({ min: 1 })], async(req, res) => {
  // setTimeout(async()=>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  try {
    let survey = await dbInterface.db_getSurvey(req.params.id)
    if (survey.error) res.status(404).json(survey);
    else res.status(200).json(survey);
  }  catch (err) {
    res.status(500).json({
      errors: `Database errors: ${err}.`,
    })
  };
// }, 3000);
})

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});