import "bootstrap/dist/css/bootstrap.css";
import "./App.css";
import LoginForm from "./Components/LoginForm"
import MyNav from "./Components/MyNav"
import Homepage from "./Components/Homepage"
import { useEffect, useState } from "react";
import {BrowserRouter as Router, Redirect, Route,Switch,} from "react-router-dom";

function App() {
  const [userName, setUserName] = useState("");

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
            render={() => (
            <>
            <MyNav userName={userName} setUserName={setUserName}/>
            <Homepage userName={userName}/>
            </>
            )}
          />
      </Switch>
      </Router> 
    </>
  );
}

export default App;
