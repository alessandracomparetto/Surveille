import { Navbar, Dropdown, Button, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import * as Icons from "react-bootstrap-icons";
import { logoutUser } from "../../API/DeleteApi";
import { Redirect } from "react-router-dom";
import { useState } from "react";

import "./MyNav.css";

export default function MyNav(props) {

    const [redirectState, setRedirectState] = useState("");
    const [logoutError, setLogoutError] = useState(false);

    const handleLogout = () => {
        setLogoutError(false)
        logoutUser()
            .then(() => {
                props.setUserName("");
                setRedirectState("/")
            })
            .catch((err) => setLogoutError(true))
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
            {logoutError && <Alert variant="warning" className="mt-5 mb-0">Unable to logout</Alert>}

        </>
    );
}
