import { Row, Col } from "react-bootstrap";
import Product from "../components/Product";
import { useGetProductsQuery } from "../slices/productsApiSlice";
// import { useEffect, useState } from "react";
// import axios from "axios";

function HomeScreen() {
  // const [products, setProducts] = useState([]);

  // useEffect(() => {
  //   async function fetchProducts() {
  //     const { data } = await axios.get("/api/products");
  //     setProducts(data);
  //   }
  //   fetchProducts();
  // }, []);

  //! 💡 Using RTK-Query instead (better,simpler)

  const { data: products, isLoading, isError, error } = useGetProductsQuery();

  return (
    <>
      {isLoading ? (
        <h2>Loading... ⌛</h2>
      ) : isError ? (
        <h2>
          ⚠️ {error?.data?.message || error?.error} {console.log(error)}
        </h2>
      ) : (
        <>
          <h1>Latest Products</h1>
          <Row>
            {products?.map((product) => {
              return (
                <Col sm={12} md={6} lg={4} xl={3} key={product._id}>
                  <Product product={product} />
                </Col>
              );
            })}
          </Row>
        </>
      )}
    </>
  );
}

export default HomeScreen;
