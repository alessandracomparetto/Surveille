import { Container, Button, } from "react-bootstrap";
import { useState, useEffect } from "react";
import { getSurveys } from "../API/GetApi";
import SurveysPreview from "./SurveysPreview";
import ErrorAlert from "./ErrorAlert";

export default function Homepage(props) {
    const [surveyList, setSurveyList] = useState([]);
    const [errorApi, seterrorApi] = useState(false);

    useEffect(()=>{
        if(!props.userName){
            getSurveys()
            .then((res)=>{
                setSurveyList(res);
                console.log(res);
            }).catch((err) =>{
                seterrorApi(err);
                console.log(err);
            })
        } 
    }, [])

    return (
        <>
            {props.userName ?
                (<Container className="d-flex justify-content-between mt-2  marginTopNavbar">
                    <h3>Welcome! Here we have your surveys! </h3>
                    <Button variant="magenta">Add Survey</Button>
                </Container>)
                :
                (<Container className="mt-2 marginTopNavbar">
                    <h3>Welcome! We have some new surveys ready for you!</h3>
                </Container>)
            }
            {errorApi ? (
              <ErrorAlert errors={errorApi} />
            ) : (       
            <SurveysPreview userName = {props.userName} surveyList={surveyList}/>
            )}
        </>
    )
}