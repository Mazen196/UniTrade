import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();
  return (
    <div className="hero">
      <p className="kicker">CAMPUS MARKETPLACE</p>
      <h1>Buy and sell with students on your campus</h1>
      <p className="lead">
        Textbooks, electronics and supplies - all in one place, with ratings you can trust.
      </p>
      {user ? (
        <p className="welcome">Welcome back, {user.name.split(" ")[0]}!</p>
      ) : (
        <div className="hero-actions">
          <Link to="/register" className="btn btn-primary">Get started</Link>
          <Link to="/login" className="btn btn-outline">Login</Link>
        </div>
      )}
    </div>
  );
}
