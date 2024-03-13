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
  Accordion, AccordionSummary, AccordionDetails,
  CircularProgress,
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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

import axios from "../../../axios";

const OrderList = () => {

  const { openSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);

  const [activeTab, setActiveTab] = useState('ALL ORDERS');
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const [allOrdersData, setAllOrdersData] = useState([])
  useEffect(() => {
    fetchAllOrderData();
  }, [activeTab]);

  const fetchAllOrderData = useCallback(
    () => {
      setIsLoading(true);
      axios.get(`/api/order?order_status=${activeTab}`, {
        headers: {
          Authorization: localStorage.getItem('mykanjeeAdminToken')
        }
      })
        .then((res) => {
          if (res.data.status === "success") {
            setAllOrdersData(res.data.data)
          } else if (res.data.message === 'Session expired') {
            openSnackbar(res.data.message, 'error');
            router.push('/login')
          }
        })
        .catch(err => {
          console.log(err)
          if (err.response && err.response.data.statusCode === 400) {
            router.push('/login')
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [activeTab],
  )


  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const totalRows = allOrdersData.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const [searchQuery, setSearchQuery] = useState("");
  const filteredRows = allOrdersData.filter((e) =>
    e?.order_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, filteredRows.length);
  const paginatedRows = filteredRows.slice(startIndex, endIndex);

  const convertInRupee = (number) => {
    return number.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  return (
    <>
      <div className="px-[20px]  container mx-auto overflow-y-scroll">
        <div className=" py-[10px] flex flex-col space-y-5">
          <div className="flex flex-col space-y-1">
            <span className="text-[30px] text-[#101828] font-[500]">
              Order&apos;s List
            </span>
            {/* <span className='text-[#667085] font-[400] text-[16px]'>Effortlessly organize your category offerings with intuitive Category Setup for a seamless and structured e-commerce experience.</span> */}
          </div>

          <div className='grid grid-cols-3 gap-4 py-[20px]'>
            <div className={`px-[24px] py-[12px] rounded-[8px]  text-[14px] cursor-pointer ${activeTab === 'ALL ORDERS' ? 'bg-[#ac87bf] text-[#fff]' : 'bg-[#f9fafb]'}`} onClick={() => handleTabChange('ALL ORDERS')}>
              <div className='flex justify-between items-center'>
                <span>All Orders</span>
              </div>
            </div>
            <div className={`px-[24px] py-[12px] rounded-[8px]  text-[14px] cursor-pointer ${activeTab === 'NEW ORDERS' ? 'bg-[#ac87bf] text-[#fff]' : 'bg-[#f9fafb]'}`} onClick={() => handleTabChange('NEW ORDERS')}>
              <div className='flex justify-between items-center'>
                <span>New Orders</span>
              </div>
            </div>
            <div className={`px-[24px] py-[12px] rounded-[8px]  text-[14px] cursor-pointer ${activeTab === 'ACCEPTED ORDERS' ? 'bg-[#ac87bf] text-[#fff]' : 'bg-[#f9fafb]'}`} onClick={() => handleTabChange('ACCEPTED ORDERS')}>
              <div className='flex justify-between items-center'>
                <span>Accepted Orders</span>
              </div>
            </div>
            <div className={`px-[24px] py-[12px] rounded-[8px]  text-[14px] cursor-pointer ${activeTab === 'REJECTED ORDERS' ? 'bg-[#ac87bf] text-[#fff]' : 'bg-[#f9fafb]'}`} onClick={() => handleTabChange('REJECTED ORDERS')}>
              <div className='flex justify-between items-center'>
                <span>Rejected Orders</span>
              </div>
            </div>
            <div className={`px-[24px] py-[12px] rounded-[8px]  text-[14px] cursor-pointer ${activeTab === 'COMPLETED ORDERS' ? 'bg-[#ac87bf] text-[#fff]' : 'bg-[#f9fafb]'}`} onClick={() => handleTabChange('COMPLETED ORDERS')}>
              <div className='flex justify-between items-center'>
                <span>Completed Orders</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-1 border border-[#EAECF0] rounded-[8px] p-[10px]">
            <div className="flex items-center justify-between">
              <div className="flex space-x-2 items-center">
                <span className="text-[18px] font-[500] text-[#101828]">
                  Order&apos;s Data
                </span>
                {/*-------------------------------------------------------------------- {categoryData.length} */}
                <span className="px-[10px] py-[5px] bg-[#ac87bf] rounded-[16px] text-[12px] text-[#fff]">
                  {allOrdersData.length} Orders
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
                      <TableCell style={{ minWidth: 200 }}>User Name</TableCell>
                      <TableCell style={{ minWidth: 150 }}>Total Cgst</TableCell>
                      <TableCell style={{ minWidth: 150 }}>Total Igst</TableCell>
                      <TableCell style={{ minWidth: 150 }}>Total Sgst</TableCell>
                      <TableCell style={{ minWidth: 150 }}>Total Shipping</TableCell>
                      <TableCell style={{ minWidth: 200 }}>Total Product Amount</TableCell>
                      <TableCell style={{ minWidth: 200 }}>total Amount</TableCell>
                      <TableCell style={{ minWidth: 200 }}>Action </TableCell>
                    </TableRow>
                  </TableHead>

                  {isLoading ? (
                    <div className="h-[400px] flex justify-center w-full">
                      <CircularProgress />
                    </div>
                  ) :
                    <>
                      {filteredRows.length > 0 ?
                        <TableBody>
                          {paginatedRows
                            .filter((item) => item)
                            .map((elem, i) => {
                              return (
                                <TableRow key={i}>
                                  <TableCell>{i + 1}</TableCell>
                                  <TableCell>
                                    <Accordion className="custom-accordion">
                                      <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1a-content"
                                        id="panel1a-header"
                                        className="p-[0px]"
                                      >
                                      <div className="flex items-center justify-between w-full">
                                        {elem?.order_id}
                                        <span className="text-[10px] font-[600]">Click to Expand / Hide Tab</span>
                                      </div>
                                      </AccordionSummary>
                                      <AccordionDetails className="p-[0px]">
                                      <Paper>
                                        <Table
                                          component={Paper}
                                          sx={{ height: "100%", width: "100%" }}>
                                          <TableHead>
                                            <TableRow>
                                              <TableCell style={{ minWidth: 150 }}>Product</TableCell>
                                              <TableCell style={{ minWidth: 150 }}>Category</TableCell>
                                              <TableCell style={{ minWidth: 150 }}>Total CGST</TableCell>
                                              <TableCell style={{ minWidth: 150 }}>Total IGST</TableCell>
                                              <TableCell style={{ minWidth: 150 }}>Total SGST</TableCell>
                                              <TableCell style={{ minWidth: 150 }}>Total Price</TableCell>
                                            </TableRow>
                                          </TableHead>
                                          <TableBody>
                                            {elem.order_details.map((detail, index) => (
                                              <TableRow key={index}>
                                                <TableCell>{detail.product.display_name}</TableCell>
                                                <TableCell>{detail.product.category.category_name}</TableCell>
                                                <TableCell>{convertInRupee(detail.total_cgst)}</TableCell>
                                                <TableCell>{convertInRupee(detail.total_igst)}</TableCell>
                                                <TableCell>{convertInRupee(detail.total_sgst)}</TableCell>
                                                <TableCell>{convertInRupee(detail.total_price)}</TableCell>
                                              </TableRow>
                                            ))}
                                          </TableBody>
                                        </Table>
                                      </Paper>
                                      </AccordionDetails>
                                    </Accordion>
                                  </TableCell>
                                  <TableCell> {convertInRupee(elem?.user.fullname)}</TableCell>
                                  <TableCell> {convertInRupee(elem?.total_cgst)}</TableCell>
                                  <TableCell> {convertInRupee(elem?.total_igst)}</TableCell>
                                  <TableCell> {convertInRupee(elem?.total_sgst)}</TableCell>
                                  <TableCell> {convertInRupee(elem?.total_shipping)}</TableCell>
                                  <TableCell> {convertInRupee(elem?.total_product_amount)}</TableCell>
                                  <TableCell> {convertInRupee(elem?.total_amount)}</TableCell>
                                  <TableCell>
                                    <div className='flex items-center px-[10px] py-[5px] bg-[#ECFDF3] rounded-[16px] justify-center cursor-pointer'>
                                      <span className='text-[#027A48] text-[12px] font-[500]'>Assign to Delivery</span>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                        </TableBody>
                        :
                        <TableRow>
                          <TableCell colSpan={7} className='text-center text-[15px] font-bold'>No Orders found</TableCell>
                        </TableRow>
                      }
                    </>
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

          {/* <Dialog
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
          </Dialog> */}
        </div>
      </div>
    </>
  );
};

export default OrderList;
