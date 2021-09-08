import "./products.css";
import { useEffect, useState } from "react";
import AddProduct from "./components/add-product/add-product";
import Spinner from "../../components/spinner";
import ProductList from "./components/product-list";
import Product from "./components/product";
import useAuthManager from "../../../../../services/providers/auth";

function Products() {
  const [products, setProducts] = useState();
  const [isProductDeleted, productDeleted] = useState();
  const [isProductAdded, productAdded] = useState();
  const [isFetchingProducts, setFetchingProducts] = useState();
  const auth = useAuthManager();

  useEffect(() => {
    setFetchingProducts(true);
    productDeleted(null);

    auth
      .fetchData()
      .then((data) => {
        if (data.length !== 0) {
          setProducts(data);
        }
        setFetchingProducts(false);
      })
      .catch(() => {});

    // eslint-disable-next-line
  }, [isProductDeleted, isProductAdded]);

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
        {isFetchingProducts ? (
          <div className="col m-5 p-5">
            <Spinner>Loading products...</Spinner>
          </div>
        ) : (
          <>
            <div className="col-sm-9">
              <ProductList
                products={products}
                productDeleted={productDeleted}
                isDeletingProduct={isProductDeleted}
              />
            </div>
            <aside className="col-sm-3">
              <Product
                _id="612ac4ea1f126b0023574d9a"
                name="Product 1"
                code="SB123"
                price={375}
                description="Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Voluptatem eius fugiat cumque sint dicta, dolorum voluptates
                minima eos praesentium corrupti possimus optio."
              />
            </aside>
          </>
        )}
      </div>

      <div className="row mt-3 m-0 w-100">
        <AddProduct updateProducts={productAdded} />
      </div>
    </div>
  );
}

export default Products;
