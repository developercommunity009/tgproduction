import React from 'react'
import logo from "../../src/assets/Logo.png"
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import RocketLaunchOutlinedIcon from '@mui/icons-material/RocketLaunchOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import TelegramIcon from '@mui/icons-material/Telegram';
import XIcon from '@mui/icons-material/X';
import { Link } from 'react-router-dom';
const Sidebar = () => {

  return (
    <div className='bm-grade fixed  z-40 left-0 right-0 lg:right-full  mx-auto w-[90%] font-poppins lg:top-8 lg:left-4 bottom-2  lg:w-[70px]   overflow-hidden  p-1 rounded-[16px] transition-all duration-300 ease-in-out'>
    <div className='bg-grade relative h-full lg:pt-32 gap-4  flex flex-row lg:flex-col justify-start items-center  rounded-[16px]'>
      <Link className='absolute hidden lg:block top-5' to="/">  <img className='w-[48px]   ' src={logo} alt="" /></Link>
        
        <div tabIndex={0} className='flex  duration-300 py-2 mt-2 w-full text-white hover:text-[#9860FF] focus:text-[#9860FF] hover:bg-white focus:bg-white rounded-xl lg:rounded-none   gap-4 items-center justify-center'>
            
                
                 <Link to="/">   <HomeOutlinedIcon fontSize='medium' className='   hover:scale-105 cursor-pointer'/></Link>
                   
                
           
        </div>
        <div tabIndex={1} className='flex  duration-300 py-2 mt-2 w-full text-white hover:text-[#9860FF] focus:text-[#9860FF] hover:bg-white focus:bg-white rounded-xl lg:rounded-none   gap-4 items-center justify-center'>
            
                
           <Link to='/Create'><RocketLaunchOutlinedIcon fontSize='medium' className='   hover:scale-105 cursor-pointer'/> </Link> 
           
        
   
</div>

<div tabIndex={2} className='flex  duration-300 py-2 mt-2 w-full text-white hover:text-[#9860FF] focus:text-[#9860FF] hover:bg-white focus:bg-white rounded-xl lg:rounded-none   gap-4 items-center justify-center'>
            
                
            <TelegramIcon fontSize='medium' className='   hover:scale-105 cursor-pointer'/>
           
        
   
</div>

<div tabIndex={3} className='flex  duration-300 py-2 mt-2 w-full text-white hover:text-[#9860FF] focus:text-[#9860FF] hover:bg-white focus:bg-white rounded-xl lg:rounded-none   gap-4 items-center justify-center'>
            
                
            <XIcon fontSize='medium' className='   hover:scale-105 cursor-pointer'/>
           
        
   
</div>

<div tabIndex={4} className='flex bottom-3  lg:absolute mx-2  duration-300 py-2 mt-2 w-full text-white hover:text-[#9860FF] focus:text-[#9860FF] hover:bg-white focus:bg-white rounded-xl lg:rounded-none   gap-4 items-center justify-center'>
            
                
           <Link to="/Profile"> <AccountCircleOutlinedIcon fontSize='large' className=' h-12  hover:scale-105 cursor-pointer'/></Link>
           
        
   
</div>
</div>

    </div>


  )
}

export default Sidebar
