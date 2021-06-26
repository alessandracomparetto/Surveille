const genericPost = (entity, path) => {
  return new Promise((resolve, reject) => {
    fetch(path, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(entity),
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
          if (err.response.headers.get("Content-Type") === "application/json") {
            err.response
              .json()
              .then((x) =>
                reject({ message: err.message, details: JSON.stringify(x) })
              );
          } else {
            err.response
              .text()
              .then((x) => reject({ message: err.message, details: x }));
          }
        } else {
          reject({ message: err.message });
        }
      });
  });
}

const sendSubmission = (submission) => {
  return genericPost(submission, "http://localhost:3000/api/submission/")
};

const sendSurvey = (survey) => {
  return genericPost(survey, "http://localhost:3000/api/survey/")
};


const loginUser = (email, password) => {
  return new Promise((resolve, reject) => {
    fetch("http://localhost:3000/api/sessions/", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        username: email,
        password: password,
      }),
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
          if (err.response.headers.get("Content-Type") === "application/json") {
            err.response
              .json()
              .then((x) =>
                reject({ message: err.message, details: JSON.stringify(x) })
              );
          } else {
            err.response
              .text()
              .then((x) => reject({ message: err.message, details: x }));
          }
        } else {
          reject({ message: err.message });
        }
      });
  });
}



export { sendSubmission, loginUser, sendSurvey };