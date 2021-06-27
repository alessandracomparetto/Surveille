const genericGet = (path) => {
  return new Promise((resolve, reject) => {
    fetch(path, {
      method: "GET"
    })
      .then((res) => {
        if (!res.ok) {
          const error = new Error(`${res.status}: ${res.statusText}`);
          error.response = res;
          throw error;
        }
        resolve(res.json());
      })
      .catch((err) => {
        if (err.response && err.response.headers) {
          if (err.response.headers.get("Content-Type") === "application/json") { //this is an error coming from the database
            err.response
              .json()
              .then((x) =>
                reject({ message: err.message, details: JSON.stringify(x) })
              );
          } else {
            err.response //this is an error that caused the fetch to fail
              .text()
              .then((x) => reject({ message: err.message, details: x }));
          }
        } else {  //every other kind of errors
          reject({ message: err.message });
        }
      })
  })
}

const getSurveys = () => {
  return genericGet(`http://localhost:3000/api/surveys`)
}

const getSurvey = (id) => {
  return genericGet(`http://localhost:3000/api/survey/${id}`)
}

const getAdminSurveys = () => {
  return genericGet(`http://localhost:3000/api/adminsurveys`)
}

const getAdminSurveyAnswers = (id) => {
  return genericGet(`http://localhost:3000/api/adminsurveys/${id}/answers`)
}
export { getSurveys, getSurvey, getAdminSurveys, getAdminSurveyAnswers }