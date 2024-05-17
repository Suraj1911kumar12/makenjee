import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Pagination,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import axios from "../../../axios";
import React, { useCallback, useEffect, useState } from "react";
import { IoClose, IoSearch } from "react-icons/io5";
import { styled } from "@mui/material/styles";
import Image from "next/image";
import { useSnackbar } from "../SnackbarProvider";
import { useRouter } from "next/navigation";
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const VendorServiceType = () => {
  const router = useRouter();
  const { openSnackbar } = useSnackbar();
  const [activeTab, setActiveTab] = useState("WAITING FOR CONFIRMATION");
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const [vendorData, setvendorData] = useState([]);
  const [vendorApproveUpdate, setVendorApproveUpdater] = useState(false);

  const [getRejectedReason, setGetRejectedReason] = useState("");
  const [serviceData, setServiceData] = useState();
  const [serviceName, setServiceName] = useState("");
  const [subServiceName, setSubServiceName] = useState("");
  const [filterData, setFilterData] = useState({});
  const [subFilterData, setSubFilterData] = useState({});

  const fetchVendorData = () => {
    axios
      .get(`/api/vendor-services`, {
        headers: {
          Authorization: localStorage.getItem("mykanjeeAdminToken"),
        },
      })
      .then((res) => {
        if (res.data.status === "success") {
          setvendorData(res.data.data);
          setServiceData(res.data.data);
          setServiceName(res.data.data?.[0]?.name);
          // setSubFilterData(res.data.data?.[0]?.vendor_services_list[0]);
          // setFilterData(res.data.data?.[0]?.vendor_services_list);
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
  };

  const vendorApproveReject = (role_id, status) => {
    axios
      .post(
        `/api/vendor-services/approve-reject-service`,
        {
          vendor_service_id: role_id,
          approve_reject: status,
          reject_reason: getRejectedReason,
        },
        {
          headers: {
            Authorization: localStorage.getItem("mykanjeeAdminToken"),
          },
        }
      )
      .then((res) => {
        if (res.data.status === "success") {
          openSnackbar(res.data.message, "success");
          setVendorApproveUpdater(!vendorApproveUpdate);
          setOpen(false);
        } else if (res.data.message === "Session expired") {
          openSnackbar(res.data.message, "error");
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.response && err.response.data.statusCode === 400) {
        }
      });
  };

  useEffect(() => {
    fetchVendorData();
    vendorApproveReject();
  }, [activeTab, vendorApproveUpdate]);

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const totalRows = vendorData.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const [searchQuery, setSearchQuery] = useState("");
  const filteredRows = vendorData.filter((e) =>
    e?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, filteredRows.length);
  const paginatedRows = filteredRows.slice(startIndex, endIndex);

  // ---------------------------Reject Service section------------------------------
  const [rejectedData, setRejectedData] = useState({});
  const [open, setOpen] = useState(false);

  const handleClickOpen = (data) => {
    setOpen(true);
    setRejectedData(data);
  };
  const handleClose = () => {
    setOpen(false);
    setRejectedData({});
  };

  const getDataReject = (e) => {
    setGetRejectedReason(e.target.value);
  };

  const [openServiceList, setOpenServiceList] = useState(false);
  const [serviceList, setServiceList] = useState([]);
  console.log(serviceList);

  const handleClickOpenServiceList = (data) => {
    setServiceList(data.vendor_services_list);
    setOpenServiceList(true);
  };
  const handleCloseServiceList = () => {
    setOpenServiceList(false);
  };

  const [openAddonsList, setOpenAddonsList] = useState(false);
  const [addOnsList, setAddonsList] = useState([]);
  console.log("addOnsList", addOnsList);

  // const handleClickAddonsList = (data) => {
  //     setAddonsList(data)
  //     setOpenAddonsList(true)
  // }
  const handleCloseAddonsList = () => {
    setOpenAddonsList(false);
  };

  const [openAccordion, setOpenAccordion] = useState(null); // State to manage open accordion panels
  const [detailsData, setDetailsData] = useState({}); // State to store details data for each panel

  const handleClickAddonsList = (addons) => {
    // Fetch and set details data for the clicked addon
    // For example, you can set it to some dummy data for now
    setDetailsData(addons);
  };

  // ----------------------------------------------Change status section Starts-----------------------------------------------------
  const handleSwitchChange = (id, status) => {
    const newStatus = !status;
    axios
      .post(
        `/api/vendor-services/active-inactive-addon`,
        {
          vendor_service_addon_id: id,
          status: newStatus,
        },
        {
          headers: {
            Authorization: localStorage.getItem("mykanjeeAdminToken"),
          },
        }
      )
      .then((res) => {
        if (res.data.status === "success") {
          openSnackbar(res.data.message, "success");
          fetchVendorData();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // ----------------------------------------------Change status section Ends-----------------------------------------------------
  return (
    <div className="px-[20px]  container mx-auto overflow-y-scroll">
      <div className=" py-[10px] flex flex-col space-y-5">
        <div className="flex flex-col space-y-1">
          <span className="text-[30px] text-[#101828] font-[500]">
            Vendor Service List
          </span>
          <div className="m-5">
            <div className="dropdown">
              <div tabIndex={0} role="button" className="btn m-1">
                Select Service Type
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 shadow bg-white rounded-box w-52"
              >
                {serviceData?.map((res, index) => {
                  return (
                    <>
                      <li>
                        <a
                          onClick={() => {
                            setFilterData(res?.vendor_services_list);
                            setServiceName(res.name);
                          }}
                        >
                          {res?.name}
                        </a>
                      </li>
                    </>
                  );
                })}
              </ul>
            </div>
          </div>
          {/* <div className="m-5">
            <div className="dropdown">
              <div tabIndex={0} role="button" className="btn m-1">
                Select Sub Service Type
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 shadow bg-white rounded-box w-52"
              >
                {filterData.length &&
                  filterData?.map((res, index) => {
                    return (
                      <>
                        <li>
                          <a
                            onClick={() => {
                              setSubFilterData(res);
                              // setSubServiceName(res.name);
                            }}
                          >
                            {res?.material_type !== "null"
                              ? res?.material_type
                              : res?.clothing_item_type}
                          </a>
                        </li>
                      </>
                    );
                  })}
              </ul>
            </div>
          </div> */}
        </div>
        <div className="grid grid-cols-3 gap-4 py-[20px]">
          <div
            className={`px-[24px] py-[12px] rounded-[8px]  text-[14px] cursor-pointer ${
              activeTab === "WAITING FOR CONFIRMATION"
                ? "bg-[#ac87bf] text-[#fff]"
                : "bg-[#f9fafb]"
            }`}
            onClick={() => handleTabChange("WAITING FOR CONFIRMATION")}
          >
            <div className="flex justify-between items-center">
              <span>Waiting for Confirmation</span>
            </div>
          </div>
          <div
            className={`px-[24px] py-[12px] rounded-[8px]  text-[14px] cursor-pointer ${
              activeTab === "APPROVED"
                ? "bg-[#ac87bf] text-[#fff]"
                : "bg-[#f9fafb]"
            }`}
            onClick={() => handleTabChange("APPROVED")}
          >
            <div className="flex justify-between items-center">
              <span>Approved Service Type</span>
            </div>
          </div>
          <div
            className={`px-[24px] py-[12px] rounded-[8px]  text-[14px] cursor-pointer ${
              activeTab === "REJECTED"
                ? "bg-[#ac87bf] text-[#fff]"
                : "bg-[#f9fafb]"
            }`}
            onClick={() => handleTabChange("REJECTED")}
          >
            <div className="flex justify-between items-center">
              <span>Rejected Service Type</span>
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
              <span className="px-[10px] py-[5px] bg-[#ac87bf] rounded-[16px] text-[12px] text-[#fff]">
                {filterData.length} details
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
                    <TableCell style={{ minWidth: 200 }}>
                      Service Name
                    </TableCell>
                    <TableCell style={{ minWidth: 200 }}>
                      Service Type
                    </TableCell>
                    <TableCell style={{ minWidth: 200 }}>
                      Material Type
                    </TableCell>
                    <TableCell style={{ minWidth: 200 }}>Shop Name</TableCell>
                    <TableCell style={{ minWidth: 200 }}>Price</TableCell>
                    {activeTab === "REJECTED" && (
                      <>
                        <TableCell style={{ minWidth: 200 }}>Status</TableCell>
                        <TableCell style={{ minWidth: 20 }}>
                          Rejected Reason
                        </TableCell>
                      </>
                    )}
                    {activeTab === "APPROVED" && (
                      <>
                        <TableCell style={{ minWidth: 200 }}>Status</TableCell>
                      </>
                    )}
                    {activeTab === "WAITING FOR CONFIRMATION" && (
                      <>
                        <TableCell style={{ minWidth: 200 }}>Action</TableCell>
                      </>
                    )}
                    {/* <TableCell style={{ minWidth: 20 }}>Service List</TableCell> */}
                  </TableRow>
                </TableHead>
                {console.log(subFilterData.length, "sub data")}

                {/* {filterData.length &&
                  filterData?.map((item) => {
                    {
                      console.log("item", item);
                    }
                    return (
                      <>
                        <h1>fdgdfg</h1>
                      </>
                    );
                  })} */}

                {filterData.length ? (
                  <TableBody>
                    {filterData.map((elem, i) => {
                      return (
                        <>
                          <TableRow key={i}>
                            {/* <TableCell>{i + 1}</TableCell>
                            <TableCell>{elem?.name}</TableCell>
                            <TableCell>{elem?.service?.name}</TableCell>
                            <TableCell>{elem?.material_type}</TableCell>
                            <TableCell>{elem?.user?.fullname}</TableCell>
                            <TableCell>{elem?.price}</TableCell> */}

                            {elem?.approved == 1 &&
                              activeTab === "APPROVED" && (
                                <>
                                  <TableCell>{i + 1}</TableCell>
                                  <TableCell>{serviceName}</TableCell>
                                  <TableCell>{elem?.service?.name}</TableCell>
                                  <TableCell>{elem?.material_type}</TableCell>
                                  <TableCell>{elem?.fullname}</TableCell>
                                  <TableCell>{elem?.price}</TableCell>
                                  <TableCell>
                                    <div className="flex items-center px-[10px] py-[5px] bg-[#ECFDF3] rounded-[16px] justify-center cursor-pointer">
                                      <span className="text-[#027A48] text-[12px] font-[500]">
                                        Approved
                                      </span>
                                    </div>
                                  </TableCell>
                                  {/* <TableCell>
                                      <Button
                                        onClick={() =>
                                          handleClickOpenServiceList(elem)
                                        }
                                      >
                                        View
                                      </Button>
                                    </TableCell> */}
                                </>
                              )}
                            {elem?.approved == 0 &&
                              activeTab === "REJECTED" && (
                                <>
                                  <TableCell>{i + 1}</TableCell>
                                  <TableCell>{serviceName}</TableCell>
                                  <TableCell>{elem?.service?.name}</TableCell>
                                  <TableCell>{elem?.material_type}</TableCell>
                                  <TableCell>{elem?.fullname}</TableCell>
                                  <TableCell>{elem?.price}</TableCell>
                                  <TableCell>
                                    <div className="flex items-center px-[10px] py-[5px] bg-red-100 rounded-[16px] justify-center cursor-pointer">
                                      <span className="text-red-500 text-[12px] font-[500]">
                                        Rejected
                                      </span>
                                    </div>
                                  </TableCell>
                                  {/* <TableCell>
                                      <Button
                                        onClick={() =>
                                          handleClickOpenServiceList(elem)
                                        }
                                      >
                                        View
                                      </Button>
                                    </TableCell> */}
                                </>
                              )}
                            {elem?.approved == null &&
                              activeTab === "WAITING FOR CONFIRMATION" && (
                                <>
                                  <TableCell>{i + 1}</TableCell>
                                  <TableCell>{serviceName}</TableCell>
                                  <TableCell>{elem?.service?.name}</TableCell>
                                  <TableCell>{elem?.material_type}</TableCell>
                                  <TableCell></TableCell>

                                  <TableCell>{elem?.price}</TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-[15px]">
                                      <div
                                        className="flex items-center px-[10px] py-[5px] bg-[#ECFDF3] rounded-[16px] justify-center cursor-pointer"
                                        onClick={() =>
                                          vendorApproveReject(elem.id, 1)
                                        }
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
                                  {/* <TableCell>
                                      <Button
                                        onClick={() =>
                                          handleClickOpenServiceList(elem)
                                        }
                                      >
                                        View
                                      </Button>
                                    </TableCell> */}
                                </>
                              )}

                            {activeTab === "REJECTED" && (
                              <TableCell>{elem?.rejected_reason}</TableCell>
                            )}
                            {/* <TableCell>
                                <Button
                                  onClick={() =>
                                    handleClickOpenServiceList(elem)
                                  }
                                >
                                  View
                                </Button>
                              </TableCell> */}
                            {/* <TableCell>
                                                            <Button
                                                                onClick={() => handleClickAddonsList(elem?.vendor_services_list)}
                                                            >
                                                                View
                                                            </Button>
                                                        </TableCell> */}
                          </TableRow>
                        </>
                      );
                    })}
                  </TableBody>
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center text-[15px] font-bold"
                    >
                      No Vendor found
                    </TableCell>
                  </TableRow>
                )}
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
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <IoClose />
        </IconButton>
        <form onSubmit={() => vendorApproveReject(rejectedData?.id, 0)}>
          <DialogContent dividers>
            <div className="flex flex-col space-y-2">
              <span className="text-[#344054] text-[14px] font-[500]">
                Reason to reject
              </span>
              <textarea
                className="inputText"
                placeholder="cancel"
                name="rejected_reason_vendor"
                onChange={getDataReject}
                required
              />
            </div>
          </DialogContent>
          <DialogActions className="justify-between">
            <span
              onClick={handleClose}
              className="px-[18px] py-[10px] border border-[#D0D5DD] rounded-[8px] w-[50%] text-center cursor-pointer"
            >
              Close
            </span>
            <button
              autoFocus
              type="submit"
              className="bg-[#ac87bf] rounded-[8px] border-[#ac87bf] w-[50%] py-[10px] text-center cursor-pointer text-[#fff] hover:opacity-70"
              // onClick={() => vendorApproveReject(1, 0)}
              // onClick={console.log("reject")}
            >
              Reject Service
            </button>
          </DialogActions>
        </form>
      </BootstrapDialog>

      <BootstrapDialog
        onClose={handleCloseServiceList}
        aria-labelledby="customized-dialog-title"
        open={openServiceList}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Service List
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseServiceList}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <IoClose />
        </IconButton>
        <DialogContent dividers>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell
                    className="text-[#344054] text-[12px] font-[500]"
                    align="center"
                  >
                    Clothing Item Type
                  </TableCell>
                  <TableCell
                    className="text-[#344054] text-[12px] font-[500]"
                    align="center"
                  >
                    Material Type
                  </TableCell>
                  <TableCell
                    className="text-[#344054] text-[12px] font-[500]"
                    align="center"
                  >
                    Status
                  </TableCell>
                  <TableCell
                    className="text-[#344054] text-[12px] font-[500]"
                    align="center"
                  >
                    Add ons 5
                  </TableCell>
                </TableRow>
              </TableHead>
              {/* <TableBody>
                {serviceList &&
                  serviceList.map((elem) => {
                    return (
                      <TableRow
                        key={elem?.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell align="center">
                          {elem?.clothing_item_type}
                        </TableCell>
                        <TableCell align="center">
                          {elem?.material_type.includes("null", null)
                            ? "N/A"
                            : elem?.material_type}
                        </TableCell>
                        <TableCell align="center">
                          {elem?.status == true ? (
                            <div className="flex items-center gap-[5px] py-[5px] bg-[#ECFDF3] rounded-[16px] justify-center">
                              <Image
                                src="/images/active.svg"
                                height={10}
                                width={10}
                                alt="active"
                              />
                              <span className="text-[#027A48] text-[12px] font-[500]">
                                Active
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-[5px] py-[5px] bg-red-200 rounded-[16px] justify-center">
                              <Image
                                src="/images/inactive.svg"
                                height={10}
                                width={10}
                                alt="active"
                              />
                              <span className="text-red-500 text-[12px] font-[500]">
                                Inactive
                              </span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell align="center">
                          <Accordion
                            expanded={openAccordion === elem?.id}
                            onChange={() =>
                              setOpenAccordion(
                                openAccordion === elem?.id ? null : elem?.id
                              )
                            }
                          >
                            <AccordionSummary>
                              <button
                                onClick={() =>
                                  handleClickAddonsList(elem?.addons)
                                }
                                className="text-[#344054] text-[12px] font-[500]"
                              >
                                Click to Expand
                              </button>
                            </AccordionSummary>
                            <AccordionDetails>
                              <TableContainer>
                                <Table aria-label="simple table">
                                  <TableHead>
                                    <TableRow>
                                      <TableCell
                                        className="text-[#344054] text-[12px] font-[500]"
                                        align="left"
                                      >
                                        Add on name
                                      </TableCell>
                                      <TableCell
                                        className="text-[#344054] text-[12px] font-[500]"
                                        align="left"
                                      >
                                        Price
                                      </TableCell>
                                      <TableCell
                                        className="text-[#344054] text-[12px] font-[500]"
                                        align="center"
                                      >
                                        Action
                                      </TableCell>
                                      <TableCell
                                        className="text-[#344054] text-[12px] font-[500]"
                                        align="center"
                                      >
                                        Status
                                      </TableCell>
                                      <TableCell
                                        className="text-[#344054] text-[12px] font-[500]"
                                        align="center"
                                      >
                                        Change Status
                                      </TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {elem?.addons &&
                                      elem?.addons.map((elem) => {
                                        return (
                                          <TableRow
                                            key={elem?.id}
                                            sx={{
                                              "&:last-child td, &:last-child th":
                                                { border: 0 },
                                            }}
                                          >
                                            <TableCell>
                                              {elem?.addon_name}
                                            </TableCell>
                                            <TableCell>{elem?.price}</TableCell>
                                            <TableCell>
                                              {elem?.approved == null && (
                                                <TableCell>
                                                  <div className="flex items-center gap-[15px]">
                                                    <div
                                                      className="flex items-center px-[10px] py-[5px] bg-[#ECFDF3] rounded-[16px] justify-center cursor-pointer"
                                                      onClick={() =>
                                                        handleApprove(elem.id)
                                                      }
                                                    >
                                                      <span className="text-[#027A48] text-[12px] font-[500]">
                                                        Approve
                                                      </span>
                                                    </div>
                                                    <div
                                                      className="flex items-center px-[10px] py-[5px] bg-red-100 rounded-[16px] justify-center cursor-pointer"
                                                      onClick={() =>
                                                        handleClickOpen(elem)
                                                      }
                                                    >
                                                      <span className="text-red-500 text-[12px] font-[500]">
                                                        Reject
                                                      </span>
                                                    </div>
                                                  </div>
                                                </TableCell>
                                              )}
                                            </TableCell>
                                            <TableCell align="center">
                                              {elem?.status == true ? (
                                                <div className="flex items-center gap-[5px] py-[5px] bg-[#ECFDF3] rounded-[16px] justify-center">
                                                  <Image
                                                    src="/images/active.svg"
                                                    height={10}
                                                    width={10}
                                                    alt="active"
                                                  />
                                                  <span className="text-[#027A48] text-[12px] font-[500]">
                                                    Active
                                                  </span>
                                                </div>
                                              ) : (
                                                <div className="flex items-center gap-[5px] py-[5px] bg-red-200 rounded-[16px] justify-center">
                                                  <Image
                                                    src="/images/inactive.svg"
                                                    height={10}
                                                    width={10}
                                                    alt="active"
                                                  />
                                                  <span className="text-red-500 text-[12px] font-[500]">
                                                    Inactive
                                                  </span>
                                                </div>
                                              )}
                                            </TableCell>
                                            <TableCell align="center">
                                              <Switch
                                                checked={elem?.status == true}
                                                onChange={() =>
                                                  handleSwitchChange(
                                                    elem?.id,
                                                    elem?.status
                                                  )
                                                }
                                                inputProps={{
                                                  "aria-label": "controlled",
                                                }}
                                                sx={{
                                                  "& .Mui-checked + .MuiSwitch-track":
                                                    {
                                                      backgroundColor:
                                                        elem?.status === 1
                                                          ? "#CFAA4C"
                                                          : "",
                                                    },
                                                  "& .MuiSwitch-thumb": {
                                                    backgroundColor:
                                                      elem?.status === 1
                                                        ? "#CFAA4C"
                                                        : "",
                                                  },
                                                }}
                                              />
                                            </TableCell>
                                          </TableRow>
                                        );
                                      })}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                            </AccordionDetails>
                          </Accordion>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody> */}
            </Table>
          </TableContainer>
        </DialogContent>
      </BootstrapDialog>

      {/* Addons List */}
      <BootstrapDialog
        onClose={handleCloseAddonsList}
        aria-labelledby="customized-dialog-title"
        open={openAddonsList}
        fullWidth
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Addons List
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseAddonsList}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <IoClose />
        </IconButton>
        <DialogContent dividers>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell
                    className="text-[#344054] text-[12px] font-[500]"
                    align="center"
                  >
                    Add on Name
                  </TableCell>
                  <TableCell
                    className="text-[#344054] text-[12px] font-[500]"
                    align="center"
                  >
                    price
                  </TableCell>
                  <TableCell
                    className="text-[#344054] text-[12px] font-[500]"
                    align="center"
                  >
                    Status
                  </TableCell>
                  <TableCell
                    className="text-[#344054] text-[12px] font-[500]"
                    align="center"
                  >
                    Change Status
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {serviceList &&
                  serviceList.map((elem) => {
                    return (
                      <TableRow
                        key={elem?.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell align="center">
                          {elem?.clothing_item_type}
                        </TableCell>
                        <TableCell align="center">
                          {elem?.material_type.includes("null", null)
                            ? "N/A"
                            : elem?.material_type}
                        </TableCell>
                        <TableCell align="center">
                          {elem?.status == true ? (
                            <div className="flex items-center gap-[5px] py-[5px] bg-[#ECFDF3] rounded-[16px] justify-center">
                              <Image
                                src="/images/active.svg"
                                height={10}
                                width={10}
                                alt="active"
                              />
                              <span className="text-[#027A48] text-[12px] font-[500]">
                                Active
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-[5px] py-[5px] bg-red-200 rounded-[16px] justify-center">
                              <Image
                                src="/images/inactive.svg"
                                height={10}
                                width={10}
                                alt="active"
                              />
                              <span className="text-red-500 text-[12px] font-[500]">
                                Inactive
                              </span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell align="center">
                          <Switch
                            checked={elem?.status == true}
                            onChange={() =>
                              handleSwitchChange(elem?.id, elem?.status)
                            }
                            inputProps={{ "aria-label": "controlled" }}
                            sx={{
                              "& .Mui-checked + .MuiSwitch-track": {
                                backgroundColor:
                                  elem.status == true ? "#ac87bf" : "",
                              },
                              "& .MuiSwitch-thumb": {
                                backgroundColor:
                                  elem.status == true ? "#ac87bf" : "",
                              },
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </BootstrapDialog>
    </div>
  );
};

export default VendorServiceType;
