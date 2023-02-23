import { Link } from "@remix-run/react";

type HeaderProps = {
  user: {
    id: string;
    username: string;
  };
};

export default function Header({ user }: HeaderProps) {
  return (
    <div className="app-header">
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

      <div className="app-header__slogan">
        <span className="slogan--highlight">Competitive sudoku</span>
        <span className="slogan">
          Where we can train our mind. Play with friends. May the force be with
          you!
        </span>
      </div>

      <div>
        {user?.username == "kody" ? (
          <form method="post" action="/">
            <button type="submit">Create game</button>
          </form>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
