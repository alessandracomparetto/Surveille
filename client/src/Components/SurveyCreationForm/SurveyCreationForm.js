import { Card, Button, Alert, Container, Form, Row, Col, Spinner } from "react-bootstrap";
import { Link, Redirect } from "react-router-dom";
import { useState } from "react";
import { sendSurvey } from "../../API/PostApi"
import QuestionCard from "./QuestionCard";
import ErrorAlert from "../ErrorAlert";

export default function SurveyCreationForm() {
    const [sending, setSending] = useState(false);
    const [title, setTitle] = useState("")
    const [questions, setQuestions] = useState([{ question: "", min: 0, max: 1, open: 1, options: [""] }]);
    const [compilationError, setCompilationError] = useState(false);
    const [redirectState, setRedirectState] = useState("");
    const [errorApi, seterrorApi] = useState(false);

    const updateOptions = (value, questionIndex, optionIndex) => {
        if (value === 0) {
            setQuestions(old => old.map((item, i) => {
                if (i === questionIndex) return { ...item, "options": [...item.options, ""] }
                else return item;
            }))
        }
        else if (value === -1) {
            setQuestions(old => old.map((item1, i1) => {
                if (i1 === questionIndex) return {
                    ...item1, options: [...item1.options.filter((item2, i2) => {
                        return i2 !== optionIndex
                    })]
                }
                else return item1;
            }))
        }
        else {
            setQuestions(old => old.map((item1, i1) => {
                if (i1 === questionIndex) return {
                    ...item1, "options": [...item1.options.map((item2, i2) => {
                        if (i2 === optionIndex) return value
                        else return item2
                    })]
                }
                else return item1;
            }))
        }
    }
    const updateQuestion = (value, questionIndex) => {
        setQuestions(old => old.map((item, index) => {
            if (index === questionIndex) return { ...item, question: value }
            else return item;
        }))
    }
    const updateOpen = (questionIndex) => {
        if (!questions[questionIndex].open) {
            setQuestions(old => old.map((item, index) => {
                if (index === questionIndex) return { ...item, open: 1, options: [""] }
                else return item;
            }))
        }
        else {
            setQuestions(old => old.map((item, index) => {
                if (index === questionIndex) return { ...item, open: 0 }
                else return item;
            }))
        }
    }
    const updateMinMax = (questionIndex, min, max) => {
        let open = questions[questionIndex].open;

        if (min < 0) min = 0
        if (max < 0) max = 0
        if (min > max) max = min

        if (open && max > 1) max = 1
        if (open && min > 1) min = 1

        if (!open && max > 10) max = 10
        if (!open && min > 10) min = 10

        setQuestions(old => old.map((item, index) => {
            if (index === questionIndex) return { ...item, min: min, max: max }
            else return item;
        }))
    }
    const removeQuestion = (questionIndex) => {
        if (questions.length === 1) return;
        setQuestions(old => old.filter((item, index) => { return index !== questionIndex }))
    }
    const moveQuestion = (questionIndex, destination) => {
        if (questions.length === 1) return
        if (questionIndex === 0 && destination === -1) return
        if (questionIndex === questions.length - 1 && destination === 1) return;
        setQuestions(old => {
            let data = [...old];
            let temp = { ...data[questionIndex] };
            data[questionIndex] = { ...data[questionIndex + destination] };
            data[questionIndex + destination] = { ...temp };
            return data;
        })
    }

    const validation = () => {
        if (!title.replaceAll(' ', '')) {
            setCompilationError("Title must not be empty")
            return false
        }
        if (questions.length === 0) {
            setCompilationError("Your survey must have at least one question!")
            return false
        }
        for (const question of questions) {
            if (!question.question.replaceAll(' ', '')) {
                setCompilationError("You have at least one question that is empty. Delete it or fill it in.")
                return false
            }
            if (!question.open) {
                if (question.options.length < 1) {
                    setCompilationError("You created a multiple choice question that has no options. Please add them.")
                    return false
                }
                if ((question.max > question.options.length)) {
                    setCompilationError("You created a multiple choice question whose \"max\" is higher than the number of options. Add more options or reduce both min and max.")
                    return false
                }
                for (const option of question.options) {
                    if (!option.replaceAll(' ', '')) {
                        setCompilationError("You created a question that has at least one empty option. Plase delete it or fill it.")
                        return false
                    }
                    if (question.options.filter((x) => x === option).length > 1) {
                        setCompilationError("You created a question that has at duplicated options. Plase delete it or modify it.")
                        return false
                    }
                }
            }
        }
        return true
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setCompilationError(false)
        if (!validation()) {
            setSending(false)
        }
        else {
            setSending(true);
            sendSurvey({ "title": title, "questions": [...questions] })
                .then(() => {
                    setRedirectState("/")
                }).catch((err) => {
                    seterrorApi(err);
                    setSending(false);
                })
        }
    };

    return (
        <>
            {redirectState && <Redirect to="/" />}
            <Container className="marginTopNavbar pb-4">
                <Card className="text-center" border="warning">
                    <Card.Header> <h2>Let's create a new survey! </h2></Card.Header>
                    <Form onSubmit={handleSubmit} >
                        <Card.Body>
                            <Form.Group as={Row}>
                                <Form.Label className="font-weight-bold" column sm="2">Title: </Form.Label>
                                <Col sm={10}>
                                    <Form.Control id="name" type="text" required onChange={(event) => { setTitle(event.target.value) }} />
                                </Col>
                                <Form.Text className="text-muted mx-auto font-weight-bold " >There must be at least one question. <br />
                                    You can't have open questions with more than one answer (min can be 0 or 1, max can be only 1). <br />
                                    For multiple choice questions you can't have more than 10 options (fill in first the min number, then increase the max if necessary).</Form.Text>
                            </Form.Group>

                            {questions.map((x, index) => (
                                <QuestionCard key={index} index={index}
                                    question={questions[index]}
                                    updateOptions={updateOptions}
                                    updateQuestion={updateQuestion}
                                    updateOpen={updateOpen}
                                    updateMinMax={updateMinMax}
                                    removeQuestion={removeQuestion}
                                    moveQuestion={moveQuestion} />
                            ))}

                        </Card.Body >
                        {compilationError && <Alert variant="danger">Check your compilation: <br />
                            {compilationError} <br />
                            Fix your mistakes and try again. </Alert>}
                        {errorApi &&
                            <><ErrorAlert errors={errorApi} />
                                <Link style={{ textDecoration: "none" }} to="/">
                                    <Button variant="secondary">Back</Button>
                                </Link></>}
                        <Card.Footer className="d-flex justify-content-between">
                            <Link style={{ textDecoration: "none" }} to="/">
                                <Button variant="secondary">Back</Button>
                            </Link>
                            {sending && <Spinner animation="border" />}
                            <Button variant="magenta"
                                onClick={() => { setQuestions(old => [...old, { question: "", min: 0, max: 1, open: 1, options: [""] }]) }}>Add question</Button>
                            <Button variant="purple" type="submit" >Submit</Button>
                        </Card.Footer>
                    </Form>
                </Card>
            </Container>
        </>
    )
}