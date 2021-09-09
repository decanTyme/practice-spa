import { Link } from "react-router-dom";
import useRouter from "../services/hooks/use-router";

function NotFoundPage(props) {
  const router = useRouter();

  return (
    <div className="h-100 d-flex align-items-center">
      <div className="mx-auto text-center">
        <h1 className="mb-5">404 Page not found</h1>
        <Link
          to="#"
          className="text-decoration-none mt-5"
          onClick={() => router.replace("/")}
        >
          <h5>Go home</h5>
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
