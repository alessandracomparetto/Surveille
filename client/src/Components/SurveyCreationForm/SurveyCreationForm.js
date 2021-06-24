import { Card, Button, Alert, Container, Form, Row, Col, } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState } from "react";
import QuestionCard from "./QuestionCard";

export default function SurveyCreationForm() {
    const [title, setTitle] = useState("")
    const [questions, setQuestions] = useState([{ question: "", min: 0, max: 1, open: 1, options: [""] }]);
    const [compilationError, setCompilationError] = useState(false);

    const updateOptions = (value, questionIndex, optionIndex) => {
        if (value === 0) {
            setQuestions(old => old.map((item, i) => {
                if (i === questionIndex) return { ...item, "options": [...item.options, " "] }
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
                if (index === questionIndex) return { ...item, open: 1, options: [" "] }
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
        if (questionIndex === questions.length && destination === 1) return;
        setQuestions(old => {
            let data = [...old];
            let temp = { ...data[questionIndex] };
            data[questionIndex] = { ...data[questionIndex + destination] };
            data[questionIndex + destination] = { ...temp };
            return data;
        })
    }

    const handleSubmit = (event) => {
        let flag = false;
        event.preventDefault();
        event.stopPropagation();
        setCompilationError(false)

        if (questions.length === 0) flag = true;
        for (const question of questions) {
            if (!question.open) {
                if (question.options.length < 1) {
                    flag = true
                    break
                }
                if (question.max > question.options.length) {
                    flag = true;
                    break;
                }
                for (const option of question.options) {
                    if (!option.replaceAll(' ', '')) {
                        flag = true;
                        break;
                    }
                }
            }
        }

        if (flag) setCompilationError(true)
    };

    return (
        <>
            <Container className="marginTopNavbar">
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
                            <ul>
                                <li>In a multiple choice question, you must have at least one non-empty option.</li>
                                <li>Max number must be less than or equal to the number of options.</li>
                                <li>Options must not be empty. Delete the ones you're not using.</li>
                                </ul>
                            Fix your mistakes and try again. </Alert>}

                        <Card.Footer className="d-flex justify-content-between">

                            <Link style={{ textDecoration: "none" }} to="/">
                                <Button variant="secondary">Back</Button>
                            </Link>
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