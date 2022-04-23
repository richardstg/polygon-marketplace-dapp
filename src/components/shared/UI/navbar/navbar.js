import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav class="navbar navbar-expand-lg navbar-light bg-light p-3 container">
      <Link className="navbar-brand" to="/">
        HomeRenter
      </Link>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item m-2">
            <Link to="/">Start</Link>
          </li>
          <li class="nav-item m-2">
            <Link to="/rented">My Rented</Link>
          </li>
          <li class="nav-item m-2">
            <Link to="/new-add">New Add</Link>
          </li>
          <li class="nav-item m-2">
            <Link to="/listed">My Listed</Link>{" "}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
