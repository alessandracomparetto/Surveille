import { Navbar, Dropdown, Button, } from "react-bootstrap";
import { Link } from "react-router-dom";
import * as Icons from "react-bootstrap-icons";
import { logoutUser } from "../../API/DeleteApi";
import { Redirect } from "react-router-dom";
import { useState } from "react";

import "./MyNav.css";

export default function MyNav(props) {

    const [redirectState, setRedirectState] = useState("");

    const handleLogout= ()=>{
        logoutUser()
        .then(() => {
            props.setUserName("");
            setRedirectState("/")
        })
        .catch((err) =>console.log(err))
    }
    
    return (
        <>
         {redirectState && <Redirect to="/" />}
            <Navbar className="pr-2" variant="dark" fixed="top" expand="sm">
                <Navbar.Brand href="/">
                    <Icons.Award size="1.2em" className="mr-2" />
                    Surveille
                </Navbar.Brand>

                <div className="mr-2 ml-auto" style={{ color: "#ffffff" }}>
                    {props.userName ? (
                        <Dropdown >
                            <Dropdown.Toggle variant="light" id="dropdown-basic" >
                                Welcome <b>{props.userName}</b>{" "}
                                <Icons.PersonCircle className="text-dark mr-2" size="1.45em" />
                                <Dropdown.Menu>
                                    <Dropdown.Item
                                        onClick={handleLogout}
                                    >
                                    Logout
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown.Toggle>
                        </Dropdown>

                ) : (
                <Link style={{ textDecoration: "none" }} to="/login">
                    <Button variant="outline-light">Login Admin</Button>
                </Link>
                    )}
                </div>
        </Navbar>
        </>
    );
}
