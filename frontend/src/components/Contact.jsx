import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";

import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import Webcam from "react-webcam";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;
axios.defaults.withCredentials = true;

const Contact = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [avatar, setAvatar] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [img, setImg] = useState(null); // Ensure `img` is initialized as `null`
  const webcamRef = useRef(null);
  const navigate = useNavigate();

  // Request location permission on component mount
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Location access granted", position);
        },
        (error) => {
          console.error("Location access denied", error);
        }
      );
    }
  }, []);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("fullname", data.fullname);
    formData.append("email", data.email);
    formData.append("message", data.message);

    // Ensure `img` is a valid `Blob` or `File` and append to FormData
    if (img instanceof Blob || img instanceof File) {
      formData.append("avatar", img, "avatar.jpg");
    }

    // Log form data for debugging
    console.log("Form data contents:");
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      // const response = await axios.post(
      //   "https://vercel.com/prajakta-kambales-projects/bookstoreapplication-pwa/contact",
      //   formData,
      //   {
      //     headers: {
      //       "Content-Type": "multipart/form-data",
      //     },
      //   }
      // );
      const response = await axios.post(
        `${window.location.origin}/contact`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("response", response);
      if (response.status !== 201)
        throw new Error("Network response was not ok");

      toast.success("Your details have been saved.");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Error submitting form:", error);
      if (error) {
        toast.error(
          "Invalid file type. Only JPEG, PNG, and GIF files are allowed."
        );
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(URL.createObjectURL(file)); // For preview
      setImg(file); // Store the file for upload
    }
  };

  const handleOptionSelect = (option) => {
    if (option === "take-photo") {
      setShowCamera(true);
    } else if (option === "upload-photo") {
      document.getElementById("file-input").click();
    } else if (option === "remove-photo") {
      setImg(null);
      setAvatar(null);
    }
    setShowOptions(false);
  };

  const handleCapture = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      fetch(imageSrc)
        .then((res) => res.blob())
        .then((blob) => {
          setImg(blob);
          setAvatar(imageSrc); // Update avatar preview
          setShowCamera(false);
        });
    }
  };

  return (
    <>
      <div className="flex h-screen justify-center items-center">
        <form onSubmit={handleSubmit(onSubmit)} method="dialog">
          <h3 className="font-bold text-4xl text-center">Contact Us</h3>

          {/* Avatar */}
          <div className="relative w-24 h-24 flex items-center justify-center border border-gray-300 rounded-full overflow-hidden mx-auto mb-4">
            <img
              src={
                avatar
                  ? avatar
                  : "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              }
              alt="Avatar"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => setShowOptions((prev) => !prev)}
              className="absolute bottom-2 right-2 flex items-center justify-center w-8 h-8 bg-gray-700 rounded-full"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            >
              <span className="text-white text-lg">+</span>
            </button>

            <input
              id="file-input"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </div>

          {/* Options below the Avatar */}
          {showOptions && (
            <div className="bg-gray shadow-lg rounded-lg p-4 mb-4 mx-auto w-40">
              <button
                type="button"
                className="block w-full text-left p-2 text-sm hover:bg-gray-100"
                onClick={() => handleOptionSelect("take-photo")}
              >
                Take Photo
              </button>
              <button
                type="button"
                className="block w-full text-left p-2 text-sm hover:bg-gray-100"
                onClick={() => handleOptionSelect("upload-photo")}
              >
                Upload Photo
              </button>
              <button
                type="button"
                className="block w-full text-left p-2 text-sm text-red-600 hover:bg-gray-100"
                onClick={() => handleOptionSelect("remove-photo")}
              >
                Remove Photo
              </button>
            </div>
          )}

          {/* Camera */}
          {showCamera && (
            <div className="absolute top-0 left-0 right-0 bottom-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <Webcam
                  audio={false}
                  screenshotFormat="image/jpeg"
                  ref={webcamRef}
                />
                <div className="flex justify-between mt-4 gap-4">
                  <button
                    type="button"
                    className="px-4 py-2 bg-red-600 text-white rounded"
                    onClick={handleCapture}
                  >
                    Capture
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-600 text-white rounded"
                    onClick={() => setShowCamera(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Name */}
          <div className="mt-4 space-x-2">
            <span>Name</span>
            <br />
            <input
              type="text"
              placeholder="Enter your fullname"
              className="w-80 py-1 px-3 border rounded-md outline-none"
              {...register("fullname", { required: true })}
            />
            <br />
            {errors.fullname && (
              <span className="text-sm text-red-500">
                This field is required
              </span>
            )}
          </div>

          {/* Email */}
          <div className="mt-4 space-x-2">
            <span>Email</span>
            <br />
            <input
              type="email"
              placeholder="Enter your email"
              className="w-80 py-1 px-3 border rounded-md outline-none"
              {...register("email", { required: true })}
            />
            <br />
            {errors.email && (
              <span className="text-sm text-red-500">
                This field is required
              </span>
            )}
          </div>

          {/* Message */}
          <div className="mt-4 space-x-2">
            <span>Message</span>
            <br />
            <textarea
              placeholder="Type your message"
              className="w-80 py-1 px-3 border rounded-md outline-none"
              {...register("message", { required: true })}
            />
            <br />
            {errors.message && (
              <span className="text-sm text-red-500">
                This field is required
              </span>
            )}
          </div>

          {/* Button */}
          <div className="flex justify-start mt-4">
            <button
              type="submit"
              className="bg-pink-500 text-white rounded-md px-3 py-1 hover:bg-pink-700 duration-200"
            >
              Submit
            </button>
          </div>
        </form>
      </div>

      {/* Toast notifications */}
      <Toaster />
    </>
  );
};

export default Contact;
