import React, { useEffect, useState } from 'react'
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Pagination } from '@mui/material';
import axios from 'axios';
import Button from '@mui/material/Button';

const Invoices = () => {

  
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3000/auth/commission-invoice?sellerId=65ba47ea254058cd0c94d72c&fromDate=1/30/2024&toDate=2/2/2024', {
        method: 'GET',
        headers: {
          'authorization': localStorage.getItem('logintoken'),
          'Content-Type': 'application/json',
          
        },
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'commission_invoice.pdf');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Error downloading invoice:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // const getFeedback=() => {
  //   axios.get('http://localhost:3000/auth/commission-invoice?sellerId=65ba47ea254058cd0c94d72c&fromDate=1/30/2024&toDate=2/2/2024', {
  //     headers: {
  //       'authorization': localStorage.getItem('logintoken')},
  //   })
  //     .then(function (response) {
  //         // handle success
  //         setFeedbackData(response.data.data)
  //       console.log("response", response);
  //     })
  //     .catch(function (error) {
  //       // handle error
  //       console.log(error);
  //     }) 
  // }
  
  //   useEffect(() => {
  //     getFeedback()
  //   }, [])

  return (
    <div> <div className="px-[20px]  container mx-auto">
    <div className=" py-[10px] flex flex-col space-y-5">
      <div className="flex flex-col space-y-1">
        <span className="text-[30px] text-[#101828] font-[500]">
          Invoice List
        </span>
        {/* <span className='text-[#667085] font-[400] text-[16px]'>Effortlessly organize your category offerings with intuitive Category Setup for a seamless and structured e-commerce experience.</span> */}
      </div>

      <div className="flex flex-col space-y-1 border border-[#EAECF0] rounded-[8px] p-[10px]">
        <div className="flex items-center justify-between">
          <div className="flex space-x-2 items-center">
            <span className="text-[18px] font-[500] text-[#101828]">
              Invoices
            </span>
            {/*-------------------------------------------------------------------- {categoryData.length} */}
            <span className="px-[10px] py-[5px] bg-[#FCF8EE] rounded-[16px] text-[12px] text-[#A1853C]">
              {" "}
              details
            </span>
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
                  <TableCell style={{ minWidth: 200 }}>  Seller&apos;s Name  </TableCell>
                  <TableCell style={{ minWidth: 250 }}> Feedback </TableCell>
                
                </TableRow>
              </TableHead>

              {/* <TableBody>
                {feedbackData
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
                        

                      
                      </TableRow>
                    );
                  })}
              </TableBody> */}
            </Table>
            </TableContainer>
            
            {isLoading ? (
        <p>Downloading...</p>
      ) : (
        <Button onClick={handleDownload}>Download Invoice</Button>
      )}
        </Paper>
      </div>
    </div>
  </div></div>
  )
}

export default Invoices