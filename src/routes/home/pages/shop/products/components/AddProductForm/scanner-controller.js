import { BrowserCodeReader, BrowserMultiFormatReader } from "@zxing/browser";

let instance = null;
class ScannerController {
  constructor(previewElem, setter) {
    if (!instance) {
      instance = this;
    }

    this.setter = setter;
    this.previewElem = document.querySelector(previewElem);

    this.reader = new BrowserMultiFormatReader();
    return instance;
  }

  async initGetInputDevices() {
    const videoInputDevices = await BrowserCodeReader.listVideoInputDevices();
    return videoInputDevices;
  }

  async initScanner(deviceNum, closeScannerEvent) {
    const videoInputDevices = await this.initGetInputDevices();
    const selectedDeviceId = videoInputDevices[deviceNum].deviceId;

    // Get the controls for stopping stream
    const controls = await this.reader.decodeFromVideoDevice(
      selectedDeviceId,
      this.previewElem,
      (data, error, controls) => {
        if (data?.text) {
          controls.stop();
          this.setter({
            text: data.text,
            timestamp: data.timestamp,
            hasDataFound: true,
            canRestart: true,
          });
        } else {
          this.setter({
            canRestart: false,
            hasDataFound: false,
          });
        }
      }
    );
    return controls;
  }
}

export default ScannerController;
