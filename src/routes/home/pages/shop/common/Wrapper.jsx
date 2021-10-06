import "./page-wrapper.css";

function Wrapper({ children, pageTitle }) {
  return (
    <div className="container-fluid px-0 page-wrapper">
      <div className="d-flex justify-content-between align-items-center py-2 pt-3 px-3 mb-3 mt-2 sticky-top">
        <h1 className="h2">{pageTitle}</h1>
        <div className="btn-toolbar mb-2 mb-md-0">
          <div className="btn-group">
            <button type="button" className="btn btn-sm btn-outline-secondary">
              Share
            </button>
            <button type="button" className="btn btn-sm btn-outline-secondary">
              Export
            </button>
          </div>
        </div>
      </div>
      <div className="page-wrapper-viewport">{children}</div>
    </div>
  );
}

export default Wrapper;
