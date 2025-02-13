'use client'
import React, { useCallback, useEffect, useState } from 'react'
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import axios from '../../../axios';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '../LoadingSpinner';

const options = [
    'Total',
    'This Month',
    'This Year'
];

const ITEM_HEIGHT = 48;

const Dashboard = () => {
    const router = useRouter();
    const [anchorEl, setAnchorEl] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const [sellerData, setSellerData] = useState([])

    useEffect(() => {
        let unmounted = false;
        if (!unmounted) {
            fetchSellerData()
        }

        return () => { unmounted = true };
    }, [])

    const fetchSellerData = useCallback(
        () => {
            axios.get("/api/user/fetch-users?type=SELLER", {
                headers: {
                    Authorization: localStorage.getItem('mykanjeeAdminToken')
                }
            })
                .then((res) => {
                    if (res.data.code == 200) {
                        setLoading(false);
                        setSellerData(res.data.data)
                    }else if (res.data.message === 'Session expired') {
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
    return (
        <>
        {(isLoading) ? <LoadingSpinner/> :
        <div className='p-[10px] flex flex-col space-y-10 container mx-auto'>
            <div className='flex flex-col space-y-1'>
                <span className='text-[30px] text-[#101828] font-[500]'>Welcome back!</span>
                <span className='text-[#667085] font-[400] text-[16px]'>Track, manage and forecast your customers and orders.</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#fcf8ee] flex flex-col justify-between shadow-md rounded-lg overflow-hidden w-full p-[24px]">
                    <div className='flex justify-between items-center'>
                        <span className='text-[16px]'>Total Customers</span>
                        <IconButton
                            aria-label="more"
                            id="long-button"
                            aria-controls={open ? 'long-menu' : undefined}
                            aria-expanded={open ? 'true' : undefined}
                            aria-haspopup="true"
                            onClick={handleClick}
                        >
                            <MoreVertIcon />
                        </IconButton>
                        <Menu
                            id="long-menu"
                            MenuListProps={{
                                'aria-labelledby': 'long-button',
                            }}
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            PaperProps={{
                                style: {
                                    maxHeight: ITEM_HEIGHT * 4.5,
                                    width: '20ch',
                                },
                            }}
                        >
                            {options.map((option) => (
                                <MenuItem key={option} selected={option === 'Pyxis'} onClick={handleClose}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Menu>
                    </div>
                    <div className="flex flex-col">
                        <h2 className="text-xl font-semibold">2,420</h2>
                        <div className='flex items-center text-[#667085] text-[14px] gap-[10px]'>
                            <span className='text-[#027A48] text-[14px] font-[500]'>40% </span>

                            <span>vs last month</span>
                        </div>
                    </div>
                </div>
                <div className="bg-[#fcf8ee] flex flex-col justify-between shadow-md rounded-lg overflow-hidden w-full p-[24px]">
                    <div className='flex justify-between items-center'>
                        <span className='text-[16px]'>Total Sellers</span>
                    </div>
                    <div className="flex flex-col">
                        <h2 className="text-xl font-semibold">{sellerData.length}</h2>
                    </div>
                </div>
                <div className="bg-[#fcf8ee] flex flex-col justify-between shadow-md rounded-lg overflow-hidden w-full p-[24px]">
                    <div className='flex justify-between items-center'>
                        <span className='text-[16px]'>Total Customers</span>
                        <IconButton
                            aria-label="more"
                            id="long-button"
                            aria-controls={open ? 'long-menu' : undefined}
                            aria-expanded={open ? 'true' : undefined}
                            aria-haspopup="true"
                            onClick={handleClick}
                        >
                            <MoreVertIcon />
                        </IconButton>
                        <Menu
                            id="long-menu"
                            MenuListProps={{
                                'aria-labelledby': 'long-button',
                            }}
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            PaperProps={{
                                style: {
                                    maxHeight: ITEM_HEIGHT * 4.5,
                                    width: '20ch',
                                },
                            }}
                        >
                            {options.map((option) => (
                                <MenuItem key={option} selected={option === 'Pyxis'} onClick={handleClose}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Menu>
                    </div>
                    <div className="flex flex-col">
                        <h2 className="text-xl font-semibold">2,420</h2>
                        <div className='flex items-center text-[#667085] text-[14px] gap-[10px]'>
                            <span className='text-[#027A48] text-[14px] font-[500]'>40% </span>

                            <span>vs last month</span>
                        </div>
                    </div>
                </div>
                <div className="bg-[#fcf8ee] flex flex-col justify-between shadow-md rounded-lg overflow-hidden w-full p-[24px]">
                    <div className='flex justify-between items-center'>
                        <span className='text-[16px]'>Total Customers</span>
                        <IconButton
                            aria-label="more"
                            id="long-button"
                            aria-controls={open ? 'long-menu' : undefined}
                            aria-expanded={open ? 'true' : undefined}
                            aria-haspopup="true"
                            onClick={handleClick}
                        >
                            <MoreVertIcon />
                        </IconButton>
                        <Menu
                            id="long-menu"
                            MenuListProps={{
                                'aria-labelledby': 'long-button',
                            }}
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            PaperProps={{
                                style: {
                                    maxHeight: ITEM_HEIGHT * 4.5,
                                    width: '20ch',
                                },
                            }}
                        >
                            {options.map((option) => (
                                <MenuItem key={option} onClick={handleClose}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Menu>
                    </div>
                    <div className="flex flex-col">
                        <h2 className="text-xl font-semibold">2,420</h2>
                        <div className='flex items-center text-[#667085] text-[14px] gap-[10px]'>
                            <span className='text-[#027A48] text-[14px] font-[500]'>40% </span>

                            <span>vs last month</span>
                        </div>
                    </div>
                </div>
            </div>



        </div>}
        </>
    )
}

export default Dashboard