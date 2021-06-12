import "bootstrap/dist/css/bootstrap.css";
import "./App.css";
import LoginForm from "./Components/LoginForm"
import MyNav from "./Components/MyNav"
import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";

function App() {
  const [userName, setUserName] = useState("Rhami");

  //TODO use effect per login
  
  return (
    <>
     <Router>
      <Switch>
          <Route
            path="/login"
            render={() => <LoginForm setUserName={setUserName} />}
          />
          <Route
            path="/home"
            render={() => <MyNav userName={userName} setUserName={setUserName}/>}
          />
      </Switch>
      </Router> 
    </>
  );
}

export default App;
