import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { apiUrlUser } from "../ApiUrl";
import { useNavigate } from "react-router-dom";
export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Please enter your name.";
    if (!email.trim()) newErrors.email = "Please enter your email.";
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Invalid email format.";
    if (!password.trim()) newErrors.password = "Please enter your password.";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    const userDetail = {
      name,
      email,
      password,
    };

    try {
      const response = await axios.post(apiUrlUser + "save", userDetail);
      console.log("User registered successfully:", response.data);
      alert("Registration successful!");
      setName("");
      setEmail("");
      setPassword("");

      navigate("/login");
    } catch (error) {
      console.error("Error registering user:", error);
      alert("Registration failed. Please try again.");
      setName("");
      setEmail("");
      setPassword("");
    }
  };

  return (
    <div className="p-6 bg-gray-100 flex items-center justify-center m-0">
      <div className="container max-w-screen-lg mx-auto">
        <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
          <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
            <div className="text-gray-600">
              <p className="font-medium text-lg">Personal Details</p>
              <p>Please fill out all the fields.</p>
              <img
                className="mt-2 h-60 w-60"
                src="characterpose21.png"
                alt="character"
              />
            </div>

            <form className="lg:col-span-2" onSubmit={handleSubmit}>
              <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
                <div className="md:col-span-5">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm">{errors.name}</p>
                  )}
                </div>

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
                    <p className="text-red-500 text-sm">{errors.email}</p>
                  )}
                </div>

                <div className="md:col-span-5">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                    placeholder="Enter a secure password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm">{errors.password}</p>
                  )}
                </div>

                <div className="md:col-span-5 mt-4 text-center">
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Register
                  </button>
                </div>
              </div>
            </form>

            <div className="md:col-span-5 text-center mt-4">
              <p className="text-gray-600">
                Already have an account?{" "}
                <span className="text-blue-500 hover:underline font-medium">
                  <Link to="/login">Login</Link>
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
