function Wrapper({ children, pageTitle }) {
  return (
    <div className="container-fluid px-3 products-wrapper">
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
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
      {children}
    </div>
  );
}

export default Wrapper;
