import { Link } from "@remix-run/react";

export default function Header({ user }) {
  return (
    <nav>
      {user ? (
        <form action="/logout" method="post">
          <button type="submit" className="button">
            Logout
          </button>
        </form>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </nav>
  )
}