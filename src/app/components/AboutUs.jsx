import React, { useCallback, useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { IoSearch } from "react-icons/io5";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import Switch from "@mui/material/Switch";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Pagination,
} from "@mui/material";
import Image from "next/image";
import Swal from "sweetalert2";
// import { useSnackbar } from '../SnackbarProvider';
import { useSnackbar } from "../SnackbarProvider";

import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";


const AboutUs = () => {
  const { openSnackbar } = useSnackbar();

  const [aboutUsData, setAboutUsData] = useState([]);
  const [editData, setEditData] = useState(false);
  const [idData, setIdData] = useState("");



  const getAbout = () => {
    axios
      .get("http://localhost:3000/auth/about-us", {
        headers: {
          authorization: localStorage.getItem("logintoken"),
        },
      })
      .then(function (response) {
        // handle success
        setAboutUsData(response.data.data);
        console.log("response", response);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  };

useEffect(() => {
    getAbout()
}, [])



  const formik = useFormik({
    initialValues: {
      aboutUs: "",
    },
    validationSchema: Yup.object({
      aboutUs: Yup.string().required("field is required"), 
    }),
    onSubmit: async (values) => {
      console.log("valuesqq", values);
 
    
        await axios
          .post(
            "http://localhost:3000/auth/add/about-us",
            {
              aboutUs: values.aboutUs
            },
            {
              headers: {
                "Content-Type": "multipart/form-data", // Adjust the content type based on your API requirements
                authorization: localStorage.getItem("logintoken"), // Add any authentication headers if needed
              },
            }
          )
          .then((response) => {
            // Handle success
            // getCategory();
            console.log("Response:", response);
            getAbout()
            openSnackbar("About us added successfully", "success");
            formik.resetForm({
              values: {
                aboutUs: "",
              
              },
            });
          })
          .catch((error) => {
            // Handle error
            console.error("Error:", error);
          });
    },
  });


  return (
    <>
      <div className="px-[20px]  container mx-auto">
        <div className=" py-[10px] flex flex-col space-y-5">
          <div className="flex flex-col space-y-1">
            <span className="text-[30px] text-[#101828] font-[500]">
              Add About Us
            </span>
            <span className="text-[#667085] font-[400] text-[16px]">
              Effortlessly organize your category offerings with intuitive
              Category Setup for a seamless and structured e-commerce
              experience.
            </span>
          </div>
          <form onSubmit={formik.handleSubmit}>
            <div className="flex items-center justify-between gap-[10px]">
              <div className="flex flex-col space-y-1 w-full">
                <span>About Us *</span>
                <input
                  type="text"
                  placeholder="write here "
                  className="inputText"
                  name="aboutUs"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values?.aboutUs}
                />
                {formik.touched.aboutUs && formik.errors.aboutUs && (
                  <div className="text-red-500">
                    {formik.errors.aboutUs}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-[24px] justify-end">
              <button className="submitButton" type="submit">
                Submit
              </button>
            </div>
          </form>
          <div className="flex flex-col space-y-1 border border-[#EAECF0] rounded-[8px] p-[10px]">
            <div className="flex items-center justify-between">
              <div className="flex space-x-2 items-center">
                <span className="text-[18px] font-[500] text-[#101828]">
                {aboutUsData}
                </span>

              
              </div>

              
             
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutUs;
