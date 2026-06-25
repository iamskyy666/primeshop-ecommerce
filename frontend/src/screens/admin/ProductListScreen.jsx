import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Row, Col } from "react-bootstrap";
import { FaTimes, FaEdit, FaTrash } from "react-icons/fa";
import { useGetProductsQuery } from "../../slices/productsApiSlice";
import Loader from "../../components/Loader";

function ProductListScreen() {
  const { data: products, isLoading, error } = useGetProductsQuery();

  const deleteHandler = async (id) => {
    console.log('Delete:',id)
  };

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="text-end">
          <Button className="btn-sm m-3">
            <FaEdit /> Create Product
          </Button>
        </Col>
      </Row>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Table striped hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>BRAND</th>
                <th>CATEGORY</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    <LinkContainer to={`/admin/products/${product._id}/edit`}>
                      <Button variant="light" className="btn-sm mx-2">
                        <FaEdit />
                      </Button>
                    </LinkContainer>
                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => deleteHandler(product._id)}>
                      <FaTrash style={{color:"white"}}/>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </>
  );
}

export default ProductListScreen;
