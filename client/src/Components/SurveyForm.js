import { useState, useEffect } from "react";
import { useParams, Redirect } from "react-router-dom";
import { getSurvey, getAdminSurveyAnswers } from "../API/GetApi";
import { Card, Button, Alert, Container, Form, Row, Col, Pagination } from "react-bootstrap";
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
    const [submission, setSubmission] = useState({ survey: surveyid.id, user: "", answers: [] });
    const [values, setValues] = useState([]);
    const [counter, setCounter] = useState();

    useEffect(() => {
        getSurvey(surveyid.id)
            .then((res) => {
                seterrorApi(false);
                setSurvey(res);
                if (props.userName) {
                    getAdminSurveyAnswers(surveyid.id)
                        .then((res) => {
                            setValues(res);
                            setCounter(0);
                        })
                        .catch((err) => {
                            seterrorApi(err);
                        })
                }
            })
            .catch((err) => {
                seterrorApi(err);
            })
            .finally(() => {
                setloading(false);
            })
        // eslint-disable-next-line
    }, [])

    const handleChange = (event, question_id, text) => {
        let temp = { ...submission };

        if (event.target.id === "name") {
            temp.user = event.target.value;
        }
        else if (!question_id && !text) { //textarea
            let index = temp.answers.findIndex((item) => item && parseInt(item.id_question) === parseInt(event.target.id))
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

    const findAnswer = (questionid, label) => {
        let index;
        if (!label) {
            index = values[counter].values.findIndex((item) => item && item.id_question === questionid);
            if (index === -1) return ""
            else return values[counter].values[index].value;
        }
        else {
            index = values[counter].values.findIndex((item) => item && item.id_question === questionid && item.value === label);
            if (index === -1) return false
            else return true;
        }
    }

    const findValue = (questionid, label) => {
        let index;
        if (!label) {
            index = submission.answers.findIndex((item) => item && parseInt(item.id_question) === parseInt(questionid));
            if (index === -1) return ""
            else return submission.answers[index].value
        }
        else {
            index = submission.answers.findIndex((item) => item && item.id_question === questionid && item.value === label);
            if (index === -1) return false
            else return true
        }

    }
    return (
        <>
            {redirectState && <Redirect to="/" />}
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
                                        <Form.Label>{props.userName ? "Compilation from user:" : "Please, write here your name"}</Form.Label>
                                        <Form.Control
                                            id="name"
                                            type="text"
                                            required
                                            onChange={handleChange}
                                            value={(values.length > 0 && counter !== undefined) ? values[counter].user : submission.user}
                                            readOnly={values.length > 0 ? true : false}
                                        />
                                    </Form.Group>
                                    {survey.questions.map((question) => (
                                        question.open ?
                                            (<Form.Group key={question.id} >
                                                <Form.Label className="font-weight-bold">{question.text}</Form.Label>
                                                <Form.Text className="text-muted" > Max 200 characters{(question.min >= 1) ? ", compulsory" : ""}</Form.Text>
                                                <Form.Control
                                                    as="textarea"
                                                    rows={3}
                                                    maxLength="200" id={question.id}
                                                    required={(question.min >= 1) ? true : false}
                                                    onChange={handleChange}
                                                    value={(values.length > 0 && counter !== undefined) ? findAnswer(question.id) : findValue(question.id)}
                                                    readOnly={values.length > 0 ? true : false}
                                                />
                                            </Form.Group>
                                            ) :
                                            (<Form.Group key={question.id} >
                                                <Form.Label className="font-weight-bold">{question.text}</Form.Label>

                                                <Container>
                                                    <Row>
                                                        {question.options.map((x) => (
                                                            <Col key={x.id} md={3} >
                                                                <Form.Group >
                                                                    <Form.Check
                                                                        type="checkbox"
                                                                        id={x.id}
                                                                        label={x.text}
                                                                        onChange={(e) => { handleChange(e, question.id, x.text) }}
                                                                        readOnly={values.length > 0 ? true : false}
                                                                        checked={(values.length > 0 && counter !== undefined) ? findAnswer(question.id, x.text) : findValue(question.id, x.text)}
                                                                    />
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
                                    {compilationError && <Alert variant="danger">Check the compilation, there are some errors! <br /> Follow the given directions.</Alert>}

                                    <div className="d-flex justify-content-between">
                                        <Link style={{ textDecoration: "none" }} to="/">
                                            <Button variant="secondary">Back</Button>
                                        </Link>
                                        {!props.userName && <Button variant="purple" type="submit">Submit your answers!</Button>}
                                        {values.length > 0 && counter !== undefined && <Pagination>
                                            <Pagination.Prev
                                                onClick={() => setCounter((old) => {
                                                    if (old - 1 >= 0) return old - 1
                                                    else return values.length - 1
                                                })} />
                                            {values.map((item, index) => (
                                                index < 9 && <Pagination.Item key={index} active={counter + 1 === index + 1}
                                                    onClick={(() => { setCounter(index) })} >{index + 1}</Pagination.Item>

                                            ))}
                                            {values.length >= 9 && <><Pagination.Ellipsis active={counter + 1 > 9 && counter + 1 < values.length} />
                                                <Pagination.Item key={values.length - 1} active={counter + 1 === values.length}
                                                    onClick={(() => { setCounter(values.length - 1) })}  >{values.length}</Pagination.Item></>}
                                            <Pagination.Next
                                                onClick={() => setCounter((old) => {
                                                    if (old + 1 < values.length) return old + 1
                                                    else return 0
                                                })} />
                                        </Pagination>}
                                    </div>
                                </Card.Footer>
                            </Form>
                        </Card>
                    )}

            </Container>
        </>
    )
}