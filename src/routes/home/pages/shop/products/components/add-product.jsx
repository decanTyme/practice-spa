import { useState } from "react";
import HttpService from "../../../../../../services/http";
import StatefulButton from "../../../components/button-stateful";
import Modal from "../../../../components/modals/modal";
import { Modal as BootstrapModal } from "bootstrap";
import { BrowserCodeReader, BrowserMultiFormatReader } from "@zxing/browser";

const DEF_SCANNER_TEXT =
  "Please position the camera properly until a code is found.";
function AddProduct(props) {
  const [product, setProduct] = useState({
    name: "",
    code: "",
    class: "",
    category: "",
    quantity: 0,
    price: 0,
    salePrice: 0,
  });
  const [disable, disableOn] = useState(false);
  const [scannedData, setScanData] = useState({
    text: DEF_SCANNER_TEXT,
    canRestart: null,
    hasDataFound: false,
  });
  const http = HttpService();

  const onSubmit = async (e) => {
    e.preventDefault();
    setTimeout(() => {
      disableOn({ id: "submitBtn" });
    }, 5);
    const response = await http.pushItem(product);
    if (response?.success) {
      props.updateProducts(response.product);
    }
    disableOn(false);
  };

  const handleChangeOn = (e) => {
    const name = e.target.name,
      value = e.target.value;
    setProduct({
      name: name === "name" ? value : product.name,
      code: name === "code" ? value : product.code,
      class: name === "class" ? value : product.class,
      category: name === "category" ? value : product.category,
      quantity: name === "quantity" ? value : product.quantity,
      price: name === "price" ? value : product.price,
      salePrice: name === "salePrice" ? value : product.salePrice,
    });
  };

  const onClear = () => {
    setTimeout(() => {
      disableOn({ id: "resetBtn" });
    }, 5);
    setProduct({
      name: "",
      code: "",
      class: "",
      category: "",
      quantity: 0,
      price: 0,
      salePrice: 0,
    });
    setTimeout(() => disableOn(false), 3000);
  };

  const initScanner = async (
    deviceNum,
    previewElem,
    setter,
    closeScannerEvent
  ) => {
    const reader = new BrowserMultiFormatReader();
    const videoInputDevices = await BrowserCodeReader.listVideoInputDevices();
    const selectedDeviceId = videoInputDevices[deviceNum].deviceId;

    setter({ text: DEF_SCANNER_TEXT, hasDataFound: false });
    const controls = await reader.decodeFromVideoDevice(
      selectedDeviceId,
      previewElem,
      (data, error, controls) => {
        if (data?.text) {
          controls.stop();
          setter({
            text: data.text,
            timestamp: data.timestamp,
            hasDataFound: true,
            canRestart: true,
          });
        }
      }
    );

    // Stop the scanner when the user closes the modal
    window.addEventListener(closeScannerEvent, () => {
      controls.stop();
      setter({ text: null, canRestart: false });
    });

    return controls;
  };

  const scannerStart = async () => {
    setScanData({
      text: DEF_SCANNER_TEXT,
      canRestart: null,
      hasDataFound: false,
    });

    // Initialize scanner
    setTimeout(() => {
      initScanner(
        1,
        document.querySelector("#scannerPrev video"),
        setScanData,
        "hidden.bs.modal"
      );
    }, 50);
  };

  const onQrBtnClick = async () => {
    const scannerModal = new BootstrapModal(
      document.getElementById("scannerMenu", { keyboard: true })
    );

    scannerModal.show();
    await scannerStart();
  };

  return (
    <div className="border p-4">
      <h3 className="text-center">Add a Product</h3>
      <form onSubmit={onSubmit}>
        <div className="row g-2 mt-3">
          <div className="col">
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Product Name"
              onChange={handleChangeOn}
              disabled={disable?.id === "submitBtn" || disable?.id === "all"}
              required
            />
          </div>
          <div className="col-sm-3">
            <input
              type="text"
              name="code"
              className="form-control"
              placeholder="Code"
              onChange={handleChangeOn}
              disabled={disable?.id === "submitBtn" || disable?.id === "all"}
              required
            />
          </div>
        </div>
        <div className="row g-2 mt-1">
          <div className="col">
            <input
              required
              type="text"
              className="form-control"
              placeholder="Class"
              name="class"
              onChange={handleChangeOn}
              disabled={disable?.id === "submitBtn" || disable?.id === "all"}
            />
          </div>
          <div className="col">
            <input
              required
              type="text"
              className="form-control"
              placeholder="Category"
              name="category"
              onChange={handleChangeOn}
              disabled={disable?.id === "submitBtn" || disable?.id === "all"}
            />
          </div>
          <div className="col-sm-2">
            <input
              required
              type="number"
              className="form-control"
              placeholder="Quantity"
              name="quantity"
              onChange={handleChangeOn}
              disabled={disable?.id === "submitBtn" || disable?.id === "all"}
            />
          </div>
          <div className="col-sm-2">
            <input
              required
              type="number"
              className="form-control"
              placeholder="Price"
              name="price"
              onChange={handleChangeOn}
              disabled={disable?.id === "submitBtn" || disable?.id === "all"}
            />
          </div>
          <div className="col-sm-3">
            <input
              type="number"
              className="form-control"
              placeholder="(Optional) Sale Price"
              name="salePrice"
              onChange={handleChangeOn}
              disabled={disable?.id === "submitBtn" || disable?.id === "all"}
            />
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-md-12">
            <div className="d-flex flex-row justify-content-end">
              <button
                id="qrBtn"
                type="button"
                className="btn btn-secondary mx-1"
                onClick={onQrBtnClick}
              >
                <i className="fa fa-qrcode"></i>
              </button>
              <button
                id="resetBtn"
                type="reset"
                className="btn btn-secondary mx-1"
                disabled={disable?.id === "resetBtn" || disable}
                onClick={onClear}
              >
                Reset
              </button>
              <StatefulButton
                id="submitBtn"
                className="btn btn-success mx-1"
                role="status"
                disabled={disable?.id === "submitBtn" || disable?.id === "all"}
                onStatefulClick={onSubmit}
              >
                Save
              </StatefulButton>
            </div>
          </div>
        </div>
      </form>

      {/* QR Menu Modal */}
      <Modal
        id="scannerMenu"
        title="Scan a QR or Barcode"
        fade={true}
        body={
          <div id="scannerPrev">
            {scannedData?.hasDataFound ? (
              <div className="p-2">
                <h6>Scan complete</h6>
                <p className="">Data: {scannedData.text}</p>
                <p>
                  Scanned on: {new Date(scannedData.timestamp).toUTCString()}
                </p>
              </div>
            ) : (
              <div>
                <video className="w-100 h-100 border"></video>
                <p>{scannedData.text}</p>
              </div>
            )}
          </div>
        }
        footer={
          <>
            {scannedData?.canRestart ? (
              <button
                id="restartScannerBtn"
                className="btn btn-dark"
                onClick={scannerStart}
              >
                Restart
              </button>
            ) : (
              ""
            )}
            <button
              type="reset"
              className="btn btn-primary"
              data-bs-dismiss="modal"
            >
              Dismiss
            </button>
          </>
        }
      />
    </div>
  );
}

export default AddProduct;
