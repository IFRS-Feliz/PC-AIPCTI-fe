import { BrowserRouter as Router, Link } from "react-router-dom";

export default function Header() {
  return (
    <header>
      <Router>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </ul>
        </nav>
      </Router>
    </header>
  );
}
