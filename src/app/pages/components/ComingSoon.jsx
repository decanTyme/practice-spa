import { isDesktop } from "react-device-detect";
import comingSoonImg from "../../../assets/coming_soon.png";

function Soon() {
  return (
    <div
      className="d-flex align-items-center align-self-center"
      style={{ height: "90vh" }}
    >
      <div className="mx-auto my-5 py-5 text-center">
        <img
          src={comingSoonImg}
          className="img-fluid"
          style={{ maxWidth: isDesktop ? "80vh" : "" }}
          alt="Coming soon!"
        />
      </div>
    </div>
  );
}

export default Soon;
