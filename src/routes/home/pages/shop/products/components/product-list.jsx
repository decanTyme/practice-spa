import { useState } from "react";
import useAuthManager from "../../../../../../services/providers/auth";
import StatefulButton from "../../../components/button-stateful";

function ProductList(props) {
  const [isDeleting, setIsDeleting] = useState();
  const auth = useAuthManager();

  const onDelete = (e) => {
    setIsDeleting(true);
    auth
      .removeData(e.target.dataset.key)
      .then((response) => {
        if (!response.error) {
          props.productDeleted(response);
        }
      })
      .finally(() => setIsDeleting(false));
  };

  const getProductList = () => {
    const list = props.products.map((product) => {
      return (
        <tr key={product._id}>
          <th scope="row" className="align-middle">
            {product.code}
          </th>
          <td className="align-middle">{product.name}</td>
          <td className="align-middle">{product.quantity}</td>
          <td className="align-middle">{product.price}</td>
          <td className="align-middle text-center">
            <StatefulButton
              key={product._id}
              itemId={product._id}
              className="btn btn-danger"
              role="status"
              disabled={isDeleting}
              onStatefulClick={onDelete}
            >
              Delete
            </StatefulButton>
          </td>
        </tr>
      );
    });
    return list;
  };

  return (
    <div className="products-list-wrapper">
      <table className="table table-hover">
        <thead>
          <tr>
            <th scope="col" className="align-bottom">
              #
            </th>
            <th scope="col" className="align-bottom">
              Product Name
            </th>
            <th scope="col" className="align-bottom">
              Quantity
            </th>
            <th scope="col" className="align-bottom">
              Price
            </th>
            <th scope="col" className="align-bottom text-center">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="mt-3">
          {props.products ? (
            getProductList()
          ) : (
            <tr>
              <td colSpan="5">
                <p className="text-center">No products found.</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ProductList;
