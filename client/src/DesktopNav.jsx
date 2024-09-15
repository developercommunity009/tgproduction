import { BellIcon, MagnifyingGlassIcon, WalletIcon } from "@heroicons/react/24/solid";

import logo from '../src/assets/Logo.png';
import { useContext, useEffect, useState } from 'react';
import Dropdown from './Component/Dropdown';
import { Link } from 'react-router-dom';
import { useWeb3Modal, useWeb3ModalAccount } from '@web3modal/ethers5/react';
import { ContextApi } from './Context/ContextApi';


const DesktopNav = () => {
  const { createUser, filterCoins, data, setData, getAllCoins } = useContext(ContextApi);

  const { address } = useWeb3ModalAccount();
  const { open } = useWeb3Modal();

  const shortenAddress = (addre) => {
    if (!addre) return ''; 
    return `${addre.slice(0, 6)}...${addre.slice(-4)}`;
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        let data = await filterCoins({ ticker: searchQuery });
        setData(data);
      } catch (error) {
        console.error("Error fetching or filtering data", error);
      }
    };

    fetchData();
  }, [searchQuery]);


  useEffect(() => {
    const handleCreateUser = async () => {
      if (address) {
        await createUser({ wallet: address });
      }
    };
    handleCreateUser();
  }, [address, createUser]);

  // Shorten the address only if it's defined
  const shortAddress = address ? shortenAddress(address) : '';




  return (
    <nav className="hidden w-full font-poppins py-2 text-white items-center shadow-md bg-black relative xl:flex justify-between lg:px-16  left-0   max-w-[1500px] mx-auto top-9      ">

      <Link className="" to="/Create">
        <button className="bg-grade  text-[14px] 2xl:text-[18px] font-normal tracking-wide border-x-2 border-b-2 border-white/50 p-3 flex justify-center items-start rounded-[16px] ">
          Create Token
        </button>
      </Link>


      <div className="flex  gap-2 relative rounded-[16px] justify-center">
        <input
          type="text"
          className="bg-grade border-x-2 border-b-2 border-white/50  outline-none placeholder:text-white lg:w-[300px] xl:w-[540px] text-white px-[40px] pr-[20px] py-3 text-[14px] 2xl:text-[18px] font-normal tracking-wide rounded-[12px]"
          placeholder="Search by creator or Collection"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="absolute top-0 bottom-0 mr-[3px] left-[15px] flex items-center">
          <MagnifyingGlassIcon className="text-white h-[20px]  mt-[2px]" />
        </div>
      </div>
      <Dropdown />
      <button className="bg-grade btn-shadow w-[18%]  text-[14px] 2xl:text-[18px] font-normal tracking-wide border-x-2 border-b-2 border-white/50 p-3 flex justify-center items-start rounded-[16px] "
        onClick={() => open()}>
        <a className="" >{address ? shortAddress : "Connect Wallet"}</a>
      </button>

    </nav>
  );
};

export default DesktopNav;
