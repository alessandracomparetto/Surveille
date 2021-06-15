# Exam #1: "Questionario"
## Student: s290207 Comparetto Alessandra

## React Client Application Routes

- Route `/home`: in this page the generic user can see every survey that he can answer to.
- Route `/survey/:id`: in this page the generic user can fill in the survey. The param is the id of the survey
- Route `/login` : in this page the admin user can log in
- ...

----

## API Server

- POST `/api/login`
  - request parameters and request body content
  - response body content
- GET `/api/surveys`
  - request parameters: none
  - response body content: an object containing superficial data of every survey
  ```json
  [
  {
    "id": 1,
    "author": "Leorio",
    "title": "Sport interests",
    "num": 5
  },
  {
    "id": 2,
    "author": "Kurapika",
    "title": "Pets and Animals",
    "num": 4
  }
  ]
   ```
- POST `/api/something`
  - request parameters and request body content
  - response body content
- ...

----


## Database Tables

- Table `users` - contains xx yy zz
- Table `something` - contains ww qq ss
- ...

## Main React Components

- `LoginForm` (in `Components/LoginForm/LoginForm.js`): needed to log in
- `Homepage` (in `Homepage.js`): this is the page from which the user can answer to the surveys or the admin user can look at the aswers of their surveys
- `SurveysPreview` (in `SurveysPreview.js`): contains the list of the surveys. Shows for each survey the superficial information
- ...

(only _main_ components, minor ones may be skipped)

## Screenshot

![Screenshot](./img/screenshot.jpg)

## Users Credentials

- username, password (plus any other requested info)
- username, password (plus any other requested info)
