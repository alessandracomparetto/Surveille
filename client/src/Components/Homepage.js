import { Container, Button, Alert } from "react-bootstrap";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getSurveys, getAdminSurveys } from "../API/GetApi";
import SurveysPreview from "./SurveysPreview";
import ErrorAlert from "./ErrorAlert";

export default function Homepage(props) {
    const [surveyList, setSurveyList] = useState([]);
    const [errorApi, seterrorApi] = useState(false);
    const [loading, setloading] = useState(true);

    useEffect(() => {
        if (!props.userName) {
            getSurveys()
                .then((res) => {
                    seterrorApi(false);
                    setSurveyList(res);
                }).catch((err) => {
                    seterrorApi(err);
                }).finally(() => setloading(false))
        }
        else {
            getAdminSurveys()
                .then((res) => {
                    seterrorApi(false);
                    setSurveyList(res);
                }).catch((err) => {
                    seterrorApi(err);
                }).finally(() => setloading(false))
        }
    }, [props.userName])

    return (
        <>
            {loading ? (<Alert variant="info" className="mt-5"> Now loading</Alert>) : (
                <>
                    {props.userName ?
                        (<Container className="d-flex justify-content-between mt-2  marginTopNavbar">
                            <h3>Welcome! Here we have your surveys! </h3>
                            < Link style={{ textDecoration: "none" }} to={`/survey`} className="ml-auto my-auto">
                                <Button variant="magenta">Add Survey</Button>
                            </Link>
                        </Container>)
                        :
                        (<Container className="mt-2 marginTopNavbar">
                            <h3>Welcome! We have some new surveys ready for you!</h3>
                        </Container>)
                    }
                </>
            )}


            {errorApi ? (
                <ErrorAlert errors={errorApi} />
            ) : (
                <SurveysPreview userName={props.userName} surveyList={surveyList} />
            )}
        </>
    )
}