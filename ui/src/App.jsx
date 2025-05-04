import { Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Logout from "./components/Logout";
import Home from "./components/Home";
import UserCreditDashboard from "./components/UserCreditDashboard";
import AdminCreditPanel from "./components/AdminCreditPanel";
import ProfileUpdate from "./components/ProfileUpdate";

function App() {
  return (
    <>
      <div className="h-screen flex flex-col">
        <Nav />

        <div className="flex-grow bg-gray-50">
          <Routes>
            <Route path="/user" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/admin" element={<AdminCreditPanel />} />
            <Route path="/user/credits" element={<UserCreditDashboard />} />

            <Route path="/user/profile" element={<ProfileUpdate />} />
            {/* <Route path="/admin" element={<Admin />} />
            <Route path="/user" element={<User />} />
           
            <Route path="/editprofileadmin" element={<EditProfile />} />
            <Route path="/cpadmin" element={<ChangePassword />} />
            <Route path="/addcategory" element={<AddCategory />} />
            <Route path="/addsubcategory" element={<AddSubCategory />} />
            <Route path="/viewcategory" element={<ViewCategory />} />
            <Route
              path="/viewsubcategory/:catnm"
              element={<ViewSubCategory />}
            />
            <Route path="/product" element={<Product />} />
            <Route path="/viewproduct/:subcatnm" element={<ViewProduct />} /> */}
          </Routes>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default App;
