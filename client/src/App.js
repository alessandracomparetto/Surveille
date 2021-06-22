import "bootstrap/dist/css/bootstrap.css";
import "./App.css";
import LoginForm from "./Components/LoginForm"
import MyNav from "./Components/MyNav"
import Homepage from "./Components/Homepage"
import SurveyForm from "./Components/SurveyForm";
import SurveyCreationForm from "./Components/SurveyCreationForm";
import { useState } from "react";
import { BrowserRouter as Router, Route, Switch, } from "react-router-dom";

function App() {
  const [userName, setUserName] = useState("");

  return (
    <>
      <Router>
        <Switch>
          <Route exact path="/login" render={() => <LoginForm setUserName={setUserName} />} />
          <Route render={() => <MyNav userName={userName} setUserName={setUserName} />} />
        </Switch>
        <Route exact path="/" render={() => (<Homepage userName={userName} />)} />
        <Route exact path="/survey" render={()=> (<SurveyCreationForm/>)}/>
        <Route path="/survey/:id" render={() => (<SurveyForm userName={userName} />)} />
      </Router>
    </>
  );
}

export default App;
