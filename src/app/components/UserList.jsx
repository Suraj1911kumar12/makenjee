import React, { useCallback, useEffect, useState } from "react";
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

// import LoadingSpinner from '../LoadingSpinner';

import axios from "../../../axios";
import { useRouter } from "next/navigation";

const UserList = () => {

  const { openSnackbar } = useSnackbar();
  const router = useRouter()

  // ----------------------------------------------Fetch Category section Starts-----------------------------------------------------
  const [userData, setUserData] = useState([])

  useEffect(() => {
    let unmounted = false;
    if (!unmounted) {
      fetchUserData()
    }

    return () => { unmounted = true };
  }, [])

  const fetchUserData = useCallback(
    () => {
      axios.get("/api/user/fetch-users?type=USER", {
        headers: {
          Authorization: localStorage.getItem('mykanjeeAdminToken')
        }
      })
        .then((res) => {
          if (res.data.code == 200) {
            setUserData(res.data.data)
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
  const totalRows = userData.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const [searchQuery, setSearchQuery] = useState("");

  const filteredRows = userData.filter((e) =>
    e.fullname.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, filteredRows.length);
  const paginatedRows = filteredRows.slice(startIndex, endIndex);

  // ----------------------------------------------Pagination and Search Query section ENDS-----------------------------------------------------

  return (
    <>
      <div className="px-[20px]  container mx-auto">
        <div className=" py-[10px] flex flex-col space-y-5">
          <div className="flex flex-col space-y-1">
            <span className="text-[30px] text-[#101828] font-[500]">
              User&apos;s List
            </span>
            {/* <span className='text-[#667085] font-[400] text-[16px]'>Effortlessly organize your category offerings with intuitive Category Setup for a seamless and structured e-commerce experience.</span> */}
          </div>

          <div className="flex flex-col space-y-3 border border-[#EAECF0] rounded-[8px] p-[10px]">
            <div className="flex items-center justify-between">
              <div className="flex space-x-2 items-center">
                <span className="text-[18px] font-[500] text-[#101828]">
                  User&apos;s Data
                </span>
                {/*-------------------------------------------------------------------- {categoryData.length} */}
                <span className="px-[10px] py-[5px] bg-[#ac87bf] rounded-[16px] text-[12px] text-[#fff]">
                  {userData.length} Users
                </span>
              </div>
              <div className='flex items-center space-x-3 inputText w-[50%]'>
                <IoSearch className='text-[20px]' />
                <input
                  type='text'
                  className='outline-none focus-none w-full'
                  placeholder='Search User Name here'
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
                      <TableCell style={{ minWidth: 200 }}> Name</TableCell>

                      <TableCell style={{ minWidth: 150 }}>Email</TableCell>
                      <TableCell style={{ minWidth: 200 }}>Phone</TableCell>
                    </TableRow>
                  </TableHead>

                  {filteredRows.length > 0 ?
                  <TableBody>
                    {paginatedRows
                      .filter((e) => e)
                      .map((elem, i) => {
                        return (
                          <TableRow key={i}>
                            <TableCell>{startIndex+ i + 1}</TableCell>
                            <TableCell>{elem?.fullname}</TableCell>
                            <TableCell>{elem?.email}</TableCell>
                            <TableCell>{elem?.phone}</TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                    :
                  <TableRow>
                        <TableCell colSpan={7} className='text-center text-[15px] font-bold'>No User found</TableCell>
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
    </>
  );
};

export default UserList;
