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
import { MdAdd } from 'react-icons/md';


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));


// import LoadingSpinner from '../LoadingSpinner';


const Banks = () => {
    const { openSnackbar } = useSnackbar();
    const router = useRouter()

    // ----------------------------------------------Fetch Category section Starts-----------------------------------------------------
    const [bankData, setBankData] = useState([])

    useEffect(() => {
        let unmounted = false;
        if (!unmounted) {
            fetchbankData()
        }

        return () => { unmounted = true };
    }, [])

    const fetchbankData = useCallback(
        () => {
            axios.get("/api/bank/get-all-banks", {
                headers: {
                    Authorization: localStorage.getItem('mykanjeeAdminToken')
                }
            })
                .then((res) => {
                    if (res.data.code == 200) {
                        setBankData(res.data.message)
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

    // ----------------------------------------------Fetch Category section Ends-----------------------------------------------------



    // ----------------------------------------------Pagination and Search Query section Starts-----------------------------------------------------
    const [page, setPage] = useState(1);
    const rowsPerPage = 10;
    const totalRows = bankData.length;
    const totalPages = Math.ceil(totalRows / rowsPerPage);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const [searchQuery, setSearchQuery] = useState("");

    const filteredRows = bankData.filter((e) =>
        e.bank_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, filteredRows.length);
    const paginatedRows = filteredRows.slice(startIndex, endIndex);

    // ----------------------------------------------Pagination and Search Query section ENDS-----------------------------------------------------



    // ----------------------------------------------Add Category section Starts-----------------------------------------------------
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const [getbankName, setBankName] = useState({
        bank_name: ''
    })

    const reset = () => {
        setBankName({
            bank_name: ''
        })
        handleClose()
    }

    const getData = (e) => {
        const { value, name } = e.target;

        setBankName(() => {
            return {
                ...getbankName,
                [name]: value
            }
        })
    }

    const handleAddBank = () => {
        axios.post('/api/bank/add-banks', {
            bank_name: getbankName.bank_name
        }, {
            headers: {
                Authorization: localStorage.getItem('mykanjeeAdminToken')
            },
        })
            .then(res => {
                if (res.data.status === 'success') {
                    fetchbankData()
                    openSnackbar(res.data.message, 'success');
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

    // ----------------------------------------------Add Category section Ends-----------------------------------------------------


    // ----------------------------------------------Edit Category section Starts-----------------------------------------------------
    const [getbankEdit, setEditBankName] = useState({
        edit_bank_name: ''
    })

    const getEditData = (e) => {
        const { value, name } = e.target;

        setEditBankName(() => {
            return {
                ...getbankEdit,
                [name]: value
            }
        })
    }

    const [open1, setOpen1] = React.useState(false);

    const handleClose1 = () => {
        setOpen1(false);
    };

    const [editData, setEditData] = useState({})
    const handleEdit = (data) => {
        setOpen1(true)
        setEditData(data)
    }

    const handleEditBank = () => {
        axios.post(`/api/bank/edit-banks`, {
            bank_id: editData.id,
            bank_name: getbankEdit.edit_bank_name || editData.bank_name
        }, {
            headers: {
                Authorization: localStorage.getItem('mykanjeeAdminToken')
            },
        })
            .then(res => {
                console.log(res)
                if (res.data.status === 'success') {
                    fetchbankData()
                    openSnackbar(res.data.message, 'success');
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
    const deleteBank = (data) => {
        Swal.fire({
            title: "Delete",
            text: `Do you want to Delete this ${data.bank_name}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#CFAA4C",
            cancelButtonColor: "#d33",
            cancelButtonText: "No",
            confirmButtonText: "Yes! Delete it"
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post(`/api/bank/delete-banks?bank_id=${data.id}`, {}, {
                    headers: {
                        Authorization: localStorage.getItem('mykanjeeAdminToken')
                    }
                })
                    .then(res => {
                        if (res.data.code == 200) {
                            fetchbankData()
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
                        <span className='text-[30px] text-[#101828] font-[500]'>Banks Setup</span>
                        <span className='text-[#667085] font-[400] text-[16px]'>Effortlessly organize your product offerings with intuitive Category Setup for a seamless and structured e-commerce experience.</span>
                    </div>

                    <div className='flex flex-col space-y-1 border border-[#EAECF0] rounded-[8px] p-[10px]'>
                        <div className='flex items-center justify-between'>
                            <div className='flex space-x-2 items-center'>
                                <span className='text-[18px] font-[500] text-[#101828]'>Banks List</span>
                                <span className='px-[10px] py-[5px] bg-[#FCF8EE] rounded-[16px] text-[12px] text-[#A1853C]'>{bankData.length} Banks</span>
                            </div>
                            <div className='flex items-center space-x-3 inputText w-[50%]'>
                                <IoSearch className='text-[20px]' />
                                <input
                                    type='text'
                                    className='outline-none focus-none w-full'
                                    placeholder='Search Bank Name here'
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className='flex items-center gap-[5px] px-[18px] py-[10px] bg-[#cfaa4c] rounded-[8px] cursor-pointer hover:opacity-70' onClick={handleClickOpen}>
                                <MdAdd className='text-[#fff] text-[16px] font-[600]' />
                                <span className=' text-[16px] text-[#fff] font-[600]'>Add New bank</span>
                            </div>
                        </div>

                        {/* Table content here */}
                        <Paper>
                            <TableContainer component={Paper} sx={{ height: '100%', width: '100%' }}>
                                <Table stickyHeader aria-label="sticky table">
                                    <TableHead>
                                        <TableRow className='!bg-[#F9FAFB]'>
                                            {/* Define your table header columns */}
                                            <TableCell style={{ minWidth: 80 }}>SL no</TableCell>
                                            <TableCell style={{ minWidth: 200 }}>Bank Name</TableCell>
                                            <TableCell style={{ minWidth: 50 }}>Delete</TableCell>
                                            <TableCell style={{ minWidth: 50 }}>Edit</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    {filteredRows.length > 0 ?
                                        <TableBody>
                                            {paginatedRows.map((row, i) => (
                                                <TableRow key={i} >
                                                    <TableCell>{startIndex + i + 1}</TableCell>
                                                    <TableCell>{row.bank_name}</TableCell>
                                                    <TableCell ><FaRegTrashAlt className='cursor-pointer' onClick={() => deleteBank(row)} /></TableCell>
                                                    <TableCell><FaEdit className='cursor-pointer' onClick={() => handleEdit(row)} /></TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                        :
                                        <TableRow>
                                            <TableCell colSpan={7} className='text-center text-[15px] font-bold'>No Banks found</TableCell>
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
                    onClose={handleClose}
                    aria-labelledby="customized-dialog-title"
                    open={open}
                    fullWidth
                >
                    <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                        Add New Bank Name
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
                        <CloseIcon />
                    </IconButton>
                    <DialogContent dividers>
                        <div className='flex flex-col space-y-2'>
                            <span className='text-[#344054] text-[14px] font-[500]'>Bank Name</span>
                            <input type='text' className='inputText' placeholder='Ex: HDFC' name='bank_name' onChange={getData} />
                        </div>
                    </DialogContent>
                    <DialogActions className='justify-between'>
                        <span onClick={handleClose} className='px-[18px] py-[10px] border border-[#D0D5DD] rounded-[8px] w-[50%] text-center cursor-pointer'>
                            Cancel
                        </span>
                        <span autoFocus onClick={handleAddBank} className='bg-[#CFAA4C] rounded-[8px] border-[#CFAA4C] w-[50%] py-[10px] text-center cursor-pointer text-[#fff] hover:opacity-70'>
                            Submit
                        </span>
                    </DialogActions>
                </BootstrapDialog>

                <BootstrapDialog
                    onClose={handleClose1}
                    aria-labelledby="customized-dialog-title"
                    open={open1}
                    fullWidth
                >
                    <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                        Edit Bank Name
                    </DialogTitle>
                    <IconButton
                        aria-label="close"
                        onClick={handleClose1}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <DialogContent dividers>
                        <div className='flex flex-col space-y-2'>
                            <span className='text-[#344054] text-[14px] font-[500]'>Bank Name</span>
                            <input type='text' className='inputText' defaultValue={editData.bank_name} placeholder='Ex: HDFC' name='edit_bank_name' onChange={getEditData} />
                        </div>
                    </DialogContent>
                    <DialogActions className='justify-between'>
                        <span onClick={handleClose1} className='px-[18px] py-[10px] border border-[#D0D5DD] rounded-[8px] w-[50%] text-center cursor-pointer'>
                            Cancel
                        </span>
                        <span autoFocus onClick={handleEditBank} className='bg-[#CFAA4C] rounded-[8px] border-[#CFAA4C] w-[50%] py-[10px] text-center cursor-pointer text-[#fff] hover:opacity-70'>
                            Change it
                        </span>
                    </DialogActions>
                </BootstrapDialog>
            </div>
        </>
    )
}

export default Banks