import { Alert,Collapse, Container } from "react-bootstrap";
import { EmojiFrownFill } from "react-bootstrap-icons";
import {useState} from 'react'

function ErrorAlert(props) {
  const { message, details } = props.errors;
  const [collapse, setcollapse] = useState(false)
  return (
    <Container >
      <Alert variant="danger">
        <Alert.Heading>
          {message} {<EmojiFrownFill className="pb-1" />}
        </Alert.Heading>
        <p>Please, reload or try again later.</p>
        {details ? (
          <div>
            <hr />
            <div onClick={()=>setcollapse(x=>!x)}><Alert.Link  href="#">{`Expand info ${collapse?"\u25bc":"\u25c4"}`}   </Alert.Link></div>
            <Collapse in={collapse}>
              <p className="mb-0">{details}</p>
            </Collapse>
          </div>
        ) : null}
      </Alert>
    </Container>
  );
}

export default ErrorAlert;
