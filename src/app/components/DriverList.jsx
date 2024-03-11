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

import  axios  from "axios";
import { useFormik } from 'formik';
import * as Yup from 'yup';

// const validationSchema = Yup.object({
//   categoryName: Yup.string().required('DriverList Name is required'),
//   category_no: Yup.number().required('DriverList No is required'),
//    image: Yup.mixed().required('Image is required'),
// });

const DriverList = () => {
  const  {openSnackbar}  = useSnackbar()
    const [inputValue, setInputValue] = useState('');
    const [open, setOpen] = useState(false);
    const [valToggle, setValToggle] = useState(false);
    const [idCloseDialogue, setIdCloseDialogue] = useState("");
    const [valCloseDialogue, setValCloseDialogue] = useState("");
    const handleOpen = () => setOpen(!open);
    const [driverData, setDriverData] = useState([])
  // const [openDialogue, setOpenDialogue] = useState(false)
  

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const totalRows = driverData.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const [searchQuery, setSearchQuery] = useState("");
  const [handleUpdateValue, sethandleUpdateValue] = useState("");
  const [handleUpdateId, sethandleUpdateId] = useState("");
  const filteredRows = driverData.filter((e) =>
    e?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const paginatedRows = filteredRows.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

    const handleUpdate = async (value, id) => {
        // setSelectedOption(value)

     
    
        await axios.put("http://localhost:3000/auth/active-driver", {statusActive:value, userId:id}, { headers  : {
                // 'Content-Type': 'multipart/form-data', // Adjust the content type based on your API requirements
              'authorization':  localStorage.getItem('logintoken'), // Add any authentication headers if needed
            }})
              .then(response => {
                // Handle success
                console.log('Response:', response);
                getDriverApi()
                openSnackbar("status changed successfully", "success")
              })  
              .catch(error => {
                // Handle error
                console.error('Error:', error);
              });
         
    }
    

    const cancelFunction = async () => {
      await  handleApprove(true, idCloseDialogue)
        handleOpen()
        getDriverApi()
    }

    const handleApprove = async (value, id) => {
       setIdCloseDialogue(id)
      setValCloseDialogue(value)


      console.log("shednhcb", value);
      
        if (value === true) {
         
          

         await axios.put("http://localhost:3000/auth/approve-driver", {approve:value, userId:id}, { headers  : {
            // 'Content-Type': 'multipart/form-data', // Adjust the content type based on your API requirements
          'authorization':  localStorage.getItem('logintoken'), // Add any authentication headers if needed
        }})
          .then(response => {
            getDriverApi()
            openSnackbar("Status changed successfully", "success")
          })  
          .catch(error => {
            // Handle error
            console.error('Error:', error);
          });




        } else {
          handleOpen() 
      }
        
  
      
         
    }
    
    const handleInputChange = (event) => {
        setInputValue(event.target.value);
      };
    const handleFalse = async () => {
        await axios.post("http://localhost:3000/auth/dissa/reason-driver", {reason : inputValue , userId:idCloseDialogue} , { headers  : {
            // 'Content-Type': 'multipart/form-data', // Adjust the content type based on your API requirements
          'authorization':  localStorage.getItem('logintoken'), // Add any authentication headers if needed
        }})
          .then(response => {
            // Handle success
              console.log('Response:', response);
              //   handleOpen()
            setInputValue("") 


             axios.put("http://localhost:3000/auth/approve-driver", {approve:valCloseDialogue, userId:idCloseDialogue}, { headers  : {
              // 'Content-Type': 'multipart/form-data', // Adjust the content type based on your API requirements
            'authorization':  localStorage.getItem('logintoken'), // Add any authentication headers if needed
          }})
            .then(response => {
              getDriverApi()
              openSnackbar("Status changed successfully", "success")
            })  
            .catch(error => {
              // Handle error
              console.error('Error:', error);
            });





            getDriverApi()
            openSnackbar("reason updated successfully", "success")
          })  
          .catch(error => {
            // Handle error
            console.error('Error:', error);
          });
        
        await axios.put("http://localhost:3000/auth/approve-driver", {approve:true, userId:idCloseDialogue}, { headers  : {
            // 'Content-Type': 'multipart/form-data', // Adjust the content type based on your API requirements
          'authorization':  localStorage.getItem('logintoken'), // Add any authentication headers if needed
        }})
          .then(response => {
            // Handle success
              // console.log('Response:', response);
              handleOpen()
            getDriverApi()
            
          })  
          .catch(error => {
            // Handle error
            console.error('Error:', error);
          });
    }

    const getDriverApi = () => {
        axios.get('http://localhost:3000/auth/get-all/driver', {
            // headers: {
            //   'authorization': localStorage.getItem('logintoken')},
          })
            .then(function (response) {
                // handle success
              setDriverData(response.data)
              
               console.log("driver get data", response.data);
            })
            .catch(function (error) {
              // handle error
              console.log(error);
            }) 
    }

    useEffect(() => {
      
        
        getDriverApi()
        
    }, [])

    
  
 

    useEffect(() => {
        axios.get('http://103.174.103.122:3000/auth/category-getall', {
            headers: {
              'authorization': localStorage.getItem('logintoken')},
          })
            .then(function (response) {
                // handle success
                setCatData(response.data.data)
              // console.log("responseCat", response);
            })
            .catch(function (error) {
              // handle error
              console.log(error);
            }) 

    }, [])
  
  
   
  
  return (

    <>
      <div className='px-[20px]  container mx-auto'>
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

                      <TableCell style={{ minWidth: 80 }}>SL no</TableCell>
                      <TableCell style={{ minWidth: 200 }}>ID</TableCell>
                      <TableCell style={{ minWidth: 200 }}> Name</TableCell>
                
                        <TableCell style={{ minWidth: 20 }}>Status </TableCell>
                        <TableCell style={{ minWidth: 200 }}>Approve</TableCell>
                        <TableCell style={{ minWidth: 200 }}>Reason</TableCell>
                        <TableCell style={{ minWidth: 200 }}>Role</TableCell>
                                          
                        <TableCell style={{ minWidth: 200 }}>User Name </TableCell>
                      </TableRow>
                    </TableHead>
                   
                      <TableBody>
                      {paginatedRows.filter( (item) => item ).map((elem,i) => {
                          return   <TableRow key={i} >
                            <TableCell>{ i+1}</TableCell>
                            <TableCell>{elem?._id}</TableCell>
                            <TableCell>   {elem?.name}</TableCell>
                            <TableCell>
                                 <Switch defaultChecked={elem.statusActive} onChange={(event)=>handleUpdate( event.target.checked , elem._id)} />
                            </TableCell>
                            <TableCell>
                              <Switch defaultChecked={elem.approve} onChange={(event) => handleApprove(event.target.checked, elem._id)} />
                            </TableCell>
                            <TableCell>   {elem?.reason}</TableCell>
                            <TableCell> {elem?.role}</TableCell>
                            <TableCell> {elem?.userName}</TableCell>
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
              onChange={handleInputChange}
                />
                
          </DialogContentText>
        </DialogContent>
        <DialogActions>
        <Button
        
           onClick={()=>cancelFunction()}
          >
            Cancel
          </Button>
          <Button   onClick={()=>handleFalse()} >
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