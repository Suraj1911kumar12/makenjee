import React, { useCallback, useEffect, useState, useRef } from "react";
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
import { useSnackbar } from "../SnackbarProvider";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
// import Select from '@mui/material/Select';
import MenuItem from "@mui/material/MenuItem";

import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

// const validationSchema = Yup.object({
//   categoryName: Yup.string().required('OrderList Name is required'),
//   category_no: Yup.number().required('OrderList No is required'),
//    image: Yup.mixed().required('Image is required'),
// });

const OrderList = () => {
  const [driverData, setDriverData] = useState([]);
  const [dialogData, setDialogData] = useState([]);
  const [outObjIdD, setOutObjIdD] = useState("");
  const [userId, setUserId] = useState("");

  const [orderData, setOrderData] = useState([]);
  const [selectValueA, setSelectValueA] = useState("");

  const [open, setOpen] = useState(false);
  const [scroll, setScroll] = useState("paper");

  const { openSnackbar } = useSnackbar();

  const handleClickOpen = (scrollType) => () => {
    setOpen(true);
    setScroll(scrollType);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const totalRows = orderData.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const [searchQuery, setSearchQuery] = useState("");
  const filteredRows = orderData.filter((e) =>
    e?.nameOfUser?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const paginatedRows = filteredRows.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const descriptionElementRef = useRef(null);
  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  const handleClick = (data, outObjId, userId) => {
    // console.log("outObjId",outObjId);

    setUserId(userId)
    setOpen(true);
    setDialogData(data);
    setOutObjIdD(outObjId);
  }; 
  

  const options = [
    { id: 1, label: "Pending", value: "pending" },
    { id: 2, label: "Shipped", value: "shipped" },
    { id: 3, label: "Delivered", value: "delivered" },
    { id: 4, label: "Rejected", value: "rejected" },
    { id: 5, label: "Accepted", value: "accepted" },
  ];

  const handleOrderChange = async (value, id) => {
    // setSelectedOption(value)
    console.log("djjdjdjdj", value?.target?.value);

    await axios
      .put(
        "http://localhost:3000/auth/checkout-update",
        {
          status: value?.target?.value,
          checkoutId: id,
          checkoutObjId: outObjIdD,
        },
        {
          headers: {
            // 'Content-Type': 'multipart/form-data', // Adjust the content type based on your API requirements
            authorization: localStorage.getItem("logintoken"), // Add any authentication headers if needed
          },
        }
      )
      .then((response) => {
        // Handle success
        console.log("Response:", response);
        getOrderApi();
        openSnackbar("Status changed successfully", "success");
      })
      .catch((error) => {
        // Handle error
        console.error("Error:", error);
      });
  };

  const getOrderApi = () => {
    axios
      .get("http://localhost:3000/auth/checkout-get-all", {
        headers: {
          authorization: localStorage.getItem("logintoken"),
        },
      })
      .then(function (response) {
        // handle success

        console.log("responseHH", response);

        setOrderData(response.data.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  };


  useEffect(() => {
    getOrderApi();
  }, []);

  const [isLoading, setIsLoading] = useState(false);

  const handleTaxInvoices = async (sellerId) => {
    // outObjIdD
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/auth/invoice?checkoutId=${outObjIdD}&sellerId=${sellerId}`,
        {
          method: "GET",
          headers: {
            authorization: localStorage.getItem("logintoken"),
            "Content-Type": "application/json",
          },
        }
      );

      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "tax_invoice.pdf");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error downloading invoice:", error);
    } finally {
      setIsLoading(false);
    }
  };
  // const [isLoading, setIsLoading] = useState(false);

  const handleShipInvoices = async (sellerId) => {
    // outObjIdD
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/auth/shipping-invoice?checkoutId=${outObjIdD}&sellerId=${sellerId}`,
        {
          method: "GET",
          headers: {
            authorization: localStorage.getItem("logintoken"),
            "Content-Type": "application/json",
          },
        }
      );

      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "ship_invoice.pdf");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error downloading invoice:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDriverApi = () => {
    axios
      .get("http://localhost:3000/auth/get-all/driver", {
        // headers: {
        //   'authorization': localStorage.getItem('logintoken')},
      })
      .then(function (response) {
        // handle success
        setDriverData(response.data);

        console.log("drivergetdata", response.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  };

  useEffect(() => {
    getDriverApi();
  }, []);

  const handleDriver = async (selectValue, data) => {
  setSelectValueA(selectValue)
    //userId
    console.log("handleDriver",data , selectValue);
    
  
    await axios
      .post(
        "http://localhost:3000/auth/assign-driver",
        {
          userId:userId,
          sellerId:data?.sellerId,
          productId:data?.productId,
          orderId:data?.sellerId,
          quantity:data?.quantity,
          driverId:selectValue
        },
        {
          headers: {
            // 'Content-Type': 'multipart/form-data', // Adjust the content type based on your API requirements
            authorization: localStorage.getItem("logintoken"), // Add any authentication headers if needed
          },
        }
      )
      .then((response) => {
        // Handle success
        console.log("ResponseAA:", response);
        //   handleOpen()
        openSnackbar("reason updated successfully", "success");
      })
      .catch((error) => {
        // Handle error
        console.error("Error:", error);
      });
    
    
    
      await axios
      .put(
        "http://localhost:3000/auth/checkout-update",
        {
          driverId:selectValue,
          checkoutId: data._id,
          checkoutObjId: outObjIdD,
        },
        {
          headers: {
            // 'Content-Type': 'multipart/form-data', // Adjust the content type based on your API requirements
            authorization: localStorage.getItem("logintoken"), // Add any authentication headers if needed
          },
        }
      )
      .then((response) => {
        // Handle success
        console.log("Response:", response);
        getOrderApi();
        openSnackbar("Status changed successfully", "success");
      })
      .catch((error) => {
        // Handle error
        console.error("Error:", error);
      });
  };

  return (
    <>
      <div className="px-[20px]  container mx-auto">
        <div className=" py-[10px] flex flex-col space-y-5">
          <div className="flex flex-col space-y-1">
            <span className="text-[30px] text-[#101828] font-[500]">
              Order&apos;s List
            </span>
            {/* <span className='text-[#667085] font-[400] text-[16px]'>Effortlessly organize your category offerings with intuitive Category Setup for a seamless and structured e-commerce experience.</span> */}
          </div>

          <div className="flex flex-col space-y-1 border border-[#EAECF0] rounded-[8px] p-[10px]">
            <div className="flex items-center justify-between">
              <div className="flex space-x-2 items-center">
                <span className="text-[18px] font-[500] text-[#101828]">
                  Order&apos;s Data
                </span>
                {/*-------------------------------------------------------------------- {categoryData.length} */}
                <span className="px-[10px] py-[5px] bg-[#FCF8EE] rounded-[16px] text-[12px] text-[#A1853C]">
                  {" "}
                  products
                </span>
              </div>
              <div className="flex items-center space-x-3 inputText w-[50%]">
                <IoSearch className="text-[20px]" />
                <input
                  type="text"
                  className="outline-none focus-none w-full"
                  placeholder="Search order  here"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <Paper>
              <TableContainer
                component={Paper}
                sx={{ height: "100%", width: "100%" }}
              >
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow className="!bg-[#F9FAFB]">
                      <TableCell style={{ minWidth: 80 }}>SL no</TableCell>
                      <TableCell style={{ minWidth: 200 }}>Order ID</TableCell>
                      <TableCell style={{ minWidth: 200 }}>
                        {" "}
                        User Name
                      </TableCell>
                      <TableCell style={{ minWidth: 20 }}>Action </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {paginatedRows
                      .filter((item) => item)
                      .map((elem, i) => {
                        return (
                          <TableRow key={i}>
                            <TableCell>{i + 1}</TableCell>
                            <TableCell> {elem?.orderId}</TableCell>
                            <TableCell> {elem?.nameOfUser}</TableCell>
                            <TableCell>
                              <Button
                                onClick={() =>handleClick(elem?.productDetails, elem._id,elem?.userId)
                                }
                              >
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>

                  {/* <TableRow>
                        <TableCell colSpan={7} className='text-center text-[15px] font-bold'>No product found</TableCell>
                      </TableRow> */}
                </Table>
              </TableContainer>
            </Paper>

            {filteredRows.length > rowsPerPage && (
              <div className="flex justify-center mt-3">
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handleChangePage}
                  shape="rounded"
                />
              </div>
            )}
          </div>

          <Dialog
            open={open}
            onClose={handleClose}
            scroll={scroll}
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
            maxWidth="lg"
          >
            <DialogTitle id="scroll-dialog-title">
              Change Order Status
            </DialogTitle>
            <DialogContent dividers={scroll === "paper"}>
              <DialogContentText
                id="scroll-dialog-description"
                ref={descriptionElementRef}
                tabIndex={-1}
              >
                <div className="relative flex flex-col w-full h-full overflow-scroll text-gray-700 bg-white shadow-md rounded-xl bg-clip-border">
                  <table className="w-full text-left table-auto min-w-max">
                    <thead>
                      <tr>
                        <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                          <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                            Seller Name
                          </p>
                        </th>
                        <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                          <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                            Status
                          </p>
                        </th>
                        <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                          <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                            Select Driver
                          </p>
                        </th>
                        <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                          <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                            Product Name
                          </p>
                        </th>
                        <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                          <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                            Quantity
                          </p>
                        </th>
                        <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                          <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                            Tax Invoice
                          </p>
                        </th>
                        <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                          <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                            Shipping Invoice
                          </p>
                        </th>
                        <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                          <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                            Commision Invoice
                          </p>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {dialogData?.map((item) => {
                        return (
                          <tr key={item}>
                            {console.log("dialogData", item)}
                            <td className="p-4">
                              <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                {item?.product?.sellerName}
                              </p>
                            </td>
                            <td className="p-4">
                              <Select
                                size="md"
                                label="Select Version"
                                defaultValue={item?.status}
                                onChange={(event) =>
                                  handleOrderChange(event, item._id)
                                }
                              >
                                {options.map((option) => (
                                  <MenuItem
                                    key={option.id}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            </td>
                            <td className="p-4">
                              <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">
                                  Driver
                                </InputLabel>
                                <Select
                                  labelId="demo-simple-select-label"
                                  id="demo-simple-select"
                                  defaultValue={item?.driverId}
                                  label="Driver"
                                  onChange={(event) => handleDriver(event?.target?.value,item)}
                                >
                                  {driverData
                                    ?.filter((e) => e && e.approve)
                                    .map((data) => {
                                      return (
                                        <MenuItem   key={data?._id} value={data?._id}>
                                          {data?.name}
                                        </MenuItem>
                                      );
                                    })}
                                </Select>
                              </FormControl>
                            </td>
                            <td className="p-4">
                              <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                {item?.product?.productsName}
                              </p>
                            </td>
                            <td className="p-4">{item?.quantity}</td>
                            <td className="p-4">
                              <Button
                                variant="contained"
                                color="grey"
                                onClick={() =>
                                  handleTaxInvoices(item?.sellerId)
                                }
                              >
                                Download{" "}
                              </Button>
                            </td>
                            <td className="p-4">
                              <Button
                                variant="contained"
                                color="grey"
                                onClick={() =>
                                  handleShipInvoices(item?.sellerId)
                                }
                              >
                                Download{" "}
                              </Button>
                            </td>
                            <td className="p-4">
                              <Button
                                variant="contained"
                                color="grey"
                                onClick={handleClose}
                              >
                                Download{" "}
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Back</Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </>
  );
};

export default OrderList;
