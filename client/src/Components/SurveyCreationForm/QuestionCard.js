import { Card, Button, Form, Row, Col, Tooltip } from "react-bootstrap";
import * as Icons from "react-bootstrap-icons";

const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" >
        Tooltip
    </Tooltip>
);

export default function QuestionCard(props) {

    return (
        <Card className="mb-1" >
            <Card.Header className="d-flex justify-content-end">
                <Button variant="light" onClick={() => props.removeQuestion(props.index)}>
                    <Icons.TrashFill className="text-danger my-auto" size="1.3em" />
                </Button>
                <Button variant="light" onClick={() => props.moveQuestion(props.index, -1)}>
                    <Icons.ArrowUpCircle className="text-primary " size="1.3em" />
                </Button>
                <Button variant="light" onClick={() => props.moveQuestion(props.index, 1)}>
                    <Icons.ArrowDownCircle className="text-primary " size="1.3em" />
                </Button>
            </Card.Header>
            <Card.Body  >
                <Form.Group className="mt-2" as={Row} >
                    <Form.Label className="font-weight-bold" column sm={3} >Question: </Form.Label>
                    <Col sm={9}>
                        <Form.Control type="text" required value={props.question.question}
                            onChange={(event) => { props.updateQuestion(event.target.value, props.index) }} />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} >
                    <Col>
                        <Form.Label className="font-weight-bold" column sm={6} >Min answers required: </Form.Label>
                        <Form.Control type="number" className="pb-0" min={0} max={props.question.open ? 1 : 10}
                            onChange={(event) => { props.updateMinMax(props.index, event.target.valueAsNumber, props.question.max) }}
                            value={props.question.min} />
                    </Col>
                    <Col>
                        <Form.Label className="font-weight-bold" column sm={6} >Max answers required: </Form.Label>
                        <Form.Control type="number" className="pb-0" min={1} max={props.question.open ? 1 : 10}
                            onChange={(event) => { props.updateMinMax(props.index, props.question.min, event.target.valueAsNumber) }}
                            value={props.question.max} />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} >
                    <Col sm={6}>
                        <Form.Check inline label="Multiple choice" type="checkbox" className="pb-0 my-auto"
                            onClick={() => { props.updateOpen(props.index) }} />
                    </Col>
                    <Col sm={6}>
                            <Button variant="outline-dark" disabled={props.question.open} 
                                onClick={() => { props.updateOptions(0, props.index) }}>
                                Add Option <Icons.PlusCircle className="text-primary " />
                            </Button>
                    </Col>
                </Form.Group>
                {!props.question.open && props.question.options.map((x, index) => (
                    <Form.Group key={index} className="mt-2" as={Row} >
                        <Form.Label className="font-weight-bold" column sm={2} >Option:</Form.Label>
                        <Col sm={9}>
                            <Form.Control type="text" required value={props.question.options[index]}
                                onChange={(event) => { props.updateOptions(event.target.value, props.index, index) }} />
                        </Col>

                        <Col sm={1}>
                            <Button variant="light"><Icons.XCircle className="text-danger"
                                onClick={() => { props.updateOptions(-1, props.index, index) }} /></Button>
                        </Col>
                    </Form.Group>
                ))}
            </Card.Body>
        </Card>





    )
}