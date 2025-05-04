import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { apiUrlUser } from "../ApiUrl";

export default function ProfileUpdate() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [gender, setGender] = useState("");
  const [profileCompleted, setProfileCompleted] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("_id");
    if (!userId) {
      navigate("/login");
      return;
    }

    const sanitize = (value) =>
      value === "undefined" || value === null ? "" : value;

    setName(sanitize(localStorage.getItem("name")));
    setEmail(sanitize(localStorage.getItem("email")));
    setMobile(sanitize(localStorage.getItem("mobile")));
    setAddress(sanitize(localStorage.getItem("address")));
    setCity(sanitize(localStorage.getItem("city")));
    setGender(sanitize(localStorage.getItem("gender")));
    setProfileCompleted(localStorage.getItem("profileCompleted") === "true");
    setLoading(false);
  }, [navigate]);

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Please enter your name.";
    if (!email.trim()) newErrors.email = "Please enter your email.";
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Invalid email format.";
    if (!mobile.trim()) newErrors.mobile = "Please enter your mobile number.";
    else if (!/^\d{10}$/.test(mobile))
      newErrors.mobile = "Mobile number must be 10 digits.";
    if (!address.trim()) newErrors.address = "Please enter your address.";
    if (!city.trim()) newErrors.city = "Please enter your city.";
    if (!gender) newErrors.gender = "Please select your gender.";
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
    const userId = localStorage.getItem("_id");

    try {
      await axios.patch(apiUrlUser + "update", {
        condition_obj: { _id: userId },
        content_obj: {
          name,
          email,
          mobile,
          address,
          city,
          gender,
        },
      });

      if (!profileCompleted) {
        const completeResponse = await axios.post(
          apiUrlUser + "complete-profile",
          { userId }
        );

        if (completeResponse.data.user) {
          localStorage.setItem("credits", completeResponse.data.user.credits);
          localStorage.setItem("profileCompleted", "true");
          setProfileCompleted(true);
          setNotification({
            message:
              "Profile updated successfully! You earned 20 credits for completing your profile!",
            type: "success",
          });
        }
      } else {
        setNotification({
          message: "Profile updated successfully!",
          type: "success",
        });
      }

      localStorage.setItem("name", name);
      localStorage.setItem("email", email);
      localStorage.setItem("mobile", mobile);
      localStorage.setItem("address", address);
      localStorage.setItem("city", city);
      localStorage.setItem("gender", gender);
    } catch (error) {
      console.error("Error updating profile:", error);
      setNotification({
        message: "Failed to update profile. Please try again.",
        type: "error",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 flex items-center justify-center m-0">
      <div className="container max-w-screen-lg mx-auto">
        <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
          {notification.message && (
            <div
              className={`p-4 mb-4 rounded-md ${
                notification.type === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {notification.message}
            </div>
          )}

          <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
            <div className="text-gray-600">
              <p className="font-medium text-lg">Update Profile</p>
              <p>Complete your profile to earn 20 credits!</p>
              {profileCompleted ? (
                <div className="mt-4 p-2 bg-green-100 text-green-700 rounded-md">
                  <p className="font-medium">Profile Completed! ✓</p>
                  <p className="text-sm">
                    You've earned your profile completion bonus.
                  </p>
                </div>
              ) : (
                <div className="mt-4 p-2 bg-yellow-100 text-yellow-700 rounded-md">
                  <p className="font-medium">Profile Incomplete</p>
                  <p className="text-sm">
                    Fill in all fields to earn 20 credits!
                  </p>
                </div>
              )}
              <img
                className="mt-2 h-60 w-60"
                src="/public/characterpose22.png"
                alt="character"
              />
            </div>

            <form className="lg:col-span-2" onSubmit={handleSubmit}>
              <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
                <div className="md:col-span-5">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
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
                    id="email"
                    className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                    placeholder="email@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    readOnly
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Email cannot be changed
                  </p>
                  {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email}</p>
                  )}
                </div>

                <div className="md:col-span-5">
                  <label htmlFor="mobile">Mobile Number</label>
                  <input
                    type="text"
                    id="mobile"
                    className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                    placeholder="Enter your 10-digit mobile number"
                    value={mobile}
                    maxLength={10}
                    onChange={(e) => {
                      const input = e.target.value;

                      if (/^\d*$/.test(input)) {
                        setMobile(input);
                      }
                    }}
                  />
                  {mobile && mobile.length !== 10 && (
                    <p className="text-red-500 text-sm">
                      Mobile number should be exactly 10 digits.
                    </p>
                  )}
                </div>

                <div className="md:col-span-5">
                  <label htmlFor="address">Address</label>
                  <textarea
                    id="address"
                    className="h-20 border mt-1 rounded px-4 py-2 w-full bg-gray-50"
                    placeholder="Enter your address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm">{errors.address}</p>
                  )}
                </div>

                <div className="md:col-span-3">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                    placeholder="Enter your city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm">{errors.city}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="gender">Gender</label>
                  <select
                    id="gender"
                    className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.gender && (
                    <p className="text-red-500 text-sm">{errors.gender}</p>
                  )}
                </div>

                <div className="md:col-span-5 mt-4 text-center">
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Update Profile
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
