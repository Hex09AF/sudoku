import { Link, useNavigate } from "@remix-run/react";
import { useRef } from "react";
import LookUp from "~/assets/svg/LookUp";

type HeaderProps = {
  user: {
    id: string;
    username: string;
  };
};

export default function Header({ user }: HeaderProps) {
  const navigate = useNavigate();
  const getRoomFormRef = useRef(null);

  const getRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (getRoomFormRef.current) {
      const data = new FormData(getRoomFormRef.current);
      const idRoom = data.get("idRoom");
      navigate(`/solo/${idRoom}`);
    }
  };

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

      <label className="app-header__findroom">
        <div style={{ flexShrink: 0 }}>
          <LookUp />
        </div>
        <form onSubmit={getRoom} ref={getRoomFormRef}>
          <input name="idRoom" placeholder="Find room..." />
        </form>
      </label>

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
