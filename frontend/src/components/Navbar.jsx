import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";

function Navbar() {
  const navigate = useNavigate();
  const [username, setUsername] = useState(null);

  async function logout() {
    localStorage.removeItem("token");
    await navigate("/");
  }

  useEffect(() => {
    fetch("/getUsername", {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((data) => (data.isLoggedIn ? setUsername(data.username) : null));
  }, []);

  return (
    <nav className="navbar navbar-dark bg-dark">
      <Link className="navbar-brand" to="/">
        EHR
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarText"
        aria-controls="navbarText"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarText">
        {username ? (
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              {username[0] === "D" ? (
                <Link to="/doctor/home" className="nav-link">
                  Profile
                </Link>
              ) : (
                <Link to="/patient/home" className="nav-link">
                  Profile
                </Link>
              )}
            </li>
            <li className="nav-item active">
              <button onClick={logout}>Logout</button>
            </li>
          </ul>
        ) : (
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <Link to="/" className="nav-link">
                Login
              </Link>
            </li>
            <li className="nav-item active">
              <Link to="/signUp" className="nav-link">
                Register
              </Link>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
