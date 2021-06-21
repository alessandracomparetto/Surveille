import "./LoginForm.css";
import icon from "./icon.png";
import { Button, Form } from "react-bootstrap";
import { Redirect } from "react-router-dom";

import { useState } from "react";
import { loginUser } from "../../API/PostApi";

import ErrorAlert from "../ErrorAlert";

const LoginForm = (props) => {
  const [validated, setValidated] = useState(false);
  const [mail, setmail] = useState("kurapika@studenti.polito.it");
  const [password, setpassword] = useState("Qwerty123");
  const [errorDetected, setErrorDetected] = useState(false);
  const [redirectState, setRedirectState] = useState("");

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity() === true) {
      loginUser(mail, password).then((user) => {
        props.setUserName(user.name);
        setErrorDetected(false);
        setRedirectState("/");
      }).catch((err) => {
        setErrorDetected(err);
      });
    }
    setValidated(true);
  };

  return (
    <>
      {redirectState && <Redirect to="/" />}
      <div className="text-center main">
        <Form
          noValidate
          className="form-signin"
          validated={validated}
          onSubmit={handleSubmit}
        >
          <img className="mb-4" src={icon} alt="" width="72" height="72" />
          <h1 className="h3 mb-3 font-weight-normal ">Login</h1>

          <Form.Group>
            <Form.Control
              onChange={(x) => setmail(x.target.value)}
              value={mail}
              required
              type="email"
              placeholder="Email address"
              id="email"
            />
            <Form.Control
              onChange={(x) => setpassword(x.target.value)}
              value={password}
              required
              type="password"
              placeholder="Password"
              id="password"
            />
            <Form.Control.Feedback type="invalid">
              Insert your account mail address and the password
            </Form.Control.Feedback>
          </Form.Group>

          {errorDetected ? <ErrorAlert errors={errorDetected} /> : null}

          <Button size="lg" variant="purple" block={true} type="submit">
            Sign in
          </Button>
          <p className="mt-5 mb-3 text-muted">
            &copy; Alessandra Comparetto 2021
          </p>
        </Form>
      </div>
    </>
  );
};

export default LoginForm;
