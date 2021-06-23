import { Card, Button, Alert, Container, Form, Row, Col, NavItem, } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState } from "react";
import QuestionCard from "./QuestionCard";

export default function SurveyCreationForm() {

    const [questions, setQuestions] = useState([{ title: "", min: "", max: "", options: [] }, { title: "", min: "", max: "", options: [] }]);

    const updateOptions = (value, index) => {
        if (value === "") {
            setQuestions(old => old.map((x, i) => {
                if (i === index) return { ...x, "options": [...x.options, " "] }
                else return x;
            }))
        }
        else if (value === -1) {
            //FIXME THIS MAKES ERRORS
            setQuestions(old => old.map((x, i) => {
                if (i === index) return x.options.filter((item, i) => {
                    return i !== index
                })
                else return x;
            }))

        }
    }


    return (
        <>
            <Container className="marginTopNavbar">
                <Card className="text-center" border="warning">
                    <Card.Header> <h2>Let's create a new survey! </h2></Card.Header>
                    <Form>
                        <Card.Body>
                            <Form.Group as={Row}>
                                <Form.Label className="font-weight-bold" column sm="2">Title: </Form.Label>
                                <Col sm={10}>
                                    <Form.Control id="name" type="text" required />
                                </Col>
                            </Form.Group>
                            {questions.map((x, index) => (
                                <QuestionCard key={index} index={index} options={questions[index].options} updateOptions={updateOptions} />
                            ))}

                        </Card.Body >
                        <Container className="d-flex justify-content-between">
                            <Link style={{ textDecoration: "none" }} to="/">
                                <Button variant="secondary">Back</Button>
                            </Link>
                            <Button variant="magenta">Add question</Button>

                            <Button variant="purple">Submit</Button>
                        </Container>
                    </Form>
                </Card>
            </Container>
        </>
    )
}