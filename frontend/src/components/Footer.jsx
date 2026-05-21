import { Col, Container, Row } from "react-bootstrap";

const Footer = () => {
  const currYear = new Date().getFullYear();
  return (
    <footer>
      <Container>
        <Row>
          <Col className="text-center py-3">
            <p>ProShop &copy; {currYear}</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
