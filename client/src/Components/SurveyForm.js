import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getSurvey } from "../API/GetApi";
import { Card, Button, Alert, Container, Form, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

import ErrorAlert from "./ErrorAlert";

export default function SurveyForm(props) {
    const [loading, setloading] = useState(true);
    const [errorApi, seterrorApi] = useState(false);
    const surveyid = useParams();
    const [survey, setSurvey] = useState([]);
    const [submission, setSubission] = useState({survey:surveyid, user:undefined, answers:[]});

    useEffect(() => {
        getSurvey(surveyid.id)
            .then((res) => {
                seterrorApi(false);
                //TODO - delete
                console.log(res);
                //
                setSurvey(res);
            })
            .catch((err) => {
                seterrorApi(err);
            })
            .finally(() => {
                setloading(false);
            })
    }, [])

    const handleChange = (event) =>{
        console.log(event.target.value)
        let temp = submission;
        temp.answers= [...temp.answers, {"id_question": event.target.id, "value" : event.target.value }]
        console.log("temp",temp)
        // setAnswers((old)=>{return old.answers.push({"id_question": event.target.id, "value" : event.target.value })})
        //FIXME - ancora le risposte si sovrascrivno. deve essere cambiato.
        }

    return (
        <Container className="marginTopNavbar">
            {loading && <Alert variant="info" className="mt-5"> Now loading</Alert>}
            {errorApi ?
                (<><ErrorAlert errors={errorApi} />
                    <Link style={{ textDecoration: "none" }} to="/">
                        <Button variant="secondary">Back</Button>
                    </Link></>)
                :
                (!loading &&
                    <Card className="text-center" border="warning">
                        <Card.Header> <h2>Title: {survey.title} </h2></Card.Header>
                        <Form >
                            <Card.Body>
                                <Form.Group controlId="formBasicPassword">
                                    <Form.Label>Please, enter here your name</Form.Label>
                                    <Form.Control type="text" required />
                                </Form.Group>
                                {survey.questions.map((question) => (
                                    question.open ?
                                        (<Form.Group key={question.id} >
                                            <Form.Label className="font-weight-bold">{question.text}</Form.Label>
                                            <Form.Text className="text-muted" > Max 200 characters</Form.Text>
                                            <Form.Control as="textarea" rows={3} 
                                                            maxLength="200" id ={question.id} 
                                                            required={(question.min>=1)? true : false} 
                                                            onChange={handleChange}/>

                                        </Form.Group>
                                        ) :
                                        (<Form.Group key={question.id} controlId="formBasicCheckbox">
                                            <Form.Label className="font-weight-bold">{question.text}</Form.Label>
                                            <Container>
                                                <Row>
                                                    {question.options.map((x) => (
                                                        <Col key={x.id} md={3}>
                                                            <Form.Group controlId={x.text} >
                                                                <Form.Check type="checkbox" label={x.text} />
                                                            </Form.Group>
                                                        </Col>
                                                    ))}
                                                </Row>
                                            </Container>
                                        </Form.Group>)
                                ))}
                            </Card.Body>

                            <Card.Footer className="d-flex justify-content-between">
                                <Link style={{ textDecoration: "none" }} to="/">
                                    <Button variant="secondary">Back</Button>
                                </Link>
                                <Button variant="purple" type="submit">Submit your answers!</Button>

                            </Card.Footer>
                        </Form>
                    </Card>
                )}

        </Container>
    )
}