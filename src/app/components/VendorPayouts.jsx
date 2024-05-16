import React, { useState } from "react";
import { CiCalendar } from "react-icons/ci";
import { FaPlus } from "react-icons/fa";
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from "react-icons/io";

const VendorPayouts = () => {
  const [collapse, setCollapse] = useState();

  return (
    <>
      <div className=" p-6">
        <div className="mb-5">
          <div className="text-3xl font-medium">Payment Process</div>
          <div className="text-gray-400 text-base mb-5">
            &#34;Effortless Discount Management for Admin Efficiency.&#34;
          </div>
          <div className="border rounded-lg pt-5">
            <div className="flex justify-between items-center mx-5 mb-6">
              <div className="text-xl  font-medium ">
                Installer List{" "}
                <span className="badge bg-[#f8effc] text-[#AC87BF]">
                  58 Installer
                </span>{" "}
              </div>
              <div className="">
                <label className="input input-bordered flex items-center gap-2 pe-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="size-6 opacity-60"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <input type="text" className="grow" placeholder="Search" />
                  <div className=" rounded-r-lg bg-[#AC87BF] text-white p-3">
                    Search
                  </div>
                </label>
              </div>
              <div className="">
                <button className="btn bg-[#AC87BF] hover:bg-[#ab8db9] text-white">
                  <FaPlus /> Add New Vendor
                </button>
              </div>
              <div className="flex">
                <div className="badge badge-lg rounded-md border-2 py-4 text-sm">
                  <CiCalendar size={30} /> Calender
                </div>
              </div>
            </div>
            <div className="">
              <div className="overflow-x-auto">
                <table className="table">
                  {/* head */}
                  <thead className="bg-gray-50">
                    <tr>
                      <th>
                        <label>
                          <input type="checkbox" className="checkbox" />
                        </label>
                      </th>
                      <th>SL No.</th>
                      <th>Vendor Info</th>
                      <th>Total Amount</th>
                      <th>Commission Amount</th>
                      <th>Commission (5%)</th>
                      <th>Payable Amount</th>
                      <th>Action</th>

                      <th></th>
                    </tr>
                  </thead>
                  <tbody>{/* hjkfhjsdf */}</tbody>
                  {/* foot */}
                  <tfoot>
                    <tr>
                      <th></th>
                      <th>
                        <div className="btn btn-sm ">
                          &larr; &nbsp; Previous
                        </div>
                      </th>
                      <th></th>
                      <th></th>
                      <th></th>
                      <th></th>
                      <th></th>
                      <th>
                        <div className="btn btn-sm ">Next &nbsp; &rarr;</div>
                      </th>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VendorPayouts;
