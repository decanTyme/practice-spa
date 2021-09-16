import "./products.css";
import Product from "./components/ProductDetail";
import ProductList from "./components/ProductList";
import AddProductForm from "./components/AddProductForm/AddProductForm";
import ErrorBoundary from "../../../../components/ErrorBoundary";
import { useSelector } from "react-redux";
import { selectDataDetails } from "app/state/reducers/data";

function Products() {
  const dataDetails = useSelector(selectDataDetails);

  return (
    <div className="container-fluid px-3 px-md-3 products-wrapper">
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
        <h1 className="h2">Products</h1>
        <div className="btn-toolbar mb-2 mb-md-0">
          <div className="btn-group me-2">
            <button type="button" className="btn btn-sm btn-outline-secondary">
              Share
            </button>
            <button type="button" className="btn btn-sm btn-outline-secondary">
              Export
            </button>
          </div>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-sm-9">
          <ErrorBoundary>
            <ProductList />
          </ErrorBoundary>
        </div>
        <aside className="col-sm-3">
          {dataDetails ? (
            <ErrorBoundary>
              <Product product={dataDetails} />
            </ErrorBoundary>
          ) : (
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Select a product to view</h5>
              </div>
            </div>
          )}

          <div className="mt-3">
            <AddProductForm />
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Products;
