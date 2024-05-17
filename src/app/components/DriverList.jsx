import React, { useCallback, useEffect, useState } from 'react'
import { IoClose } from "react-icons/io5";
import { IoSearch } from "react-icons/io5";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import Switch from '@mui/material/Switch';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Pagination } from '@mui/material';
import Image from 'next/image';
import Swal from 'sweetalert2'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useSnackbar } from '../SnackbarProvider';
import { useRouter } from 'next/navigation';
import axios from "../../../axios";
import { useFormik } from 'formik';
import * as Yup from 'yup';

// const validationSchema = Yup.object({
//   categoryName: Yup.string().required('DriverList Name is required'),
//   category_no: Yup.number().required('DriverList No is required'),
//    image: Yup.mixed().required('Image is required'),
// });

const DriverList = () => {
  const router = useRouter();
  const { openSnackbar } = useSnackbar()
  const [inputValue, setInputValue] = useState('');
  const [open, setOpen] = useState(false);
  const [valToggle, setValToggle] = useState(false);
  const [idCloseDialogue, setIdCloseDialogue] = useState("");
  const [valCloseDialogue, setValCloseDialogue] = useState("");
  const handleOpen = () => setOpen(!open);
  // const [openDialogue, setOpenDialogue] = useState(false)


  const [driverData, setDriverData] = useState([])

  useEffect(() => {
    let unmounted = false;
    if (!unmounted) {
      fetchDriverData()
    }

    return () => { unmounted = true };
  }, [])

  const fetchDriverData = useCallback(
    () => {
      axios.get("/api/delivery-person/list-delivery-persons", {
        headers: {
          Authorization: localStorage.getItem('mykanjeeAdminToken')
        }
      })
        .then((res) => {
          if (res.data.code == 200) {
            setDriverData(res.data.data.data)
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
    },
    [],
  )

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const totalRows = driverData.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const [searchQuery, setSearchQuery] = useState("");
  const filteredRows = driverData.filter((e) =>
    e?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const paginatedRows = filteredRows.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (

    <>
      <div className='px-[20px]  container mx-auto overflow-y-scroll'>
        <div className=' py-[10px] flex flex-col space-y-5'>
          <div className='flex flex-col space-y-1'>
            <span className='text-[30px] text-[#101828] font-[500]'>Driver&apos;s List</span>
            {/* <span className='text-[#667085] font-[400] text-[16px]'>Effortlessly organize your category offerings with intuitive Category Setup for a seamless and structured e-commerce experience.</span> */}
          </div>

          <div className='flex flex-col space-y-1 border border-[#EAECF0] rounded-[8px] p-[10px]'>
            <div className='flex items-center justify-between'>
              <div className='flex space-x-2 items-center'>
                <span className='text-[18px] font-[500] text-[#101828]'>Driver&apos;s Data</span>
                {/*-------------------------------------------------------------------- {categoryData.length} */}
                <span className='px-[10px] py-[5px] bg-[#FCF8EE] rounded-[16px] text-[12px] text-[#A1853C]'> Details</span>
              </div>

              <div className='flex items-center space-x-3 inputText w-[50%]'>
                <IoSearch className='text-[20px]' />
                <input
                  type='text'
                  className='outline-none focus-none w-full'
                  placeholder='Search driver by name here'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

            </div>


            <Paper >
              <TableContainer component={Paper} sx={{ height: '100%', width: '100%' }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow className='!bg-[#F9FAFB]'>
                      {/* {["" , "","","", "" , "", "" ].map((el) => ( */}

                      <TableCell >SL no</TableCell>
                      <TableCell > Name</TableCell>
                      <TableCell > Phone No.</TableCell>
                      <TableCell > Email</TableCell>
                      <TableCell >Address </TableCell>
                      <TableCell >Stage</TableCell>
                      <TableCell >Rejected Reason</TableCell>
                      <TableCell >Action</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {paginatedRows.filter((item) => item).map((elem, i) => {
                      return <TableRow key={i} >
                        <TableCell>{i + 1}</TableCell>
                        <TableCell>   {elem?.name}</TableCell>
                        <TableCell>   {elem?.phone}</TableCell>
                        <TableCell>   {elem?.email}</TableCell>
                        <TableCell>
                          {elem?.address || 'N/A'}
                        </TableCell>
                        <TableCell>
                          {elem?.approved ? 'Approved' : 'Rejected'}
                        </TableCell>
                        <TableCell>   {elem?.reason || 'N/A'}</TableCell>
                        <TableCell>
                          <button
                          className='text-[#FF0000] font-[400] text-[14px] bg-white border border-[#FF0000] rounded-[4px] px-[10px] py-[5px] hover:bg-[#FF0000] hover:text-white'
                          >
                            View
                          </button>
                        </TableCell>
                      </TableRow>
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
            // onClose={handleClose}
            handler={handleOpen}

            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              Add Reason
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                please mentioned here the reason to reject driver login.
                <TextField
                  fullWidth
                  placeholder="reason"
                  variant="outlined"



                  value={inputValue}
                // onChange={handleInputChange}
                />

              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button

                onClick={() => cancelFunction()}
              >
                Cancel
              </Button>
              <Button onClick={() => handleFalse()} >
                <span>Confirm</span>
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </>
  )
}

export default DriverList