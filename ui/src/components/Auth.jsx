/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Auth() {
  const navigate = useNavigate();
  useEffect(() => {
    const path = window.location.pathname;
    const role = localStorage.getItem("role");

    const userAllowedPaths = ["/user", "/user/profile", "/user/credits"];
    const adminAllowedPaths = ["/admin"];

    const isUserAllowedPath = userAllowedPaths.some(
      (allowedPath) =>
        path === allowedPath || path.startsWith(allowedPath + "/")
    );
    const isAdminAllowedPath = adminAllowedPaths.some(
      (allowedPath) =>
        path === allowedPath || path.startsWith(allowedPath + "/")
    );

    if (role === "admin") {
      if (
        path === "/" ||
        path === "/login" ||
        path === "/register" ||
        !isAdminAllowedPath
      ) {
        navigate("/admin");
      }
    } else if (role === "user") {
      if (
        path === "/" ||
        path === "/login" ||
        path === "/register" ||
        !isUserAllowedPath
      ) {
        navigate("/user");
      }
    } else {
      if (
        path === "/" ||
        path === "/admin" ||
        path === "/user" ||
        isAdminAllowedPath ||
        isUserAllowedPath
      ) {
        navigate("/register");
      }
    }
  }, []);

  return <></>;
}
export default Auth;
