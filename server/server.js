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
passport.use(new LocalStrategy(
  function (username, password, done) {
    dbInterface.db_getUser(username, password).then((user) => {
      if (!user)
        return done(null, false, { message: 'Incorrect username and/or password.' });

      return done(null, user);
    })
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  dbInterface.db_getuserById(id)
    .then(user => {
      done(null, user); // this will be available in req.user
    }).catch(err => {
      done(err, null);
    });
});

app.use(session({
  // by default, Passport uses a MemoryStore to keep track of the sessions
  secret: 'RhamieleimahR',
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());


const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  return res.status(401).json({ error: 'not authenticated' });
}

//// POST /api/sessions ////
app.post('/api/sessions', [check("username").isEmail()], function (req, res, next) {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
    if (!user) {
      // display wrong login messages
      return res.status(401).json(info);
    }
    // success, perform the login
    req.login(user, (err) => {
      if (err)
        return next(err);

      // req.user contains the authenticated user, we send all the user info back
      // this is coming from userDao.getUser()
      return res.json({ email: req.user.email, name: req.user.name });
    });
  })(req, res, next);
});

//// GET /api/sessions/current ////
app.get("/api/sessions/current", (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).send(req.user.name);
  } else res.status(401).send('');
});

//// DELETE /api/sessions/current ////
app.delete('/api/sessions/current', (req, res) => {
  req.logout();
  res.end();
});

///////////

/**** API ****/
// GET /api/surveys
app.get("/api/surveys", (req, res) => {
  dbInterface.db_getSurveys()
    .then((surveys) => res.status(200).json(surveys))
    .catch((err) => res.status(500).json({ errors: `Database error: ${err}` }))
})

//GET /api/survey/:id 
app.get("/api/survey/:id", [check("id").isInt({ min: 1 })], async (req, res) => {
  // setTimeout(async()=>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  try {
    let survey = await dbInterface.db_getSurvey(req.params.id)
    if (survey.error) res.status(404).json(survey);
    else res.status(200).json(survey);
  } catch (err) {
    res.status(500).json({ errors: `Database errors: ${err}.` })
  };
  // }, 3000);
})

app.get("/api/adminsurveys", isLoggedIn, (req, res) => {
  dbInterface.db_getAdminSurveys(req.user.id)
    .then((surveys) => {
      res.status(200).json(surveys);
    })
    .catch((err) =>
      res.status(500).json({ errors: `Database error: ${err}.` })
    );
})

app.get("api/adminsurveys/:id/answers", [isLoggedin, check("id").isInt({ min: 1 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    // dbInterface...
    //TODO!!
  })

//POST /api/submission
app.post("/api/submission",
  [check("survey").isInt({ min: 1 }).custom(val => dbInterface.isValidSurvey(val)),
  check("answers").exists().isArray().custom(async (val, { req }) => await dbInterface.areValidMinMax(val, req.body.survey)),
  check("answers[*]").exists().custom(async (val) => await dbInterface.areValidAnswers(val))],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    try {
      let id = await dbInterface.db_addSubmission(req.body)
      res.status(201).json({ addedSubmission: id })
    }
    catch (err) {
      res.status(503).json({ errors: `Database error during the submission: ${err}.` })
    }

  })

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});