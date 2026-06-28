import { Row, Col } from "react-bootstrap";
import Product from "../components/Product";
import { useGetProductsQuery } from "../slices/productsApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useParams } from "react-router-dom";
import Paginate from "../components/Paginate";

function HomeScreen() {
  const { pageNumber } = useParams();
  const { data, isLoading, isError, error } = useGetProductsQuery({
    pageNumber,
  });

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">
          ⚠️ {error?.data?.message || error?.error} {console.log(error)}
        </Message>
      ) : (
        <>
          <h1>Latest Products</h1>
          <Row>
            {data.products?.map((product) => {
              return (
                <Col sm={12} md={6} lg={4} xl={3} key={product._id}>
                  <Product product={product} />
                </Col>
              );
            })}
          </Row>
          {/* PAGINATION */}
          <Paginate pages={data.pages} page={data.page}/>
        </>
      )}
    </>
  );
}

export default HomeScreen;
