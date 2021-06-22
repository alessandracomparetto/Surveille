import { Card, Button, Alert, Container, Form, Row, Col, OverlayTrigger, Tooltip } from "react-bootstrap";

export default function SurveyCreationForm(props) {
    return (
        <>
            <Container className="marginTopNavbar">
                <Card className="text-center" border="warning">
                    <Card.Header> <h2>Let's create a new survey! </h2></Card.Header>
                    <Form>
                        <Card.Body>
                            <Form.Group as={Row}>
                                <Form.Label className="font-weight-bold" column sm="2">Title: </Form.Label>
                                <Col sm="10">
                                    <Form.Control id="name" type="text" required />
                                </Col>
                            </Form.Group>
                            <Card >
                                <Card.Title className="mt-2">Your questions: </Card.Title>
                                <Card.Body style={{ maxHeight: '200px', overflowY: 'scroll' }} >
                                    <Card.Text>This is some text within a card body.
                                        This is some text within a card body.
                                        This is some text within a card body.
                                        This is some text within a card body.
                                        This is some text within a card body.
                                        This is some text within a card body.
                                        This is some text within a card body.
                                        This is some text within a card body.
                                        This is some text within a card body.
                                        This is some text within a card body.
                                        This is some text within a card body.
                                        This is some text within a card body.
                                        This is some text within a card body.
                                        This is some text within a card body.
                                        This is some text within a card body.
                                        This is some text within a card body.
                                        This is some text within a card body.
                                        This is some text within a card body.
                                        This is some text within a card body.
                                        This is some text within a card body.
                                        This is some text within a card body.
                                        This is some text within a card body.
                                        This is some text within a card body.
                                        This is some text within a card body.
                                        This is some text within a card body.
                                        This is some text within a card body.
                                        This is some text within a card body.
                                        This is some text within a card body.
                                        This is some text within a card body.
                                        This is some text within a card body.
                                        This is some text within a card body.
                                        This is some text within a card body.
                                        This is some text within a card body.
                                        This is some text within a card body.
                                        This is some text within a card body.
                                        This is some text within a card body.
                                        This is some text within a card body.
                                        This is some text within a card body.
                                        This is some text within a card body.
                                        This is some text within a card body.
                                        This is some text within a card body.
                                        This is some text within a card body.
                                        This is some text within a card body.
                                        This is some text within a card body.
                                        This is some text within a card body.
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                            <Form.Group className="mt-2" as={Row} >
                                <Form.Label className="font-weight-bold" column sm={4} >Question: </Form.Label>
                                <Col sm={8}>
                                    <Form.Control type="text" required />
                                </Col>
                            </Form.Group>

                            <Form.Group className="d-flex justify-content-between ">
                                <Form.Check inline label="Multiple choice question" type="radio" className="pb-0" />
{/* FIXME - errore di tooltip, crea componente */}
                                <OverlayTrigger placement="bottom" overlay={<Tooltip>If your question is ready, click here to save it!</Tooltip>}>
                                    <span className="d-inline-block">
                                        <Button variant="purple">Add question</Button>
                                    </span>
                                </OverlayTrigger>

                            </Form.Group>
                        </Card.Body>



                    </Form>
                </Card>
            </Container>
        </>
    )
}