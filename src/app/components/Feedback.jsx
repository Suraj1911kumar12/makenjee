
import React, { useEffect, useState } from "react";
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Pagination } from '@mui/material';
import axios from "axios";

import Button from '@mui/material/Button';
import { IoSearch } from "react-icons/io5";

const Feedback = () => {


    const [feedbackData, setFeedbackData] = useState([])


    const [page, setPage] = useState(1);
    const rowsPerPage = 10;
    const totalRows = feedbackData.length;
    const totalPages = Math.ceil(totalRows / rowsPerPage);
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
    const [searchQuery, setSearchQuery] = useState("");
    const filteredRows = feedbackData.filter((e) =>
      e?.sellerName?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const paginatedRows = filteredRows.slice(
      (page - 1) * rowsPerPage,
      page * rowsPerPage
    );
    

const handleDelete = async (id) => {
console.log("agagga", id);
// return
  try {
    // Replace 'YOUR_API_ENDPOINT' with the actual API endpoint for deleting a category
    const response = await axios.delete(`http://103.174.103.122:3000/auth/feedback-delete/${id}`, {
      headers: {
        // 'Content-Type': 'application/json', // Adjust the content type based on your API requirements
        'authorization': localStorage.getItem('logintoken'), // Add any authentication headers if needed
      },
    });
    getFeedback()

    // Handle the response
    console.log('Response:', response);
  } catch (error) {
    // Handle errors
    console.error('Error:', error);
  }
};


const handleCategoryEdit = (id) => {
  // console.log("iddddd",id);
  navigate(`addcategory/${id}`)
}



const getFeedback=() => {
  axios.get('http://103.174.103.122:3000/auth/feedback-get', {
    headers: {
      'authorization': localStorage.getItem('logintoken')},
  })
    .then(function (response) {
        // handle success
        setFeedbackData(response.data.data)
      console.log("response", response);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    }) 
}

  useEffect(() => {
    getFeedback()
  }, [])
  return (
    <div> <div className="px-[20px]  container mx-auto">
    <div className=" py-[10px] flex flex-col space-y-5">
      <div className="flex flex-col space-y-1">
        <span className="text-[30px] text-[#101828] font-[500]">
          Feedback List
        </span>
        {/* <span className='text-[#667085] font-[400] text-[16px]'>Effortlessly organize your category offerings with intuitive Category Setup for a seamless and structured e-commerce experience.</span> */}
      </div>

      <div className="flex flex-col space-y-1 border border-[#EAECF0] rounded-[8px] p-[10px]">
        <div className="flex items-center justify-between">
          <div className="flex space-x-2 items-center">
            <span className="text-[18px] font-[500] text-[#101828]">
              Feedback Data
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
                    placeholder='Search feedback by seller name here'
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
                  <TableCell style={{ minWidth: 200 }}>User Name</TableCell>
                  <TableCell style={{ minWidth: 150 }}>Date</TableCell>
                  <TableCell style={{ minWidth: 200 }}>Product Name </TableCell>
                  <TableCell style={{ minWidth: 200 }}>Seller&apos;s Name  </TableCell>
                  <TableCell style={{ minWidth: 250 }}>Feedback </TableCell>
                  {/* <TableCell style={{ minWidth: 100 }}>Delete</TableCell> */}
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedRows
                  .filter((item) => item)
                  .map((elem, i) => {
                    return (
                      <TableRow key={i}>
                        <TableCell>{i + 1}</TableCell>
                        <TableCell>
                        {elem.usersName}
                        </TableCell>
                        <TableCell>
                        {elem.date}
                        </TableCell>

                        <TableCell>
                        {elem?.productName}
                        </TableCell>
                        <TableCell>
                        {elem?.sellerName}
                        </TableCell>
                        <TableCell>
                        {elem.feedback}
                        </TableCell>
                        

                        {/* <TableCell>
                        <Button onClick={()=>handleDelete(elem._id)} variant="outlined" size="sm">
                    Delete
                  </Button>
                        </TableCell> */}
                      </TableRow>
                    );
                  })}
              </TableBody>
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
  </div></div>
  )
}

export default Feedback