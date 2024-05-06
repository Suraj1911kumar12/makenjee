'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { IoClose } from "react-icons/io5";
import { IoSearch } from "react-icons/io5";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import Switch from '@mui/material/Switch';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Pagination } from '@mui/material';
import Image from 'next/image';
import Swal from 'sweetalert2'
import axios from '../../../axios';
import { useSnackbar } from '../SnackbarProvider';
import { useRouter } from 'next/navigation';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));



const Services = () => {
  const { openSnackbar } = useSnackbar();
  const router = useRouter()

  // ----------------------------------------------Fetch Service section Starts-----------------------------------------------------
  const [serviceData, setServiceData] = useState([])

  useEffect(() => {
    let unmounted = false;
    if (!unmounted) {
        fetchServiceData()
    }

    return () => { unmounted = true };
  }, [])

  const fetchServiceData = useCallback(
    () => {
      axios.get("/api/services", {
        headers: {
          Authorization: localStorage.getItem('mykanjeeAdminToken')
        }
      })
        .then((res) => {
          if (res.data.code == 200) {
            setServiceData(res.data.data)
          } else if (res.data.status === 'error' || res.data.message === 'Session expired') {
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

  // ----------------------------------------------Fetch Service section Ends-----------------------------------------------------



  // ----------------------------------------------Pagination and Search Query section Starts-----------------------------------------------------
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const totalRows = serviceData.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const [searchQuery, setSearchQuery] = useState("");

  const filteredRows = serviceData.filter((e) =>
    e.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, filteredRows.length);
  const paginatedRows = filteredRows.slice(startIndex, endIndex);

  // ----------------------------------------------Pagination and Search Query section ENDS-----------------------------------------------------



  // ----------------------------------------------Add Service section Starts-----------------------------------------------------
  const [getServiceName, setServiceName] = useState({
    service_name: ''
  })

  const reset = () => {
    setServiceName({
        service_name: '',
    })

    document.getElementById('service_name').value = ''
    document.getElementById('image').value = ''
    setImage(null)
    setShowImage(null)
  }

  const getData = (e) => {
    const { value, name } = e.target;

    setServiceName(() => {
      return {
        ...getServiceName,
        [name]: value
      }
    })
  }

  // Image uploading section
  const [image, setImage] = useState(null);
  const [showImage, setShowImage] = useState(null)

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(file);
        if (showImage !== e.target.result) {
          setShowImage(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setShowImage(null)
    document.getElementById('image').value = ''; 
  };


  const handleAddCategory = () => {
    if (!image) {
      openSnackbar('Please Select Image', 'error');
      return;
    }
    const formData = new FormData();
    formData.append('name', getServiceName.service_name);
    formData.append('image', image);

    axios.post('/api/services/add', formData, {
      headers: {
        Authorization: localStorage.getItem('mykanjeeAdminToken'),
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(res => {
        if (res.data.status === 'success') {
          fetchServiceData()
          openSnackbar(res.data.message, 'success');
          setImage(null)
          setShowImage(null)
          reset()
        } else {
          openSnackbar(res.data.message, 'error');
        }
      })
      .catch(err => {
        console.log(err)
        openSnackbar(err.response.data.message, 'error');
      })
  }

  // ----------------------------------------------Add Service section Ends-----------------------------------------------------



  // ----------------------------------------------Change status section Starts-----------------------------------------------------
  const handleSwitchChange = (id, status) => {
    axios.post(`/api/category/${id}/${!status ? true : false }`, {}, {
      headers: {
        Authorization: localStorage.getItem('mykanjeeAdminToken')
      }
    }).then(res => {
      if (res.data.status === 'success') {
        openSnackbar(res.data.message, 'success');
        fetchCategoryData()
      }
    })
      .catch(err => {
        console.log(err)
      })
  };
  // ----------------------------------------------Change status section Ends-----------------------------------------------------


  // ----------------------------------------------Edit Service section Starts-----------------------------------------------------
  const [getCategoryEdit, setGetCategoryEdit] = useState({
    edit_category_name: ''
  })

  const getEditData = (e) => {
    const { value, name } = e.target;

    setGetCategoryEdit(() => {
      return {
        ...getCategoryEdit,
        [name]: value
      }
    })
  }

  // Image uploading section
  const [imageEdit, setImageEdit] = useState(null);
  const [showImageEdit, setShowImageEdit] = useState(null)

  const handleImageChangeEdit = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageEdit(file);
        setShowImageEdit(e.target.result)
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImageEdit = () => {
    setImageEdit(null);
    setShowImageEdit(null)
  };

  const [open1, setOpen1] = React.useState(false);

  const handleClickOpen1 = () => {
    setOpen1(true);
  };
  const handleClose1 = () => {
    setImageEdit(null)
    setShowImageEdit(null)
    setOpen1(false);
    setEditData({})
  };

  const [editData, setEditData] = useState({})
  console.log('editData',editData)

  const handleEdit = (data) => {
    setOpen1(true)
    setEditData(data)
  }

  const handleEditCategory = () => {
    const formData = new FormData();
    formData.append('service_id', editData.id);
    formData.append('name', getCategoryEdit.edit_category_name || editData.category_name);
    if (imageEdit) {
      formData.append('image', imageEdit);
    }
    axios.post(`/api/services/update`, formData, {
      headers: {
        Authorization: localStorage.getItem('mykanjeeAdminToken'),
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(res => {
        console.log(res)
        if (res.data.status === 'success') {
          openSnackbar(res.data.message, 'success');
          fetchServiceData()
          setImageEdit(null)
          setShowImageEdit(null)
          setEditData({})
          setOpen1(false)
        } else {
          openSnackbar(res.data.message, 'error');
        }
      })
      .catch(err => {
        console.log(err)
        openSnackbar(err.response.data.message, 'error');
      })
  }
  // ----------------------------------------------Edit Category section Ends-----------------------------------------------------



  // ----------------------------------------------Delete Category section Starts-----------------------------------------------------
  const deleteService = (data) => {
    Swal.fire({
      title: "Delete",
      text: `Do you want to Delete this ${data.name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#CFAA4C",
      cancelButtonColor: "#d33",
      cancelButtonText: "No",
      confirmButtonText: "Yes! Delete it"
    }).then((result) => {
      if (result.isConfirmed) {
        axios.post(`/api/delete-categories?category_id=${data.id}`, {}, {
          headers: {
            Authorization: localStorage.getItem('kardifyAdminToken')
          }
        })
          .then(res => {
            if (res.data.code == 200) {
              fetchCategoryData()
              openSnackbar(res.data.message, 'success');
              if (page > 1 && paginatedRows.length === 1) {
                setPage(page - 1);
              }
            }
          })
          .catch(err => {
            console.log(err)
          })
      }
    });
  };

  // ----------------------------------------------Delete Category section Ends-----------------------------------------------------

  return (

    <>
      <div className='px-[20px]  container mx-auto overflow-y-scroll'>
        {/* {!isEditable ? */}
        <div className=' py-[10px] flex flex-col space-y-5'>
          <div className='flex flex-col space-y-1'>
            <span className='text-[30px] text-[#101828] font-[500]'>Services Setup</span>
            <span className='text-[#667085] font-[400] text-[16px]'>Effortlessly organize your product offerings with intuitive Category Setup for a seamless and structured e-commerce experience.</span>
          </div>

          <div className='flex items-center justify-between gap-[10px]'>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Service Name *</span>
              <input type='text' placeholder='Ex: service name' id='service_name' className='inputText' name='service_name' onChange={getData} />
            </div>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Service Image *</span>
              <input id="image" type='file' accept='image/*' onChange={handleImageChange} />
            </div>

            {showImage && (
              <div className="relative bg-[#D8C7B6] rounded-[8px]">
                <img src={showImage} alt='Uploaded Preview' width='200' className='rounded-[8px]' />
                <span onClick={handleRemoveImage} className="absolute top-[-15px] right-0 bg-transparent text-black cursor-pointer">
                  <IoClose onClick={handleRemoveImage}/>
                </span>
              </div>
            )}
          </div>

          <div className='flex items-center gap-[24px] justify-end'>
            <span className='resetButton' onClick={reset}>Reset</span>
            <span className='submitButton' onClick={handleAddCategory}>Submit</span>
          </div>

          <div className='flex flex-col space-y-1 border border-[#EAECF0] rounded-[8px] p-[10px]'>
            <div className='flex items-center justify-between'>
              <div className='flex space-x-2 items-center'>
                <span className='text-[18px] font-[500] text-[#101828]'>Service Table</span>
                <span className='px-[10px] py-[5px] bg-[#FCF8EE] rounded-[16px] text-[12px] text-[#A1853C]'>{serviceData.length} Services</span>
              </div>
              <div className='flex items-center space-x-3 inputText w-[50%]'>
                <IoSearch className='text-[20px]' />
                <input
                  type='text'
                  className='outline-none focus-none w-full'
                  placeholder='Search Service Name here'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Table content here */}
            <Paper >
              <TableContainer component={Paper} sx={{ height: '100%', width: '100%' }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow className='!bg-[#F9FAFB]'>
                      <TableCell style={{ minWidth: 80 }}>SL no</TableCell>
                      <TableCell style={{ minWidth: 150 }}>Service image</TableCell>
                      <TableCell style={{ minWidth: 200 }}>Service Name</TableCell>
                      {/* <TableCell style={{ minWidth: 50 }}>Delete</TableCell> */}
                      <TableCell style={{ minWidth: 50 }}>Edit</TableCell>
                    </TableRow>
                  </TableHead>
                  {filteredRows.length > 0 ?
                    <TableBody>
                      {paginatedRows.map((row, i) => (
                        <TableRow key={i} >
                          <TableCell>{startIndex + i + 1}</TableCell>
                          <TableCell>
                            <Image src={row.image || ''} width={50} height={50} alt={row.category_name} className='rounded-[8px]' />
                          </TableCell>
                          <TableCell>{row.name}</TableCell>
                          {/* <TableCell ><FaRegTrashAlt className='cursor-pointer' onClick={() => deleteService(row)} /></TableCell> */}
                          <TableCell><FaEdit className='cursor-pointer' onClick={() => handleEdit(row)} /></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    :
                    <TableRow>
                      <TableCell colSpan={7} className='text-center text-[15px] font-bold'>No Services found</TableCell>
                    </TableRow>
                  }
                </Table>
              </TableContainer>
            </Paper>

            {filteredRows.length > rowsPerPage && (
              <div className='flex justify-center mt-3'>
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
          onClose={handleClose1}
          aria-labelledby="customized-dialog-title"
          open={open1}
          fullWidth
        >
          <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
            Edit Service
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleClose1}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}>
            <CloseIcon />
          </IconButton>
          <DialogContent dividers>
            <div className='flex flex-col space-y-2'>
              <span className='text-[#344054] text-[14px] font-[500]'>Service Name</span>
              <input type='text' defaultValue={editData.name} className='inputText' placeholder='Ex: Colour' name='edit_category_name' onChange={getEditData} />
            </div>

            <div className='flex flex-col space-y-2 py-5'>
              <span className='text-[#344054] text-[14px] font-[500]'>Choose Service Image</span>
              <input type='file' accept='image/*' onChange={handleImageChangeEdit} />
            </div>

            {editData && (
              <div className="relative rounded-[8px]">
                <Image src={showImageEdit || editData.image || ''} alt='Uploaded Preview' width='100' height={100} className='rounded-[8px]' />
                <span onClick={handleRemoveImageEdit} className={`absolute top-[-15px] bg-transparent text-black cursor-pointer ${!showImageEdit ? 'hidden' : 'block'}`}>
                  <IoClose />
                </span>
              </div>
            )}
          </DialogContent>
          <DialogActions className='justify-between'>
            <span onClick={handleClose1} className='px-[18px] py-[10px] border border-[#D0D5DD] rounded-[8px] w-[50%] text-center cursor-pointer'>
              Cancel
            </span>
            <span autoFocus onClick={handleEditCategory} className='bg-[#CFAA4C] rounded-[8px] border-[#CFAA4C] w-[50%] py-[10px] text-center cursor-pointer text-[#fff] hover:opacity-70'>
              Save Changes
            </span>
          </DialogActions>
        </BootstrapDialog>
      </div>
    </>
  )
}

export default Services