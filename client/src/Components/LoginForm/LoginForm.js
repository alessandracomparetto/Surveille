import "./LoginForm.css";
import icon from "./icon.png";
import { Button, Form } from "react-bootstrap";
import { useState } from "react";
// import { loginUser } from '../../Api/PostApi.js'
// import ErrorAlert from '../ErrorAlert'

const LoginForm = (props) => {
  const [validated, setValidated] = useState(false);
  const [mail, setmail] = useState('');
  const [password, setpassword] = useState('');
  const [errorDetected, setErrorDetected] = useState(false);

  //TODO: handle submit
  const handleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    //   if (form.checkValidity() === true) {
    //     loginUser(mail, password)
    //       .then((user) => {
    //         props.setUserName(user.name);
    //         setErrorDetected(false);
    //       }).catch((err) => {
    //         setErrorDetected(err);
    //       });
    //   }
    setValidated(true);
  };

  return (
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
          <Form.Control.Feedback type="invalid">Insert your account mail address and the password</Form.Control.Feedback>
        </Form.Group>

        { // REVIEW - add this when you add the component for errors
          /* {errorDetected ? <ErrorAlert errors={errorDetected} /> : null} */}

        <Button size="lg" variant="purple" block={true} type="submit">
          Sign in
        </Button>
        <p className="mt-5 mb-3 text-muted">&copy; Alessandra Comparetto 2021</p>
      </Form>
    </div>
  );
};

export default LoginForm;
