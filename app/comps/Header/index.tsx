import { Link } from "@remix-run/react";

export default function Header({ user }) {
  return (
    <nav>
      {user ? (
        <form action="/logout" method="post">
          <button type="submit" className="button">
            Sign out
          </button>
        </form>
      ) : (
        <Link to="/login">Sign in</Link>
      )}
    </nav>
  )
}