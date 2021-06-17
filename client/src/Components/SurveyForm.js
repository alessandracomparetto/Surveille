import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getSurvey } from "../API/GetApi";
import { Card, Button, Alert, Container, Form, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

import ErrorAlert from "./ErrorAlert";

export default function SurveyForm(props) {
    const [loading, setloading] = useState(true);
    const [errorApi, seterrorApi] = useState(false);
    const [compilationError, setCompilationError] = useState(false);

    const surveyid = useParams();
    const [survey, setSurvey] = useState([]);
    const [submission, setSubission] = useState({ survey: surveyid.id, user: undefined, answers: [] });

    useEffect(() => {
        getSurvey(surveyid.id)
            .then((res) => {
                seterrorApi(false);
                //TODO - delete
                console.log(res);
                //
                setSurvey(res);

                setSubission((old) => {
                    for (let i = 0; i < res.questions.length; i++) {
                        if (!res.questions[i].open) old.answers[res.questions[i].id] = [];
                    }
                    return old;
                })
            })
            .catch((err) => {
                seterrorApi(err);
            })
            .finally(() => {
                setloading(false);
            })
    }, [])

    const handleChange = (event, question_id, text) => {
        let temp = {...submission};

        if (event.target.id === "name") {
            temp.user = event.target.value;
        }
        else if (!question_id && !text) { //textarea
            temp.answers[event.target.id] = { "id_question": event.target.id, "value": event.target.value }
        }
        else { //checkbox event
            if (event.target.checked) temp.answers[question_id][event.target.id] = { "id_question": question_id, "value": text };
            else temp.answers[question_id][event.target.id] = {};
        }
        // console.log(JSON.stringify(temp))
        // console.log(temp)
        setSubission(temp);
    }

    const remove_null= (answers)=>{
        console.log("qui");
        answers = answers.filter(Boolean);
        for(let i = 0; i<answers.length; i++){
            if(answers[i] instanceof Array){
                if(answers[i].length === 0) answers.splice(i, 1);
                else{
                    answers[i] = answers[i].filter(Boolean);
                }
               
            }
        }
        
        console.log(JSON.stringify(answers))
        return answers;
    }

    const validation = () => {
        let flag = true;
        let temp = {...submission};
        temp.answers = remove_null(temp.answers);
        console.log(temp);
        // console.log(JSON.stringify(temp));
        let min, max, id;
        for (let i = 0; i < survey.questions.length; i++) { //ciclo sulle domande
            if (!survey.questions[i].open) {
                min = survey.questions[i].min;
                max = survey.questions[i].max;
                id = survey.questions[i].id;
            }
            for(let j = 0; j<temp.answers.length; j++){
                if(temp.answers[j] instanceof Array && temp.answers[j].id_question == id){
                    flag = flag && temp.answers[j].length >= min && temp.answers[j].length <= max
                }
            }
        }
        return flag;
    }

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        if (validation()) {
            console.log("Ok")
        }
        else {
            console.log("eheh")
            setCompilationError(true);
        }
    };


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
    )
}