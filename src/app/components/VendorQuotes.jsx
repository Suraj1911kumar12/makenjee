import React, { useCallback, useEffect, useState } from 'react'
import { IoClose } from "react-icons/io5";
import { IoSearch } from "react-icons/io5";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import Switch from '@mui/material/Switch';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Pagination } from '@mui/material';
import Image from 'next/image';
import Swal from 'sweetalert2'
import { useSnackbar } from '../SnackbarProvider';

// import LoadingSpinner from '../LoadingSpinner';

import  axios  from "axios";
import { useFormik } from 'formik';
import * as Yup from 'yup';



// const validationSchema = Yup.object({
//   categoryName: Yup.string().required('VendorQuotes Name is required'),
//   category_no: Yup.number().required('VendorQuotes No is required'),
//    image: Yup.mixed().required('Image is required'),
// });

const VendorQuotes = () => {
  const [userData, setUserData] = useState([])
  const [quoteData, setQuoteData] = useState([])
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const totalRows = quoteData.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const [searchQuery, setSearchQuery] = useState("");
  const filteredRows = quoteData.filter((e) => e?.selectedService?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const paginatedRows = filteredRows.slice((page - 1) * rowsPerPage, page * rowsPerPage)


      

   

  useEffect(() => {
      axios.get('http://103.174.103.122:3000/auth/services/quotes-get-all', {
          headers: {
            'authorization': localStorage.getItem('logintoken')},
        })
          .then(function (response) {
              // handle success
              setQuoteData(response.data.data)
            console.log("responseqq", response.data.data);
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
              <span className='text-[30px] text-[#101828] font-[500]'>Quotes List</span>
              {/* <span className='text-[#667085] font-[400] text-[16px]'>Effortlessly organize your category offerings with intuitive Category Setup for a seamless and structured e-commerce experience.</span> */}
            </div>

            <div className='flex flex-col space-y-1 border border-[#EAECF0] rounded-[8px] p-[10px]'>
              <div className='flex items-center justify-between'>
                <div className='flex space-x-2 items-center'>
                <span className='text-[18px] font-[500] text-[#101828]'>Vendor Quote&apos;s Data</span>
                {/*-------------------------------------------------------------------- {categoryData.length} */}
                  <span className='px-[10px] py-[5px] bg-[#FCF8EE] rounded-[16px] text-[12px] text-[#A1853C]'> Quotes</span>
              </div>
              <div className='flex items-center space-x-3 inputText w-[50%]'>
                  <IoSearch className='text-[20px]' />
                  <input
                    type='text'
                    className='outline-none focus-none w-full'
                    placeholder='Search service by name here'
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
                                 
                      <TableCell style={{ minWidth: 80 }}>SL no</TableCell>
                      <TableCell style={{ minWidth: 80 }}>Service Name</TableCell>
                      <TableCell style={{ minWidth: 200 }}> Price</TableCell>
                        <TableCell style={{ minWidth: 150 }}>status</TableCell>
                        <TableCell style={{ minWidth: 200 }}>Seller Name</TableCell>
                        
                      </TableRow>
                    </TableHead>
                   
                      <TableBody>
                    {paginatedRows?.filter(e=>e).map((elem,i) => {
                          return   <TableRow key={i} >
                            <TableCell>{ i+1}</TableCell>
                            <TableCell>  {elem?.selectedService}</TableCell>
                            <TableCell>  {elem?.estimatedPrice}</TableCell>
                            <TableCell> {elem?.status}</TableCell>
                            <TableCell>{elem?.serviceCategory?.serviceCatName}</TableCell> 
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
        </div>
        
          

         
        
      </div>
    </>
  )
}

export default VendorQuotes