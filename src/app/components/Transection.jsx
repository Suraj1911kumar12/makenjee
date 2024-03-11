import React, { useCallback, useEffect, useState } from "react";
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Pagination } from '@mui/material';
import axios from "../../../axios";

import Button from '@mui/material/Button';
import { IoSearch } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useSnackbar } from "../SnackbarProvider";


const Transection = () => {
  const { openSnackbar } = useSnackbar();
  const router = useRouter()

  const [transactionData, setTransactionData] = useState([])
  console.log('transactionData', transactionData)
  useEffect(() => {
    let unmounted = false;
    if (!unmounted) {
      fetchTransactionData()
    }

    return () => { unmounted = true };
  }, [])

  const fetchTransactionData = useCallback(
    () => {
      axios.get("/api/payment", {
        headers: {
          Authorization: localStorage.getItem('mykanjeeAdminToken')
        }
      })
        .then((res) => {
          if (res.data.code == 200) {
            setTransactionData(res.data.data)
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
  const totalRows = transactionData.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const [searchQuery, setSearchQuery] = useState("");
  const filteredRows = transactionData.filter((e) =>
    e?.ord_id?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const paginatedRows = filteredRows.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );


  const convertInRupee = (number) => {
    return number.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
  return (
    <div className="px-[20px]  container mx-auto">
      <div className=" py-[10px] flex flex-col space-y-5">
        <div className="flex flex-col space-y-1">
          <span className="text-[30px] text-[#101828] font-[500]">
            Transaction List
          </span>
          {/* <span className='text-[#667085] font-[400] text-[16px]'>Effortlessly organize your category offerings with intuitive Category Setup for a seamless and structured e-commerce experience.</span> */}
        </div>

        <div className="flex flex-col space-y-1 border border-[#EAECF0] rounded-[8px] p-[10px]">
          <div className="flex items-center justify-between">
            <div className="flex space-x-2 items-center">
              <span className="text-[18px] font-[500] text-[#101828]">
                Transaction&apos;s Data
              </span>
              {/*-------------------------------------------------------------------- {categoryData.length} */}
              <span className="px-[10px] py-[5px] bg-[#FCF8EE] rounded-[16px] text-[12px] text-[#A1853C]">
                details
              </span>
            </div>
            <div className='flex items-center space-x-3 inputText w-[50%]'>
              <IoSearch className='text-[20px]' />
              <input
                type='text'
                className='outline-none focus-none w-full'
                placeholder='Search transection by Order-Id here'
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
                    <TableCell style={{ minWidth: 200 }}>Order Id</TableCell>
                    <TableCell style={{ minWidth: 150 }}>Date</TableCell>
                    <TableCell style={{ minWidth: 150 }}>Seller Name</TableCell>
                    <TableCell style={{ minWidth: 140 }}>Total Amount</TableCell>
                    <TableCell style={{ minWidth: 150 }}> Payable Amount </TableCell>
                    <TableCell style={{ minWidth: 120 }}>Commission Amount</TableCell>
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
                              {elem?.ord_id}
                            </TableCell>
                            <TableCell>
                              {new Date(elem?.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              {elem?.seller.fullname}
                            </TableCell>
                            <TableCell>
                              {convertInRupee(elem?.total_amount)}
                            </TableCell>
                            <TableCell>
                              {convertInRupee(elem.payable_amount)}
                            </TableCell>
                            <TableCell>
                              {convertInRupee(elem.commission_amount)}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                  :
                  <TableRow>
                    <TableCell colSpan={7} className='text-center text-[15px] font-bold'>No Transaction Data found</TableCell>
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

      </div>
    </div>
  );
};
export default Transection;
