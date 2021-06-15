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

    useEffect(() => {
        getSurvey(surveyid.id)
            .then((res) => {
                seterrorApi(false);
                console.log(res);
                setSurvey(res);
            })
            .catch((err) => {
                seterrorApi(err);

                console.log(err);
            })
            .finally(() => {
                setloading(false);
            })
    }, [])


    return (
        <Container className="marginTopNavbar">
            {loading && <Alert variant="info" className="mt-5"> Now loading</Alert>}
            {errorApi ?
                (<ErrorAlert errors={errorApi} />)
                :
                (!loading &&
                    <Card className="text-center" border="warning">
                        <Card.Header> <h2>Title: {survey.title} </h2></Card.Header>
                        <Card.Body>
                            <Form>
                                {survey.questions.map((question) => (
                                    question.open ?
                                        (<Form.Group key={question.id} controlId="exampleForm.ControlTextarea1">
                                            <Form.Label className="font-weight-bold">{question.text}</Form.Label>
                                            <Form.Text className="text-muted"> Max 200 characters</Form.Text>
                                            <Form.Control as="textarea" rows={3} maxLength="200" />

                                        </Form.Group>
                                        ) :
                                        (<Form.Group key={question.id} controlId="formBasicCheckbox">
                                            <Form.Label className="font-weight-bold">{question.text}</Form.Label>
                                            <Container>
                                                <Row>
                                                {question.options.map((x) => (
                                                    <Col md={3}>
                                                    <Form.Group controlId={x.text}>
                                                        <Form.Check type="checkbox" label={x.text} />
                                                    </Form.Group>
                                                    </Col>
                                                   ))}
                                                </Row>
                                            </Container>
                                        </Form.Group>)
                                ))}
                            </Form>
                        </Card.Body>

                        <Card.Footer className="d-flex justify-content-between">
                        <Link style={{ textDecoration: "none" }} to="/">
                        <Button variant="secondary">Back</Button>
                        </Link>
                            <Button variant="purple">Submit your answers!</Button>
                            
                            </Card.Footer>
                    </Card>
                )}

        </Container>
    )
}