import { useState, useEffect } from "react";
import { useParams, Redirect } from "react-router-dom";
import { getSurvey } from "../API/GetApi";
import { Card, Button, Alert, Container, Form, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

import ErrorAlert from "./ErrorAlert";
import { sendSubmission } from "../API/PostApi";

export default function SurveyForm(props) {
    const [loading, setloading] = useState(true);
    const [errorApi, seterrorApi] = useState(false);
    const [compilationError, setCompilationError] = useState(false);
    const [redirectState, setRedirectState] = useState("");

    const surveyid = useParams();
    const [survey, setSurvey] = useState([]);
    const [submission, setSubmission] = useState({ survey: surveyid.id, user: undefined, answers: [] });

    useEffect(() => {
        if (!props.userName)
        getSurvey(surveyid.id)
            .then((res) => {
                seterrorApi(false);
                setSurvey(res);
            })
            .catch((err) => {
                seterrorApi(err);
            })
            .finally(() => {
                setloading(false);
            })
    }, [survey.id])

    const handleChange = (event, question_id, text) => {
        let temp = { ...submission };

        if (event.target.id === "name") {
            temp.user = event.target.value;
        }
        else if (!question_id && !text) { //textarea
            let index = temp.answers.findIndex((item) => item && item.id_question === event.target.id);
            if (index === -1) temp.answers.push({ "id_question": parseInt(event.target.id), "value": event.target.value })
            else {
                if (event.target.value === "") temp.answers.splice(index, 1);
                else temp.answers[index] = { "id_question": parseInt(event.target.id), "value": event.target.value };
            }
        }
        else { //checkbox event
            if (event.target.checked) {
                let index = temp.answers.findIndex((item) => item && item.id_question === question_id && item.value === text);
                if (index === -1) temp.answers.push({ "id_question": question_id, "value": text })
                else temp.answers[index] = { "id_question": question_id, "value": text };
            }
            else {
                let index = temp.answers.findIndex((item) => item && item.id_question === question_id && item.value === text);
                temp.answers.splice(index, 1);
            }
        }
        setSubmission(temp);
    }

    const validation = () => {
        let result = true;
        let count = 0;

        for (const question of survey.questions) {
            count = 0;
            if (!question.open) {
                for (const answer of submission.answers) {
                    if (answer.id_question === question.id) {
                        count++;
                    }
                }
                if (count) result = result && count >= question.min && count <= question.max;
                else result = result && question.min === 0
            }
        }
        return result;
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (validation()) {
            setCompilationError(false);
            sendSubmission(submission)
                .then(() => {
                    setloading(true);
                    setRedirectState("/")
                }).catch((err) => {
                    seterrorApi(err);
                })
        }
        else {
            setCompilationError(true);
        }
    };


    return (
        <>
        {redirectState &&  <Redirect to="/" />}
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
                        <Form onSubmit={handleSubmit} >
                            <Card.Body>
                                <Form.Group>
                                    <Form.Label>Please, write here your name</Form.Label>
                                    <Form.Control id="name" type="text" required onChange={handleChange} />
                                </Form.Group>
                                {survey.questions.map((question) => (
                                    question.open ?
                                        (<Form.Group key={question.id} >
                                            <Form.Label className="font-weight-bold">{question.text}</Form.Label>
                                            <Form.Text className="text-muted" > Max 200 characters</Form.Text>
                                            <Form.Control as="textarea" rows={3}
                                                maxLength="200" id={question.id}
                                                required={(question.min >= 1) ? true : false}
                                                onChange={handleChange} />

                                        </Form.Group>
                                        ) :
                                        (<Form.Group key={question.id} >
                                            <Form.Label className="font-weight-bold">{question.text}</Form.Label>

                                            <Container>
                                                <Row>
                                                    {question.options.map((x) => (
                                                        <Col key={x.id} md={3} >
                                                            <Form.Group  >
                                                                <Form.Check type="checkbox" id={x.id} label={x.text}
                                                                    onChange={(e) => { handleChange(e, question.id, x.text) }} />
                                                            </Form.Group>
                                                        </Col>
                                                    ))}
                                                </Row>
                                                <Form.Text className="text-muted" > min: {question.min}, max: {question.max}</Form.Text>
                                            </Container>
                                        </Form.Group>)
                                ))}
                            </Card.Body>
                            <Card.Footer >
                                {compilationError && <Alert variant="danger">Controlla la tua compilazione, ci sono degli errori!</Alert>}

                                <div className="d-flex justify-content-between">
                                    <Link style={{ textDecoration: "none" }} to="/">
                                        <Button variant="secondary">Back</Button>
                                    </Link>
                                    <Button variant="purple" type="submit">Submit your answers!</Button>
                                </div>
                            </Card.Footer>
                        </Form>
                    </Card>
                )}

        </Container>
        </>
    )
}