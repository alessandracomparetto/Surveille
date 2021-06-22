import { Card, Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import * as Icons from "react-bootstrap-icons";

export default function SurveysPreview(props) {

  return (
    <Container >
      {props.surveyList.map((x) => (
        <Card key={x.id} bg="secondary" text="light" className="my-3" >
          <Card.Header> <Card.Title> {x.title} </Card.Title></Card.Header>
          <Card.Body className="d-flex"  >
                        
          <Card.Text className="mb-0">
            {props.userName ? 
            (<span> Number of submission: {x.num}</span>) : 
            (<span> Author: {x.author} <br/> Number of questions: {x.num}</span>)}
            </Card.Text>
            < Link style={{ textDecoration: "none" }} to={`/survey/${x.id}`} className="ml-auto my-auto">
            <Button variant="light" ><Icons.Megaphone size="2em" className="mr-2" /></Button>
            </Link>
          </Card.Body>
        </Card>
  ))
}
    </Container >
  )
}