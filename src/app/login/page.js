"use client";
import React, { useCallback, useContext, useEffect } from "react";
// import OTPInput, { ResendOTP } from "otp-input-react";
import { FaRegEyeSlash } from "react-icons/fa";

import axios from "../../../axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
// import { useRouter } from "next/router";
import { useSnackbar } from "../SnackbarProvider";
import { UserloginContext } from "../context/Userlogin";

const Page = () => {
  const [show, setShow] = useState(false);

  const [logindata, setLogindata] = useContext(UserloginContext);
  const [otp, setOtp] = useState("");

  const router = useRouter();
  const { openSnackbar } = useSnackbar();

  const [userRoles, setUserRoles] = useState([]);
  useEffect(() => {
    let unmounted = false;
    if (!unmounted) {
      fetchUserRoles();
    }

    return () => {
      unmounted = true;
    };
  }, []);

  const fetchUserRoles = useCallback(() => {
    axios
      .get("/api/auth/get-user-roles")
      .then((res) => {
        if (res.data.status === "success") {
          setUserRoles(res.data.data);
        }
      })
      .then((err) => {
        console.log(err);
      });
  }, []);

  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = async (event) => {
    const adminRole = userRoles.find((role) => role.role_name === "ADMIN");
    event.preventDefault();
    try {
      setLogindata({
        username: userName,
        password: password,
      });
      const response = await axios.post("/api/auth/admin-login", {
        username: userName,
        password,
      });
      if (typeof window !== "undefined") {
        router.push("/otp-login");
      }
      // const token = response.data.token;
      // localStorage.setItem("mykanjeeAdminToken", token);

      // if (token) {
      //   router.push("/otp-login");
      //   openSnackbar(response.data.message, "success");
      // }
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <>
      <div className="auth-wrapper">
        <div className="auth-wrapper-left">
          <h1>Mykanjee</h1>
        </div>
        <div className="auth-wrapper-right">
          <div className="auth-wrapper-form">
            <div className="auth-header">
              <div className="mb-5">
                <h2 className="text-[28px] font-[800]">
                  Login <span className="text-[14px]">(Admin)</span>
                </h2>
                <span className="text-[14px] font-[400] text-slate-400">
                  Welcome back!
                </span>
              </div>
              <form onSubmit={handleSubmit} className="mt-8 mb-2">
                <div className="flex flex-col space-y-2 mb-5">
                  <label className="text-[#334257] capitalize text-[0.875rem]">
                    Your Email
                  </label>
                  <input
                    className="border border-slate-300 p-2 rounded-[5px] h-[40px] bg-[#e8f0fe] text-black outline-none focus-none"
                    value={userName}
                    onChange={(e) => setUsername(e.target.value)}
                    name="email"
                    type="email"
                    placeholder="email@address.com"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <label className="text-[#334257] capitalize text-[0.875rem]">
                    Password
                  </label>
                  <div className="flex items-center border border-slate-300 p-2 rounded-[5px] h-[40px] bg-[#e8f0fe]">
                    <input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className=" text-black w-full bg-[#e8f0fe] outline-none focus-none"
                      name="password"
                      type="password"
                      placeholder="********"
                    />
                    <FaRegEyeSlash className="cursor-pointer text-slate-400 text-[14px]" />
                  </div>
                </div>
                {/* <div className="bg-black p-5">
                  <div className="">
                    <OTPInput
                      value={OTP}
                      onChange={setOTP}
                      autoFocus
                      OTPLength={4}
                      otpType="number"
                      className=""
                      disabled={false}
                      secure
                    />
                    <ResendOTP
                      onResendClick={() => console.log("Resend clicked")}
                    />
                  </div>
                </div> */}
                <button className="bg-[#ebc25b] p-2 rounded-[5px] text-black text-[14px] font-bold w-full mt-5 hover:bg-[#ebc25b]/70">
                  send OTP
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
