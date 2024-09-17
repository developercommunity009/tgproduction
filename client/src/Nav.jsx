import { useContext, useEffect, useState } from 'react';
import DesktopNav from './DesktopNav'
import MobNav from './MobNav'
import { ContextApi } from './Context/ContextApi';


const Nav = () => {

  
    const dappUrl = 'https://shishi-demo.netlify.app'

    const [scrolled, setScrolled] = useState(false);

    const [address, setaddress] = useState(false)

    useEffect(() => {

        const handleScroll = () => {
            const scrollTop = window.scrollY;
            if (scrollTop > 40) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);


    return (
        <div className={``}>

            <div className='max-w-[1500px]  mx-auto  '>
                <DesktopNav  />
                <MobNav  />
            </div>
        </div>
    )
}

export default Nav