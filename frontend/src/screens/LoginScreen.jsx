import { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { Link } from "react-router-dom";

function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function submitHandler(evt) {
    evt.preventDefault();
    console.log("submit-handler ✅");
  }

  return (
    <FormContainer>
      <h1>Sign In</h1>
      <Form onSubmit={submitHandler}>
        {/* 📧 EMAIL */}
        <Form.Group controlId="email" className="my-3">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(evt) => setEmail(evt.target.value)}
          />
        </Form.Group>
        {/* 🔑 PASSWORD */}
        <Form.Group controlId="email" className="my-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(evt) => setPassword(evt.target.value)}
          />
        </Form.Group>
        {/* 👆🏻 SUBMIT BUTTON */}
        <Button type="submit" variant="primary" className="my-3">
          Submit
        </Button>
      </Form>
      <Row className="py-3">
        <Col className="">
          👤 New Customer? <Link to="/register">Register</Link>
        </Col>
      </Row>
    </FormContainer>
  );
}

export default LoginScreen;
