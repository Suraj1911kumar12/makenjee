import React, { useEffect, useState, useCallback } from "react";
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
import axios from "axios";
import Button from "@mui/material/Button";

const Invoices = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [productInvoiceData, setProductInvoiceData] = useState([]);
  const [commissionInvoiceData, setCommissionInvoiceData] = useState([]);
  const productId = 0;

  useEffect(() => {
    fetchProductInvoiceData(productId);
    fetchCommissionInvoiceData(productId);
  }, []);

  const fetchProductInvoiceData = useCallback((productId) => {
    axios
      .get(`http://0.0.0.0:3030/api/invoice/products/${productId}`, {
        headers: {
          Authorization: localStorage.getItem("mykanjeeAdminToken"),
        },
      })
      .then((res) => {
        if (res.data.code == 200) {
          setProductInvoiceData(res.data.data.data);
        } else if (res.data.message === "Session expired") {
          openSnackbar(res.data.message, "error");
          router.push("/login");
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.response && err.response.data.statusCode === 400) {
          router.push("/login");
        }
      });
  }, []);
  const fetchCommissionInvoiceData = useCallback((productId) => {
    axios
      .get(`http://0.0.0.0:3030/api/invoice/commission/${productId}`, {
        headers: {
          Authorization: localStorage.getItem("mykanjeeAdminToken"),
        },
      })
      .then((res) => {
        if (res.data.code == 200) {
          setCommissionInvoiceData(res.data.data.data);
        } else if (res.data.message === "Session expired") {
          openSnackbar(res.data.message, "error");
          router.push("/login");
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.response && err.response.data.statusCode === 400) {
          router.push("/login");
        }
      });
  }, []);

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "http://localhost:3000/auth/commission-invoice?sellerId=65ba47ea254058cd0c94d72c&fromDate=1/30/2024&toDate=2/2/2024",
        {
          method: "GET",
          headers: {
            authorization: localStorage.getItem("logintoken"),
            "Content-Type": "application/json",
          },
        }
      );

      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "commission_invoice.pdf");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error downloading invoice:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {" "}
      <div className="px-[20px]  container mx-auto">
        <div className=" py-[10px] flex flex-col space-y-5">
          <div className="flex flex-col space-y-1">
            <span className="text-[30px] text-[#101828] font-[500]">
              Invoice List
            </span>
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
            {/* <Paper>
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
                      <TableCell style={{ minWidth: 200 }}>
                        Product Name{" "}
                      </TableCell>
                      <TableCell style={{ minWidth: 200 }}>
                        {" "}
                        Seller&apos;s Name{" "}
                      </TableCell>
                      <TableCell style={{ minWidth: 250 }}>
                        {" "}
                        Feedback{" "}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                </Table>
              </TableContainer>

              {isLoading ? (
                <p>Downloading...</p>
              ) : (
                <Button onClick={handleDownload}>Download Invoice</Button>
              )}
            </Paper> */}
            <div className="">
              <div className="mt-5 overflow-x-auto">
                <table className="table">
                  {/* head */}
                  <thead>
                    <tr>
                      <th>Sl No.</th>
                      <th>Order Id</th>
                      <th>Product Invoice</th>
                      <th>Commission Invoice</th>
                      <th>Shipping Invoice</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white">
                      <th>1</th>
                      <td>H24XdG455</td>
                      <td>
                        {" "}
                        {isLoading ? (
                          <p>Downloading...</p>
                        ) : (
                          <div
                            onClick={handleDownload}
                            className="btn bg-[#AC87BF] hover:bg-[#B6A4BF] text-white"
                          >
                            Download Invoice
                          </div>
                        )}
                      </td>
                      <td>
                        {" "}
                        {isLoading ? (
                          <p>Downloading...</p>
                        ) : (
                          <div
                            onClick={handleDownload}
                            className="btn bg-[#AC87BF] hover:bg-[#B6A4BF] text-white"
                          >
                            Download Invoice
                          </div>
                        )}
                      </td>
                      <td>
                        {" "}
                        {isLoading ? (
                          <p>Downloading...</p>
                        ) : (
                          <div
                            onClick={handleDownload}
                            className="btn bg-[#AC87BF] hover:bg-[#B6A4BF] text-white"
                          >
                            Download Invoice
                          </div>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoices;
