import { useCookies } from "react-cookie";
import { useEffect } from "react";

export default function Home() {
  const [cookie, setCookie] = useCookies();

  useEffect(() => {
    if (!cookie.email) {
      window.location.href = "/login";
    } else {
      if (cookie.isAdmin === "1") {
        window.location.href = "/admin";
      } else {
        window.location.href = "projetos";
      }
    }
  });

  return (
    <>
      <div>{cookie.email}</div>
    </>
  );
}
