import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CheckoutSteps from "./CheckoutSteps";
import { Row, Col } from "react-bootstrap";

const PlaceOrderScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    } else if (!cart.paymentMethod) {
      navigate("/payment");
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  return <>
  <CheckoutSteps step1 step2 step3 step4/>
  <Row>
    <Col md={8}>Column</Col>
    <Col md={4}>Column</Col>
  </Row>
  </>;
};

export default PlaceOrderScreen;
