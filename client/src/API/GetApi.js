const getSurveys = () => {
  return new Promise((resolve, reject) => {
    fetch("http://localhost:3000/api/surveys", {
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

const getSurvey = (id) => {
  return new Promise((resolve, reject) => {
    fetch(`http://localhost:3000/api/survey/${id}`, {
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

const getAdminSurveys = () =>{
  return new Promise((resolve, reject) => {
    fetch(`http://localhost:3000/api/adminsurveys`, {
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
export { getSurveys, getSurvey, getAdminSurveys}