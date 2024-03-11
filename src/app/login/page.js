"use client"
import React, { useCallback, useEffect } from 'react'
import { FaRegEyeSlash } from "react-icons/fa";

import axios from "../../../axios";
import { useState } from "react";
import { useRouter } from "next/navigation"
import { useSnackbar } from '../SnackbarProvider';

const Page = () => {
    const router = useRouter()
    const { openSnackbar } = useSnackbar();

    const [userRoles, setUserRoles] = useState([])
    useEffect(() => {
        let unmounted = false;
        if (!unmounted) {
            fetchUserRoles()
        }

        return () => { unmounted = true };
    }, [])

    const fetchUserRoles = useCallback(
        () => {
            axios.get('/api/auth/get-user-roles')
                .then((res) => {
                    if (res.data.status === 'success') {
                        setUserRoles(res.data.data)
                    }
                })
                .then(err => {
                    console.log(err)
                })
        },
        [],
    )

    const [userName, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const handleSubmit = async (event) => {
        const adminRole = userRoles.find(role => role.role_name === "ADMIN");
        event.preventDefault();
        try {
            const response = await axios.post('/api/auth/admin-login', {
                role_id: adminRole.id,
                username : userName, 
                password
            });

            const token = response.data.token;
            localStorage.setItem("mykanjeeAdminToken", token);

            if (token) {
                router.push('/');
                openSnackbar(response.data.message, 'success');
            }

        } catch (error) {
            console.error('Login failed', error);
        }
    };



    return (
        <>
            <div className='auth-wrapper'>
                <div className='auth-wrapper-left'>
                    <h1>Mykanjee</h1>
                </div>
                <div className='auth-wrapper-right'>
                    <div className='auth-wrapper-form'>
                        <div className='auth-header'>
                            <div className='mb-5'>
                                <h2 className='text-[28px] font-[800]'>Login <span className='text-[14px]'>(Admin)</span></h2>
                                <span className='text-[14px] font-[400] text-slate-400'>Welcome back!</span>
                            </div>
                            <form onSubmit={handleSubmit} className="mt-8 mb-2">

                                <div className='flex flex-col space-y-2 mb-5'>
                                    <label className='text-[#334257] capitalize text-[0.875rem]'>Your Email</label>
                                    <input className='border border-slate-300 p-2 rounded-[5px] h-[40px] bg-[#e8f0fe] text-black outline-none focus-none' value={userName}
                                        onChange={(e) => setUsername(e.target.value)} name='email' type='email' placeholder='email@address.com' />
                                </div>
                                <div className='flex flex-col space-y-2'>
                                    <label className='text-[#334257] capitalize text-[0.875rem]'>Password</label>
                                    <div className='flex items-center border border-slate-300 p-2 rounded-[5px] h-[40px] bg-[#e8f0fe]'>
                                        <input value={password}
                                            onChange={(e) => setPassword(e.target.value)} className=' text-black w-full bg-[#e8f0fe] outline-none focus-none' name='password' type='password' placeholder='********' />
                                        <FaRegEyeSlash className='cursor-pointer text-slate-400 text-[14px]' />
                                    </div>
                                </div>

                                <button className='bg-[#ebc25b] p-2 rounded-[5px] text-black text-[14px] font-bold w-full mt-5 hover:bg-[#ebc25b]/70'>Login</button>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Page
