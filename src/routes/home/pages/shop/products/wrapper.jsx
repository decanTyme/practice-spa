import "./products.css";
import AddProductForm from "./components/add-product/AddProductForm";
import ProductList from "./components/product-list";
import Product from "./components/product";
import useDataService from "../../../../../services/providers/data";
import ErrorBoundary from "../../../../components/ErrorBoundary";

function Products() {
  const ds = useDataService();

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
          {ds.data ? (
            <ErrorBoundary>
              <Product
                _id={ds.data._id}
                brand={ds.data.brand}
                name={ds.data.name}
                code={ds.data.code}
                class={ds.data.class}
                category={ds.data.category}
                price={ds.data.price}
                inStock={ds.data.quantity}
                description="Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Voluptatem eius fugiat cumque sint dicta, dolorum voluptates
                minima eos praesentium corrupti possimus optio."
              />
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