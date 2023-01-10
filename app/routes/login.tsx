import type { ActionArgs, LinksFunction } from "@remix-run/node";
import { useActionData, useSearchParams } from "@remix-run/react";
import { useEffect, useRef } from "react";
import stylesUrl from "~/styles/login.css";
import { db } from "~/utils/db.server";
import { badRequest } from "~/utils/request.server";
import { createUserSession, login, register } from "~/utils/session.server";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesUrl },
];

function validateUsername(username: unknown) {
  if (typeof username !== "string" || username.length < 3) {
    return `Usernames must be at least 3 characters long`;
  }
}

function validatePassword(password: unknown) {
  if (typeof password !== "string" || password.length < 6) {
    return `Passwords must be at least 6 characters long`;
  }
}

function validateUrl(url: string | FormDataEntryValue) {
  let urls = ["/solo"];
  if (
    urls.findIndex((v) => {
      return (url + "").startsWith(v);
    }) != -1
  ) {
    return url;
  }
  return "/";
}

export const action = async ({ request }: ActionArgs) => {
  const form = await request.formData();
  const loginType = form.get("loginType");
  const username = form.get("username");
  const password = form.get("password");
  const redirectTo = validateUrl(form.get("redirectTo") || "/");
  if (
    typeof loginType !== "string" ||
    typeof username !== "string" ||
    typeof password !== "string" ||
    typeof redirectTo !== "string"
  ) {
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: `Form not submitted correctly.`,
    });
  }

  const fields = { loginType, username, password };
  const fieldErrors = {
    username: validateUsername(username),
    password: validatePassword(password),
  };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({
      fieldErrors,
      fields,
      formError: null,
    });
  }

  switch (loginType) {
    case "login": {
      // login to get the user
      // if there's no user, return the fields and a formError
      // if there is a user, create their session and redirect to /
      const user = await login({ username, password });
      if (!user) {
        return badRequest({
          fieldErrors: null,
          fields,
          formError: `Username/Password combination is incorrect`,
        });
      }

      return createUserSession(user.id, redirectTo);
    }
    case "register": {
      const userExists = await db.user.findFirst({
        where: { username },
      });
      if (userExists) {
        return badRequest({
          fieldErrors: null,
          fields,
          formError: `User with username ${username} already exists`,
        });
      }
      // create the user
      // create their session and redirect to /
      const user = await register({ username, password });
      if (!user) {
        return badRequest({
          fieldErrors: null,
          fields,
          formError: `Something went wrong trying to create a new user.`,
        });
      }
      return createUserSession(user.id, redirectTo);
    }
    default: {
      return badRequest({
        fieldErrors: null,
        fields,
        formError: `Login type invalid`,
      });
    }
  }
};

const colors = ["", "orange", "yellow", "green", "blue", "indigo", "violet"];

export default function Login() {
  const actionData = useActionData<typeof action>();
  const [searchParams] = useSearchParams();

  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gridRef.current && window) {
      const fn = (e: MouseEvent) => {
        // normalise touch/mouse
        e.preventDefault();
        let pos = [e.clientX, e.clientY];
        const h = window.innerHeight;
        const w = window.innerWidth;
        const ratioY = 60 / w;
        const ratioX = 60 / h;
        const rotY = pos[0] * ratioY - 30;
        const rotX = pos[1] * ratioX - 30;
        const transform = `
        transition: transform 0.5s ease-out;
        transform: translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateZ(0deg) skew(0deg, 0deg)
          rotateX(${-rotX}deg)
          rotateY(${rotY}deg)
        `;
        if (gridRef.current) {
          gridRef.current.setAttribute("style", transform);
        }
      };

      const fnMouseOut = () => {
        if (gridRef.current) {
          gridRef.current.setAttribute("style", "");
        }
      };

      window.addEventListener("mousemove", fn);
      window.addEventListener("mouseout", fnMouseOut);
      return () => {
        window.removeEventListener("mousemove", fn);
        window.removeEventListener("mouseout", fnMouseOut);
      };
    }
  }, [gridRef]);

  return (
    <div className="background-wrapper">
      <section className="container login-content">
        <div className="content">
          <h1>Sign in to Your Account</h1>
          <form method="post">
            <input type="hidden" name="loginType" value="login" />
            <input
              type="hidden"
              name="redirectTo"
              value={searchParams.get("redirectTo") ?? undefined}
            />
            <div className="login-field username">
              <label htmlFor="username-input">Username</label>
              <input
                type="text"
                id="username-input"
                name="username"
                defaultValue={actionData?.fields?.username}
                aria-invalid={Boolean(actionData?.fieldErrors?.username)}
                aria-errormessage={
                  actionData?.fieldErrors?.username
                    ? "username-error"
                    : undefined
                }
              />
              {actionData?.fieldErrors?.username ? (
                <p
                  className="form-validation-error"
                  role="alert"
                  id="username-error"
                >
                  {actionData.fieldErrors.username}
                </p>
              ) : null}
            </div>
            <div className="login-field password">
              <label htmlFor="password-input">Password</label>
              <input
                id="password-input"
                name="password"
                type="password"
                defaultValue={actionData?.fields?.password}
                aria-invalid={Boolean(actionData?.fieldErrors?.password)}
                aria-errormessage={
                  actionData?.fieldErrors?.password
                    ? "password-error"
                    : undefined
                }
              />
              {actionData?.fieldErrors?.password ? (
                <p
                  className="form-validation-error"
                  role="alert"
                  id="password-error"
                >
                  {actionData.fieldErrors.password}
                </p>
              ) : null}
            </div>
            <div id="form-error-message">
              {actionData?.formError ? (
                <p className="form-validation-error" role="alert">
                  {actionData.formError}
                </p>
              ) : null}
            </div>
            <button type="submit" className="button">
              Submit
            </button>
          </form>
        </div>
      </section>
      <aside className="login-aside"></aside>
    </div>
  );
}
