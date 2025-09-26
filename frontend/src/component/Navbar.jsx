import { useState } from "react";

function Navbar(){

    const [searchTerm, setSearchTerm] = useState('');



    return(
        <>
            <header className="bg-white shadow-sm py-3">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-4">
              <div className="d-flex align-items-center">
                <i className="fas fa-star purple-accent me-2 fs-3"></i>
                <h2 className="mb-0" color="">
                  Review& <span className="fw-bold">RATE</span>
                </h2>
              </div>
            </div>
            <div className="col-md-4">
              <div className="position-relative">
                <input
                  type="text"
                  className="form-control search-input"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <i className="fas fa-search position-absolute top-50 end-0 translate-middle-y me-3 purple-accent"></i>
              </div>
            </div>
            <div className="col-md-4 text-end">
              <div className="d-flex justify-content-end gap-3">
                <button className="btn btn-link text-decoration-none purple-accent p-0">SignUp</button>
                <button className="btn btn-link text-decoration-none purple-accent p-0">Login</button>
              </div>
            </div>
          </div>
        </div>
      </header>
        </>
    )
}
export default Navbar