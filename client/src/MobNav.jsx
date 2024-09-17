import { Bars3BottomRightIcon, WalletIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { useState, React, useContext, useEffect } from 'react'
import logo from '../src/assets/Logo.png'
import { motion } from 'framer-motion';
import Dropdown from './Component/Dropdown';
// import { textVariant } from '../../utils/motion';
import { Link } from 'react-router-dom';
import Mobdropdown from './Component/Mobdropdown';
// import { NAV_DATA } from '../../constant';
import { useWeb3Modal, useWeb3ModalAccount } from '@web3modal/ethers5/react';
import { ContextApi } from './Context/ContextApi';
// import pic from '../../assets/dummy.jpg'
// import MoonPayModal from '../modals/MoonPayModal';


const MobNav = () => {

    const [isOpen, setisOpen] = useState(false)
    const [openMenu, setopen] = useState(false)

    const { createUser, filterCoins, data, setData, getAllCoins } = useContext(ContextApi);



    const { address } = useWeb3ModalAccount();
    const { open } = useWeb3Modal();

    const shortenAddress = (addre) => {
        if (!addre) return ''; // Return an empty string if address is undefined or null
        return `${addre.slice(0, 6)}...${addre.slice(-4)}`;
    };

    const [searchQuery, setSearchQuery] = useState("");
    const [filteredData, setFilteredData] = useState([]); // State to hold the filtered data

    useEffect(() => {
        // Fetch initial data or handle data fetching from your API
        const fetchData = async () => {
            try {
                const bnb = "bnb"
                // Replace this with your actual data fetching logic
                let data = await filterCoins({ ticker: searchQuery });
                console.log(data);
                // Use APIFeatures to filter based on the search query
                // let query = new APIFeatures(data, { name: searchQuery }).filter().query;

                // setFilteredData(data); // Update the filtered data state
            } catch (error) {
                console.error("Error fetching or filtering data", error);
            }
        };

        fetchData();
    }, [searchQuery]); // Re-run the effect whenever searchQuery changes


    useEffect(() => {
        const handleCreateUser = async () => {
            if (address) {
                // Pass the address to the createUser function
                await createUser({ wallet: address });
            }
        };
        handleCreateUser();
    }, [address, createUser]);

    // Shorten the address only if it's defined
    const shortAddress = address ? shortenAddress(address) : '';



    return (
        <div className='block py-8  xl:hidden'>
            {openMenu && (
                {/* <MoonPayModal open={open} setOpen={setopen} /> */ }
            )}


            <div className='flex items-center justify-between'>
                <Link to="/"> <img src={logo} alt="logo" className='h-[40px] lg:hidden' /></Link>

                <div className='flex items-center gap-[15px]'>


                    {/* {address ? (
                        <div className='flex items-center gap-[10px]'>
                            <button className='text-white btn-bg duration-500 font-semibold flex gap-[6px] justify-center items-center text-[10px] lg:text-[12px] xl:text-[14px] w-[110px]  h-[27px] sm:h-[32px] rounded-[20px]'
                                onClick={() => setaddress(false)}
                            >
                                <WalletIcon className='text-white h-[18px]' />  123.21 Matic
                            </button>
                            <img src={pic} alt="" className='rounded-full h-[30px] cursor-pointer'
                                onClick={() => navigate('/profile')}
                            />
                        </div>
                    ) : (

                        <button className='text-white hover:scale-105 btn-bg duration-500 font-semibold flex gap-[6px] justify-center items-center text-[10px] lg:text-[12px] xl:text-[14px] w-[90px] sm:w-[110px]  h-[27px] sm:h-[32px] rounded-[20px]'
                            onClick={() => setaddress(true)}
                        >
                            <WalletIcon className='text-white h-[18px]' />  Login
                        </button>
                    )} */}

                    <div className='h-[38px] w-[38px] btn-bg rounded-full flex justify-center items-center'
                        onClick={() => setisOpen(true)}
                    >
                        <Bars3BottomRightIcon className='md:h-[40px] h-[24px] text-[#9860FF]' />
                    </div>

                </div>


            </div>

            {isOpen && (

                <div className='fixed inset-0 font-poppins text-white z-50 bg-black  px-9 py-4'>
                    <div className='relative max-w-[440px] mx-auto h-screen'>
                        <div className='flex justify-between items-center'>
                            <img src={logo} alt="logo" className='h-[40px]' />

                            <div className='flex items-center gap-[10px]'>

                                <div className='h-[38px] w-[38px] btn-bg rounded-full flex justify-center items-center'
                                    onClick={() => {
                                        setisOpen(false)

                                    }}
                                >
                                    <XMarkIcon className='h-[23px] text-[#9860FF]' />
                                </div>
                            </div>

                        </div>
                        {/* <motion.div
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true }}
                            className='lg:pt-[90px]'
                        >
                            <div className='mt-[89px] flex flex-col gap-[36px]'>
                                {NAV_DATA.map((item, i) => {

                                    return <motion.a
                                        key={i}
                                        variants={textVariant(0.2 * (i + 1))}
                                        className={'text-[34px] font-bold text-center text-white list-none'}
                                        viewport={{ once: true }}
                                        onClick={() => {
                                            if (item.route) {
                                                navigate(item.route)
                                            }
                                            setisOpen(false)
                                        }}
                                    >
                                        {item.title}
                                    </motion.a>
                                })}

                            </div>
                        </motion.div> */}


                        <div className='absolute top-[30%] left-0 right-0 '>
                            <motion.div
                                whileInView={{ scale: [0.7, 1], opacity: [0, 1] }}
                                transition={{ duration: 1.2, ease: 'easeInOut' }}
                                initial='hidden'
                                style={{ opacity: 0 }}
                                viewport={{ once: true }}
                            >

                                <div
                                    className='flex flex-col gap-[20px]'
                                >
                                    <Link to="/Create"><button className="bg-grade w-full text-[14px] 2xl:text-[18px] font-normal tracking-wide border-x-2 border-b-2 border-white/50 p-3 flex justify-center items-start rounded-[16px] ">
                                        Create Token
                                    </button></Link>
                                    <Mobdropdown />
                                    <button className="bg-grade btn-shadow w-full  text-[14px] 2xl:text-[18px] font-normal tracking-wide border-x-2 border-b-2 border-white/50 p-3 flex justify-center items-start rounded-[16px] "
                                        onClick={() => open()}
                                        disabled={address} >
                                        <a className="" >{address ? shortAddress : "Connect Wallet"}</a>
                                    </button>

                                </div>


                            </motion.div>
                        </div>
                    </div>
                </div>
            )}

        </div>

    )
}

export default MobNav