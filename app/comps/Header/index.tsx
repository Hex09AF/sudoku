import { Link } from "@remix-run/react";

export default function Header() {
  return (
    <nav>
      <Link to="/login">Login</Link>
    </nav>
  )
}