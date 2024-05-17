"use client";
import React, { useCallback, useContext, useEffect } from "react";
import OTPInput, { ResendOTP } from "otp-input-react";
// import { FaRegEyeSlash } from "react-icons/fa";

import axios from "../../../axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSnackbar } from "../SnackbarProvider";
import { UserloginContext } from "../context/Userlogin";

const Page = () => {
  const [logindata, setLogindata] = useContext(UserloginContext);

  console.log(logindata);

  const [OTP, setOTP] = useState("");

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
      const response = await axios.post(
        "/api/auth/admin-login-with-password-and-otp-verify",
        {
          ...logindata,
          otp: OTP,
        }
      );
      const token = response.data.token;
      localStorage.setItem("mykanjeeAdminToken", token);

      if (token && typeof window !== "undefined") {
        router.push("/");
        openSnackbar(response.data.message, "success");
      }
    } catch (error) {
      console.error("Login failed", error);
    }
  };
  const style = {
    width: "5rem",
    height: "5rem",
    border: "1px solid black",
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
                <div className="flex flex-col space-y-2 mb-5"></div>
                <div className="flex flex-col space-y-2">
                  <label className="text-[#334257] capitalize text-[0.875rem]">
                    Enter OTP
                  </label>
                </div>
                <div className=" p-5">
                  <div className="">
                    <OTPInput
                      value={OTP}
                      onChange={setOTP}
                      className="pb-3"
                      autoFocus
                      OTPLength={4}
                      otpType="number"
                      inputStyles={style}
                      disabled={false}
                      secure
                    />
                    <ResendOTP
                      onResendClick={() => console.log("Resend clicked")}
                    />
                  </div>
                </div>
                <button className="bg-[#ebc25b] p-2 rounded-[5px] text-black text-[14px] font-bold w-full mt-5 hover:bg-[#ebc25b]/70">
                  Login
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
