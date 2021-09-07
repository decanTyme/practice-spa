import "./reports.css";
import Masonry from "react-masonry-component";
function Reports() {
  return (
    <div className="container-fluid reports-wrapper">
      <h1 className="h2">Reports</h1>
      <hr className="mb-3" />
      {/* BUG After a redirect from another page, masonry doesn't work unless page is refreshed */}
      <div className="row">
        <Masonry options={{ columnWidth: 10 }}>
          <div className="card me-2 mb-2 w-25">
            <div className="card-body">
              <h5 className="card-title">Card title</h5>
              <p className="card-text">
                This is another card with title and supporting text below. This
                card has some additional content to make it slightly taller
                overall.
              </p>
              <p className="card-text">
                <small className="text-muted">Last updated 3 mins ago</small>
              </p>
            </div>
          </div>
          <div className="card me-2 mb-2 w-25">
            <figure className="p-3 mb-0">
              <blockquote className="blockquote">
                <p>A well-known quote, contained in a blockquote element.</p>
              </blockquote>
              <figcaption className="blockquote-footer mb-0 text-muted">
                Someone famous in
                <cite title="Source Title">Source Title</cite>
              </figcaption>
            </figure>
          </div>
          <div className="card me-2 mb-2 mb-4">
            <svg
              className="bd-placeholder-img card-img-top"
              width="100%"
              height="200"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="Placeholder: Image cap"
              preserveAspectRatio="xMidYMid slice"
              focusable="false"
            >
              <title>Placeholder</title>
              <rect width="100%" height="100%" fill="#868e96"></rect>
              <text x="50%" y="50%" fill="#dee2e6" dy=".3em">
                Image cap
              </text>
            </svg>

            <div className="card-body">
              <h5 className="card-title">Card title</h5>
              <p className="card-text">
                This card has supporting text below as a natural lead-in to
                additional content.
              </p>
              <p className="card-text">
                <small className="text-muted">Last updated 3 mins ago</small>
              </p>
            </div>
          </div>
          <div className="card bg-primary text-white text-center p-3 me-2 mb-2">
            <figure className="mb-0">
              <blockquote className="blockquote">
                <p>A well-known quote, contained in a blockquote element.</p>
              </blockquote>
              <figcaption className="blockquote-footer mb-0 text-white">
                Someone famous in <cite title="Source Title">Source Title</cite>
              </figcaption>
            </figure>
          </div>
          <div className="card text-center me-2 mb-2">
            <div className="card-body">
              <h5 className="card-title">Card title</h5>
              <p className="card-text">
                This card has a regular title and short paragraph of text below
                it.
              </p>
              <p className="card-text">
                <small className="text-muted">Last updated 3 mins ago</small>
              </p>
            </div>
          </div>
          <div className="card me-2 mb-2">
            <svg
              className="bd-placeholder-img card-img"
              width="100%"
              height="260"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="Placeholder: Card image"
              preserveAspectRatio="xMidYMid slice"
              focusable="false"
            >
              <title>Placeholder</title>
              <rect width="100%" height="100%" fill="#868e96"></rect>
              <text x="50%" y="50%" fill="#dee2e6" dy=".3em">
                Card image
              </text>
            </svg>
          </div>
          <div className="card me-2 mb-2 p-3 text-end">
            <figure className="mb-0">
              <blockquote className="blockquote">
                <p>A well-known quote, contained in a blockquote element.</p>
              </blockquote>
              <figcaption className="blockquote-footer mb-0 text-muted">
                Someone famous in <cite title="Source Title">Source Title</cite>
              </figcaption>
            </figure>
          </div>
          <div className="card me-2 mb-2">
            <div className="card-body">
              <h5 className="card-title">Card title</h5>
              <p className="card-text">
                This is another card with title and supporting text below. This
                card has some additional content to make it slightly taller
                overall.
              </p>
              <p className="card-text">
                <small className="text-muted">Last updated 3 mins ago</small>
              </p>
            </div>
          </div>
        </Masonry>
      </div>
    </div>
  );
}

export default Reports;
