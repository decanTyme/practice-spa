import { useSelector } from "react-redux";
import { selectNotifyQueue } from "../../../../state/slices/notification/selectors";
import Toasty from "./Toasty";

function ToastyWrapper() {
  const queuedNotifs = useSelector(selectNotifyQueue);

  return (
    <div
      className="position-fixed bottom-0 end-0 pb-2 ps-4 pe-xl-1 mx-3 mb-5 mb-xl-1 me-xl-2"
      style={{ zIndex: 9000, maxWidth: "100%" }}
    >
      <div className="toast-container">
        {queuedNotifs.map((data) => (
          <Toasty key={data.id} data={data} />
        ))}
      </div>
    </div>
  );
}

export default ToastyWrapper;
