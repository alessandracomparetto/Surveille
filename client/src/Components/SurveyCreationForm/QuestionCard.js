import { Card, Button, Alert, Form, Row, Col, } from "react-bootstrap";
import * as Icons from "react-bootstrap-icons";
import { useState } from "react";

export default function QuestionCard(props) {
    const [checkedState, setCheckedState] = useState(false);
    //NOTE - questo state in realtà arriva da un props
    const [options, setOptions] = useState([""])

    return (
        <Card className="mb-1" >
            <Card.Header className="d-flex justify-content-end">
                <Button variant="light"><Icons.TrashFill className="text-danger my-auto" size="1.3em" /></Button>
                <Button variant="light"><Icons.ArrowUpCircle className="text-primary " size="1.3em" /></Button>
                <Button variant="light"><Icons.ArrowDownCircle className="text-primary " size="1.3em" /></Button>
            </Card.Header>
            <Card.Body  >
                <Form.Group className="mt-2" as={Row} >
                    <Form.Label className="font-weight-bold" column sm={3} >Question: </Form.Label>
                    <Col sm={9}>
                        <Form.Control type="text" required />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} >
                    <Col>
                        <Form.Label className="font-weight-bold" column sm={6} >Min answers required: </Form.Label>
                        <Form.Control type="number" className="pb-0" min="0" max={checkedState? 10:1} placeholder="0" />
                    </Col>
                    <Col>
                        <Form.Label className="font-weight-bold" column sm={6} >Max answers required: </Form.Label>
                        <Form.Control type="number" className="pb-0" min="0" max={checkedState? 10:1} placeholder="0"/>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} >
                    <Col sm={6}>
                        <Form.Check inline label="Multiple choice" type="checkbox" className="pb-0 my-auto"
                            onClick={() => { setCheckedState(old => !old) }} />
                    </Col>
                    <Col sm={6}>
                        <Button variant="outline-dark" disabled={!checkedState}
                            onClick={() => { props.updateOptions("", props.index) }}>Add Option <Icons.PlusCircle className="text-primary "
                            /></Button>
                    </Col>
                </Form.Group>
                {checkedState && props.options.map((x, index) => (
                    <Form.Group key={index} className="mt-2" as={Row} >
                        <Form.Label className="font-weight-bold" column sm={2} >Option:</Form.Label>
                        <Col sm={9}>
                            <Form.Control type="text" required 
                                /* onChange={(event) => {
                                    setOptions(old => old.map((item, i) => {
                                        if (i === index) return event.target.value
                                        else return item
                                    }))
                                }} */ />
                        </Col>

                        <Col sm={1}>
                            <Button variant="light"><Icons.XCircle className="text-danger "
                                onClick={() => { props.updateOptions(-1, props.index)}} /></Button>
                        </Col>
                    </Form.Group>))}
            </Card.Body>
        </Card>





    )
}