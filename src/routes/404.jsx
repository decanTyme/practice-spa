import img404 from "../assets/404_error_message.png";
import { Link } from "react-router-dom";
import useRouter from "../services/hooks/use-router";
import { useSelector } from "react-redux";
import { selectAuthCurrentState } from "../app/state/slices/auth";

function NotFound() {
  const router = useRouter();
  const state = useSelector(selectAuthCurrentState);
  const location = state.isLoggedIn ? "/dashboard" : "/login";

  return (
    <div className="container h-100 d-flex align-items-center">
      <div className="row mx-auto text-center">
        <img src={img404} alt="404 Not found!" className="img-fluid" />

        <Link
          to="#"
          className="text-decoration-none mt-2"
          style={{ color: "#685ACC" }}
          onClick={() => router.replace(location, { is404: false })}
        >
          <h5>Take me home!</h5>
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
