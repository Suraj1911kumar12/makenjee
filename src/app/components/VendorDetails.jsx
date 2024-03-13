import React, { useCallback, useEffect, useState, useRef } from "react";
import { IoClose } from "react-icons/io5";
import { IoSearch } from "react-icons/io5";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { styled } from '@mui/material/styles';
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
  IconButton,
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
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";

import MenuItem from "@mui/material/MenuItem";

import axios from "../../../axios";
import { useRouter } from "next/navigation";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const VendorDetails = () => {

  const { openSnackbar } = useSnackbar();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("WAITING FOR CONFIRMATION");
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const [vendorData, setvendorData] = useState([]);
  console.log("vendorData", vendorData);
  useEffect(() => {
    fetchVendorData();
  }, [activeTab]);

  const fetchVendorData = useCallback(() => {
    axios
      .get(`/api/user/fetch-vendors?type=${activeTab}`, {
        headers: {
          Authorization: localStorage.getItem("mykanjeeAdminToken"),
        },
      })
      .then((res) => {
        if (res.data.status === "success") {
          setvendorData(res.data.data);
        } else if (res.data.message === "Session expired") {
          openSnackbar(res.data.message, "error");
          router.push("/login");
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.response && err.response.data.statusCode === 400) {
          router.push("/login");
        }
      });
  }, [activeTab]);

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const totalRows = vendorData.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const [searchQuery, setSearchQuery] = useState("");
  const filteredRows = vendorData.filter((e) =>
    e?.fullname?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, filteredRows.length);
  const paginatedRows = filteredRows.slice(startIndex, endIndex);

// ---------------------------approve vendor section------------------------------
  const handleApprove = (id) => {
    axios.post(`/api/user/approve-vendor?vendor_id=${id}`, {}, {
      headers: {
        Authorization: localStorage.getItem('mykanjeeAdminToken')
      }
    }).then(res => {
      if (res.data.status === 'success') {
        fetchVendorData()
        openSnackbar(res.data.message, 'success')
      } else {
        openSnackbar(res.data.message, 'error')
      }
    }).catch(err => {
      console.log(err)
    })
  }
// ---------------------------approve vendor section------------------------------


// ---------------------------Reject vendor section------------------------------
  const [rejectedData, setRejectedData] = useState({})
  const [open, setOpen] = useState(false);

  const handleClickOpen = (data) => {
    setOpen(true);
    setRejectedData(data)
  };
  const handleClose = () => {
    setOpen(false);
    setRejectedData({})
  };

  const [getRejectedReason, setGetRejectedReason] = useState({
    rejected_reason_vendor: ''
  })

  const getDataReject = (e) => {
    const { value, name } = e.target;

    setGetRejectedReason(() => {
      return {
        ...getRejectedReason,
        [name]: value
      }
    })
  }


  const handleReject = () => {
    axios.post(`/api/user/reject-vendor`, {
      vendor_id: rejectedData.id,
      rejected_reason: getRejectedReason.rejected_reason_vendor
    }, {
      headers: {
        Authorization: localStorage.getItem('mykanjeeAdminToken')
      }
    }).then(res => {
      if (res.data.status === 'success') {
        fetchVendorData()
        openSnackbar(res.data.message, 'success')
        handleClose()
      } else {
        openSnackbar(res.data.message, 'error')
      }
    }).catch(err => {
      console.log(err)
    })
  }

// ---------------------------Reject vendor section------------------------------

  return (
    <>
      <div className="px-[20px]  container mx-auto">
        <div className=" py-[10px] flex flex-col space-y-5">
          <div className="flex flex-col space-y-1">
            <span className="text-[30px] text-[#101828] font-[500]">
              Vendor List
            </span>
            {/* <span className='text-[#667085] font-[400] text-[16px]'>Effortlessly organize your category offerings with intuitive Category Setup for a seamless and structured e-commerce experience.</span> */}
          </div>

          <div className="grid grid-cols-3 gap-4 py-[20px]">
            <div
              className={`px-[24px] py-[12px] rounded-[8px]  text-[14px] cursor-pointer ${activeTab === "WAITING FOR CONFIRMATION"
                  ? "bg-[#CFAA4C] text-[#fff]"
                  : "bg-[#f9fafb]"
                }`}
              onClick={() => handleTabChange("WAITING FOR CONFIRMATION")}
            >
              <div className="flex justify-between items-center">
                <span>Waiting for Confirmation</span>
              </div>
            </div>
            <div
              className={`px-[24px] py-[12px] rounded-[8px]  text-[14px] cursor-pointer ${activeTab === "APPROVED"
                  ? "bg-[#CFAA4C] text-[#fff]"
                  : "bg-[#f9fafb]"
                }`}
              onClick={() => handleTabChange("APPROVED")}
            >
              <div className="flex justify-between items-center">
                <span>Approved Vendor</span>
              </div>
            </div>
            <div
              className={`px-[24px] py-[12px] rounded-[8px]  text-[14px] cursor-pointer ${activeTab === "REJECTED"
                  ? "bg-[#CFAA4C] text-[#fff]"
                  : "bg-[#f9fafb]"
                }`}
              onClick={() => handleTabChange("REJECTED")}
            >
              <div className="flex justify-between items-center">
                <span>Rejected Vendor</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-1 border border-[#EAECF0] rounded-[8px] p-[10px]">
            <div className="flex items-center justify-between">
              <div className="flex space-x-2 items-center">
                <span className="text-[18px] font-[500] text-[#101828]">
                  Vendor&apos;s Data
                </span>
                {/*-------------------------------------------------------------------- {categoryData.length} */}
                <span className="px-[10px] py-[5px] bg-[#FCF8EE] rounded-[16px] text-[12px] text-[#A1853C]">
                  {" "}
                  details
                </span>
              </div>

              <div className="flex items-center space-x-3 inputText w-[50%]">
                <IoSearch className="text-[20px]" />
                <input
                  type="text"
                  className="outline-none focus-none w-full"
                  placeholder="Search vendor name here"
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
                      <TableCell style={{ minWidth: 200 }}>Name</TableCell>
                      <TableCell style={{ minWidth: 200 }}>Approve</TableCell>
                      <TableCell style={{ minWidth: 20 }}>Shop Name</TableCell>
                      <TableCell style={{ minWidth: 20 }}>
                        Registred No
                      </TableCell>
                      <TableCell style={{ minWidth: 20 }}>
                        Name of business
                      </TableCell>
                      <TableCell style={{ minWidth: 20 }}>KYC</TableCell>
                    </TableRow>
                  </TableHead>

                  {filteredRows.length > 0 ?
                    <TableBody>
                      {paginatedRows
                        .filter((item) => item)
                        .map((elem, i) => {
                          return (
                            <TableRow key={i}>
                              <TableCell>{i + 1}</TableCell>
                              <TableCell>
                                {elem?.fullname}
                              </TableCell>

                              {elem.approved == true &&
                                activeTab === "APPROVED" && (
                                  <TableCell>
                                    <div className="flex items-center px-[10px] py-[5px] bg-[#ECFDF3] rounded-[16px] justify-center cursor-pointer">
                                      <span className="text-[#027A48] text-[12px] font-[500]">
                                        Approved
                                      </span>
                                    </div>
                                  </TableCell>
                                )}
                              {elem.approved == false &&
                                activeTab === "REJECTED" && (
                                  <TableCell>
                                    <div className="flex items-center px-[10px] py-[5px] bg-red-100 rounded-[16px] justify-center cursor-pointer">
                                      <span className="text-red-500 text-[12px] font-[500]">
                                        Rejected
                                      </span>
                                    </div>
                                  </TableCell>
                                )}
                              {elem.approved == null &&
                                activeTab === "WAITING FOR CONFIRMATION" && (
                                  <TableCell>
                                    <div className="flex items-center gap-[15px]">
                                      <div
                                        className="flex items-center px-[10px] py-[5px] bg-[#ECFDF3] rounded-[16px] justify-center cursor-pointer"
                                        onClick={() => handleApprove(elem.id)}
                                      >
                                        <span className="text-[#027A48] text-[12px] font-[500]">
                                          Approve
                                        </span>
                                      </div>
                                      <div
                                        className="flex items-center px-[10px] py-[5px] bg-red-100 rounded-[16px] justify-center cursor-pointer"
                                        onClick={() => handleClickOpen(elem)}
                                      >
                                        <span className="text-red-500 text-[12px] font-[500]">
                                          Reject
                                        </span>
                                      </div>
                                    </div>
                                  </TableCell>
                                )}

                              <TableCell>
                                {elem?.vendor?.shop_name}
                              </TableCell>
                              <TableCell>
                                {elem?.vendor_details.mobile}
                              </TableCell>
                              <TableCell>
                                {elem?.vendor_details.bussiness_name}
                              </TableCell>

                              <TableCell>
                                <Button
                                  onClick={() => handleDialogData(elem?._id)}
                                >
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                    :
                    <TableRow>
                      <TableCell colSpan={7} className='text-center text-[15px] font-bold'>No product found</TableCell>
                    </TableRow>
                  }
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
          <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
            fullWidth
          >
            <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
              Reject Vendor Reason
            </DialogTitle>
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <IoClose />
            </IconButton>
            <DialogContent dividers>
              <div className='flex flex-col space-y-2'>
                <span className='text-[#344054] text-[14px] font-[500]'>Reason to reject</span>
                <textarea className='inputText' placeholder='cancel' name='rejected_reason_vendor' onChange={getDataReject} />
              </div>
            </DialogContent>
            <DialogActions className='justify-between'>
              <span onClick={handleClose} className='px-[18px] py-[10px] border border-[#D0D5DD] rounded-[8px] w-[50%] text-center cursor-pointer'>
                Close
              </span>
              <span autoFocus className='bg-[#CFAA4C] rounded-[8px] border-[#CFAA4C] w-[50%] py-[10px] text-center cursor-pointer text-[#fff] hover:opacity-70' onClick={handleReject}>
                Reject Vendor
              </span>
            </DialogActions>
          </BootstrapDialog>
        </div>
      </div>
    </>
  );
};

export default VendorDetails;
