import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("_id");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    localStorage.removeItem("password");
    localStorage.removeItem("city");
    localStorage.removeItem("address");
    localStorage.removeItem("mobile");
    localStorage.removeItem("gender");
    localStorage.removeItem("info");
    localStorage.removeItem("role");
    localStorage.removeItem("status");
    localStorage.removeItem("credits");

    navigate("/login");
  });

  return <></>;
}
export default Logout;
