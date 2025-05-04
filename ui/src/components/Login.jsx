import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { apiUrlUser } from "../ApiUrl";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [output, setOutput] = useState("");
  const navigate = useNavigate();
  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: "", password: "" };

    if (!email) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "Password is required.";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const userDetail = { email, password };

        const response = await axios.post(apiUrlUser + "login", userDetail);
        const userData = response.data.users;

        localStorage.setItem("token", response.data.token);
        localStorage.setItem("_id", userData._id);
        localStorage.setItem("name", userData.name);
        localStorage.setItem("email", userData.email);
        localStorage.setItem("password", userData.password);
        localStorage.setItem("mobile", userData.mobile);
        localStorage.setItem("city", userData.city);
        localStorage.setItem("address", userData.address);
        localStorage.setItem("gender", userData.gender);
        localStorage.setItem("info", userData.info);
        localStorage.setItem("role", userData.role);
        localStorage.setItem("status", userData.status);
        localStorage.setItem("credits", userData.credits);
        userData.role === "admin" ? navigate("/admin") : navigate("/user");
      } catch (error) {
        console.error("Error logging in:", error);

        setOutput(
          "Email or password are incorrect, or please verify your account."
        );
        setEmail("");
        setPassword("");
      }
    } else {
      console.log("Validation failed. Fix the errors and try again.");
    }
  };

  return (
    <div className="p-6 bg-gray-100 flex items-center justify-center">
      <div className="container max-w-screen-lg mx-auto">
        <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6 animate-fade-in delay-500 fade-in-delay">
          <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
            <div className="text-gray-600 ">
              <p className="font-medium text-lg">Login</p>
              <p>Please enter your credentials.</p>
              <img
                src="characterpose25.png"
                alt="Character sitting with laptop"
                className="mt-6 text-xl"
              />
            </div>

            <div className="lg:col-span-2">
              <h1 className=" text-gray-800 font-medium text-3xl mb-11">
                Welcome Back!!!
              </h1>
              <form
                className="grid gap-4 gap-y-2 text-sm grid-cols-1"
                onSubmit={handleSubmit}
              >
                {/* Output Message */}
                {output && (
                  <div className="md:col-span-5">
                    <p className="text-red-500 text-xs mb-1">{output}</p>
                  </div>
                )}
                {/* Email */}
                <div className="md:col-span-5">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                    placeholder="email@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div className="md:col-span-5">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="md:col-span-5 text-center mt-4">
                  <div className="inline-flex items-end">
                    <button
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Login
                    </button>
                  </div>
                </div>
              </form>
              {/* or  */}
              <div className="my-4 flex items-center gap-4">
                <hr className="w-full border-gray-300" />
                <p className="text-sm text-gray-800 text-center">or</p>
                <hr className="w-full border-gray-300" />
              </div>
              {/* Google Link */}
              <button
                type="button"
                className="w-full flex items-center justify-center gap-4 py-3 px-6 text-sm tracking-wide text-gray-800 border border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100 focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20px"
                  className="inline"
                  viewBox="0 0 512 512"
                >
                  <path
                    fill="#fbbd00"
                    d="M120 256c0-25.367 6.989-49.13 19.131-69.477v-86.308H52.823C18.568 144.703 0 198.922 0 256s18.568 111.297 52.823 155.785h86.308v-86.308C126.989 305.13 120 281.367 120 256z"
                    data-original="#fbbd00"
                  />
                  <path
                    fill="#0f9d58"
                    d="m256 392-60 60 60 60c57.079 0 111.297-18.568 155.785-52.823v-86.216h-86.216C305.044 385.147 281.181 392 256 392z"
                    data-original="#0f9d58"
                  />
                  <path
                    fill="#31aa52"
                    d="m139.131 325.477-86.308 86.308a260.085 260.085 0 0 0 22.158 25.235C123.333 485.371 187.62 512 256 512V392c-49.624 0-93.117-26.72-116.869-66.523z"
                    data-original="#31aa52"
                  />
                  <path
                    fill="#3c79e6"
                    d="M512 256a258.24 258.24 0 0 0-4.192-46.377l-2.251-12.299H256v120h121.452a135.385 135.385 0 0 1-51.884 55.638l86.216 86.216a260.085 260.085 0 0 0 25.235-22.158C485.371 388.667 512 324.38 512 256z"
                    data-original="#3c79e6"
                  />
                  <path
                    fill="#cf2d48"
                    d="m352.167 159.833 10.606 10.606 84.853-84.852-10.606-10.606C388.668 26.629 324.381 0 256 0l-60 60 60 60c36.326 0 70.479 14.146 96.167 39.833z"
                    data-original="#cf2d48"
                  />
                  <path
                    fill="#eb4132"
                    d="M256 120V0C187.62 0 123.333 26.629 74.98 74.98a259.849 259.849 0 0 0-22.158 25.235l86.308 86.308C162.883 146.72 206.376 120 256 120z"
                    data-original="#eb4132"
                  />
                </svg>
                Continue with google
              </button>
              {/* Github Link */}
              <button
                type="button"
                className="w-full flex items-center justify-center gap-4 py-3 mt-4 px-6 text-sm tracking-wide text-gray-800 border border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100 focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="mr-2"
                  viewBox="0 0 1792 1792"
                >
                  <path d="M896 128q209 0 385.5 103t279.5 279.5 103 385.5q0 251-146.5 451.5t-378.5 277.5q-27 5-40-7t-13-30q0-3 .5-76.5t.5-134.5q0-97-52-142 57-6 102.5-18t94-39 81-66.5 53-105 20.5-150.5q0-119-79-206 37-91-8-204-28-9-81 11t-92 44l-38 24q-93-26-192-26t-192 26q-16-11-42.5-27t-83.5-38.5-85-13.5q-45 113-8 204-79 87-79 206 0 85 20.5 150t52.5 105 80.5 67 94 39 102.5 18q-39 36-49 103-21 10-45 15t-57 5-65.5-21.5-55.5-62.5q-19-32-48.5-52t-49.5-24l-20-3q-21 0-29 4.5t-5 11.5 9 14 13 12l7 5q22 10 43.5 38t31.5 51l10 23q13 38 44 61.5t67 30 69.5 7 55.5-3.5l23-4q0 38 .5 88.5t.5 54.5q0 18-13 30t-40 7q-232-77-378.5-277.5t-146.5-451.5q0-209 103-385.5t279.5-279.5 385.5-103zm-477 1103q3-7-7-12-10-3-13 2-3 7 7 12 9 6 13-2zm31 34q7-5-2-16-10-9-16-3-7 5 2 16 10 10 16 3zm30 45q9-7 0-19-8-13-17-6-9 5 0 18t17 7zm42 42q8-8-4-19-12-12-20-3-9 8 4 19 12 12 20 3zm57 25q3-11-13-16-15-4-19 7t13 15q15 6 19-6zm63 5q0-13-17-11-16 0-16 11 0 13 17 11 16 0 16-11zm58-10q-2-11-18-9-16 3-14 15t18 8 14-14z"></path>
                </svg>
                Sign in with GitHub
              </button>

              {/* Register Link */}
              <div className="md:col-span-5 text-center mt-4">
                <p className="text-gray-600">
                  Don't have an account?{" "}
                  <span className="text-blue-500 hover:underline font-medium">
                    <Link to="/register">Register</Link>
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
