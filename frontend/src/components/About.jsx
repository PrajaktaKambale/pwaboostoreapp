import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Login from "./Login";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
const BASE_URL = import.meta.env.VITE_BASE_URL;
function Signup() {
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/";
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const userInfo = {
      fullname: data.fullname,
      email: data.email,
      password: data.password,
    };
    await axios
      .post(`${window.location.origin}/user/signup`, userInfo)
      .then((res) => {
        console.log(res.data);
        if (res.data) {
          toast.success("Signup Successfully");
          navigate(from, { replace: true });
        }
        localStorage.setItem("Users", JSON.stringify(res.data.user));
      })
      .catch((err) => {
        if (err.response) {
          console.log(err);
          toast.error("Error: " + err.response.data.message);
        }
      });
  };
  return (
    <>
      <div className="flex h-screen items-center justify-center">
        <div className=" w-[600px] ">
          <div className="modal-box">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius,
            aliquam nesciunt neque sed, maiores eaque nobis adipisci porro nam
            nihil dicta debitis sint aut. Sint quaerat vitae corrupti maxime
            soluta temporibus recusandae, reiciendis eligendi quidem blanditiis,
            deleniti suscipit. Blanditiis, iste.
            <img src="public/banner.jpeg" alt="" />
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;
