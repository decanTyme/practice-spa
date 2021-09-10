import videoPlaceholder from "../../../../../../../assets/qrbar2.png";
import { useLayoutEffect, useState } from "react";
import ModalMenu from "../../../../../components/modal/ModalMenu";
import ScannerController from "./scanner-controller";
import { Link } from "react-router-dom";

const DEF_SCANNER_TEXT =
  "Please position the camera properly until a code is found.";

function Scanner(props) {
  const [scannedData, setScanData] = useState({
    canRestart: false,
    hasDataFound: false,
  });
  const [camera, setCamera] = useState({ number: 1, label: "" });
  const [controller, setController] = useState(null);
  const [title, setTitle] = useState("Scan QR/Barcode");
  const [isDisabled, setDisabled] = useState(false);
  const [devices, setDevices] = useState(null);
  let currentDevice = camera;
  let currentController = controller;

  // eslint-disable-next-line
  useLayoutEffect(() => {
    if (scannedData?.hasDataFound) setTitle("Scan Complete");
    return () => {
      setTitle("Scan QR/Barcode");
    };
  });

  const scannerStart = async (deviceNum) => {
    /* Starts a new scanner instance */
    const scanner = new ScannerController(
      "#" + props.id + " video",
      setScanData
    );

    /**
     * Before the scanner starts, get the available video devices
     * and set it to the device selector.
     */
    const inputVideoDevices = await scanner.initGetInputDevices();
    setCamera({
      number: camera.number,
      label: inputVideoDevices[camera.number].label,
    });
    populateAvailableDevices(inputVideoDevices);

    /**
     * Finalize the scanner after putting the chosen device number
     * and set the controller state.
     */
    currentController = await scanner.initScanner(deviceNum);
    setController(currentController);
  };

  const populateAvailableDevices = (inputVideoDevices) => {
    const dropdownList = inputVideoDevices.map((device, index) => {
      return (
        <li key={device.deviceId}>
          <Link
            to="#"
            className={
              "dropdown-item" +
              (currentDevice.number === index ? " disabled" : "")
            }
            data-index={index}
            onClick={onChangeStream}
          >
            {[index] + ": " + device.label}
          </Link>
        </li>
      );
    });
    setDevices(dropdownList);
  };

  const onChangeStream = (e) => {
    setDisabled(true);
    currentDevice.number = parseInt(e.target.dataset.index);
    setCamera({ number: currentDevice.number });
    onScannerRestart();
  };

  const onScannerRestart = () => {
    stopScan();
    setTimeout(() => {
      scannerStart(currentDevice.number);
    }, 500);
    setTimeout(() => {
      setDisabled(false);
    }, 1000);
  };

  const stopScan = () => {
    currentController?.stop();
  };

  const onModalDismiss = () => {
    stopScan();
    setTimeout(() => {
      setController(null);
      setCamera({ number: 0 });
      setScanData({
        canRestart: false,
        hasDataFound: false,
      });
    }, 400);
  };

  return (
    <ModalMenu
      id={props.id}
      title={title}
      fade={true}
      static={true}
      size={{ fullscreen: true, modifier: "-sm-down" }}
      headerBtn={
        currentDevice?.label ? (
          <div className="dropdown" hidden={scannedData?.hasDataFound}>
            <button
              className="btn btn-secondary dropdown-toggle"
              type="button"
              id="deviceIdToggle"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              disabled={isDisabled}
            >
              {currentDevice?.label}
            </button>
            <ul className="dropdown-menu" aria-labelledby="deviceIdToggle">
              {devices}
            </ul>
          </div>
        ) : null
      }
      body={
        <>
          <div id="scannerPrev">
            {scannedData?.hasDataFound ? (
              <div className="p-2">
                <p className="">Data: {scannedData.text}</p>
                <p>
                  Scanned on: {new Date(scannedData.timestamp).toUTCString()}
                </p>
              </div>
            ) : null}

            <div hidden={scannedData?.hasDataFound}>
              <video
                className="w-100 h-100"
                poster={videoPlaceholder}
                muted
              ></video>
              <p>{DEF_SCANNER_TEXT}</p>
            </div>
          </div>
        </>
      }
      footer={
        <>
          {true ? (
            <button
              id="restartScannerBtn"
              className="btn btn-dark"
              onClick={onScannerRestart}
              disabled={isDisabled}
            >
              {controller ? "Restart" : "Start"}
            </button>
          ) : (
            ""
          )}
          <button
            type="reset"
            className="btn btn-primary"
            data-bs-dismiss="modal"
            onClick={onModalDismiss}
          >
            Dismiss
          </button>
        </>
      }
    />
  );
}
export default Scanner;
