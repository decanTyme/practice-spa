import videoPlaceholder from "../../../../../../../assets/qrbar2.png";
import { useEffect, useState } from "react";
import ModalMenu from "../../../../../components/modal/ModalMenu";
import ScannerController from "./scanner-controller";
import { Link } from "react-router-dom";
import { addCode } from "app/state/reducers/data";
import { useDispatch } from "react-redux";

const DEF_SCANNER_TEXT =
  "Please position the camera properly until a code is found.";

function Scanner(props) {
  const dispatch = useDispatch();

  const [scanData, setScanData] = useState({
    canRestart: false,
    hasDataFound: false,
  });
  const [camera, setCamera] = useState({ number: 1 });
  const [controller, setController] = useState(null);
  const [title, setTitle] = useState("Scan QR/Barcode");
  const [disabled, setDisabled] = useState(false);
  const [availableDevices, setAvailableDevices] = useState();
  let currentDevice = camera;
  let currentController = controller;

  useEffect(() => {
    if (scanData?.hasDataFound) setTitle("Scan Complete");
    return () => {
      setTitle("Scan QR/Barcode");
    };
  }, [scanData]);

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
    setAvailableDevices(dropdownList);
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
    }, 100);
    setTimeout(() => {
      setDisabled(false);
    }, 1500);
  };

  const stopScan = () => {
    currentController?.stop();
  };

  const onCodeSave = () => {
    dispatch(addCode(scanData.text));
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
          <div className="dropdown" hidden={scanData?.hasDataFound}>
            <button
              className="btn btn-secondary dropdown-toggle"
              type="button"
              id="deviceIdToggle"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              disabled={disabled}
            >
              {currentDevice?.label}
            </button>
            <ul className="dropdown-menu" aria-labelledby="deviceIdToggle">
              {availableDevices}
            </ul>
          </div>
        ) : null
      }
      body={
        <>
          <div id="scannerPrev">
            {scanData?.hasDataFound ? (
              <div className="p-2">
                <p className="">Data: {scanData.text}</p>
                <p>Scanned on: {new Date(scanData.timestamp).toUTCString()}</p>
              </div>
            ) : null}

            <div hidden={scanData?.hasDataFound}>
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
          <button
            id="restartScannerBtn"
            className="btn btn-dark"
            onClick={onScannerRestart}
            disabled={disabled}
          >
            {controller ? "Restart" : "Start"}
          </button>

          {scanData?.hasDataFound ? (
            <button
              id="useCodeBtn"
              className="btn btn-success"
              data-bs-dismiss="modal"
              onClick={onCodeSave}
            >
              Use as S/N
            </button>
          ) : null}

          <button
            className="btn btn-primary"
            data-bs-dismiss="modal"
            onClick={onModalDismiss}
          >
            {scanData?.hasDataFound ? "Cancel" : "Dismiss"}
          </button>
        </>
      }
    />
  );
}
export default Scanner;
