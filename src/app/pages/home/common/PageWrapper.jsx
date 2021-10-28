import "./page-wrapper.css";

function PageWrapper({ children, pageTitle }) {
  return (
    <div className="container-fluid px-0 pb-5 page-wrapper">
      <div className="d-flex justify-content-between align-items-center pt-3 pb-2 px-3 mb-lg-2 sticky-top">
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

export default PageWrapper;
