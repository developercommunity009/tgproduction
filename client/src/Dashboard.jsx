
import image from "../src/assets/image.jpeg"
import card from "../src/assets/card.png"
import card2 from "../src/assets/card2.png"
import card3 from "../src/assets/card3.png"
import card4 from "../src/assets/card4.png"
import card5 from "../src/assets/card5.png"
import tick from "../src/assets/Vector.png"
import poly from "../src/assets/polygon.png"
import ethe from "../src/assets/ETH.png"
import bnb from "../src/assets/bnb.jpeg"
import image2 from "../src/assets/image2.png"
import profile from "../src/assets/profile.png"
import { Link } from 'react-router-dom'
import { useState, React, useContext, useEffect } from 'react'
import { MagnifyingGlassIcon, WalletIcon } from '@heroicons/react/24/solid';
import { ContextApi } from './Context/ContextApi'
import { SocketProvider, useSocket } from "./Context/SocketContext"




const Dashboard = () => {

  const { filterCoins, data, setData, getAllCoins ,  hils, setHils , getHilCoins , getLatestTrxn } = useContext(ContextApi);
  const { socket } = useSocket(SocketProvider);

  // const [showNetworks, setshowNetworks] = useState(false);
  const [showSort, setshowSort] = useState(false);
  const [showChain, setshowChain] = useState(false);
  const [showNetworks, setShowNetworks] = useState(false);
  const [selectedSort, setSelectedSort] = useState('bump order');
  const [selectedAssending, setSelectedAssending] = useState('Ascending');
  const [selectedChain, setSelectedChain] = useState('All Chains');
  const [activity, setActivity] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const shortenAddress = (addre) => {
    return `${addre.slice(0, 6)}...${addre.slice(-4)}`;
  };

  const handlePageChange = async (newPage) => {
    if (newPage > 0) {
      await filterCoins({ page: newPage })
      setCurrentPage(newPage);
    }
  };
  const handleAssendingChange = (sortOrder) => {
    setSelectedAssending(sortOrder);
    setshowSort(false);

    // Sort data based on selected order
    const sortedData = [...data].sort((a, b) => {
      if (sortOrder === 'Ascending') {
        return a.createdAt.localeCompare(b.createdAt); // Change 'name' to the field you want to sort by
      } else {
        return b.createdAt.localeCompare(a.createdAt);
      }
    });

    setData(sortedData);
  };
  // hello

  const handleChainChange = async (chain) => {
    setSelectedChain(chain);
    setshowChain(false); // Close the dropdown
    try {
      // Apply the filter with the selected chain
      const res = await filterCoins({ chain }); // Update as needed for your filter criteria
      setData(res)
    } catch (error) {
      console.error('Error filtering coins:', error);
    }
  };





  const handleSortChange = (sortOption) => {
    setSelectedSort(sortOption);
    setShowNetworks(false);


  };


  useEffect(() => {
    const fetchCoins = async () => {
      try {
        await getAllCoins();
      } catch (error) {
        console.error("Error fetching coins:", error);
      }
    };

    fetchCoins();
  }, []);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        await getHilCoins();
      } catch (error) {
        console.error("Error fetching coins:", error);
      }
    };

    fetchCoins();
  }, []);
  
  useEffect(() => {
    const fetchTrnx = async () => {
      try {
      const res =  await getLatestTrxn();
      setActivity(res)
      } catch (error) {
        console.error("Error fetching coins:", error);
      }
    };

    fetchTrnx();
  }, []);


  
  useEffect(() => {
    if (socket) {
      // Listener for tradeBuy events
      socket.on('tradeBuy', (data) => {
        console.log('Buy token data:', data);
        setActivity((prevActivity) => [...prevActivity, { type: 'buy', ...data }]);
      });

      // Listener for tradeSell events
      socket.on('tradeSell', (data) => {
        console.log('Sell token data:', data);
        setActivity((prevActivity) => [...prevActivity, { type: 'sell', ...data }]);
      });

      // Listener for newCoinCreated events
      socket.on('newCoinCreated', (data) => {
        console.log('Created token data:', data);
        setActivity((prevActivity) => [...prevActivity, { type: 'created', ...data }]);
      });

      // Cleanup function to remove listeners
      return () => {
        socket.off('tradeBuy');
        socket.off('tradeSell');
        socket.off('newCoinCreated');
      };
    }
  }, [socket]);

  return (
    <div className='lg:px-16 md:px-8  font-poppins pb-24 lg:pb-12  pt-4 md:py-4'>
      <div className='mt-12'>
        <div className="flex  justify-between items-center ">
          <h2 className="md:text-[20px] text-white text-[16px] font-bold ">Recent Activities</h2>

        </div>

        <div className="flex justify-start overflow-x-scroll items-center gap-8 scrollbar">

          {activity.map((e, index) => (

            <div
              key={index}
              className="flex lg:w-[20%]  items-start  p-2 rounded-md my-2 gap-3 justify-start"
            >
              <div className=" w-[58px]  ">
                <img className="object-cover rounded-lg  h-[48px] " src={e.coin?.image} alt="" />
              </div>
              <div>
                <div className='flex gap-4 justify-start items-center'>
                  <h2 className="text-[white]  font-bold cursor-pointer text-[14px]">
                    {e.type}{" "}{e.coin?.ticker}
                  </h2>
                  <img className='h-[25px]' src={tick} alt="" />
                </div>

                <h2 className="text-[#5EEAD4] font-bold text-[14px] ">
                {(e.tokenQuantity ?? 0).toFixed(0)}

                </h2>
              </div>
            </div>

          ))}

        </div>

      </div>
      <div
        className=" lg:justify-between bg-[#0D0D0D]  xl:flex-row mt-4 lg:mt-20    relative xl:flex gap-4 xl:items-center  py-[10px] sm:py-[20px] lg:py-4 px-[20px] lg:px-5"
        style={{
          borderRadius: "17px",


        }}
      >
        <div onClick={() => setShowNetworks(!showNetworks)} className="block">
          <div className="relative">
            <h2 className="text-white pl-2 mb-1 leading-[32px] lg:text-[19px]  text-[12px] font-bold">
              Sort by
            </h2>
            <div className="xl:w-[550px] w-full lg:w-full bg-[#EEEEEE] py-3  px-[4px] lg:px-[15px]   rounded-full flex items-center gap-[5px] lg:gap-0 justify-between cursor-pointer">
              <div className="flex px-3 items-center gap-[7px]">
                <h2 className="lg:text-[14px] w-full text-left   text-[12px]  text-[#4A4A4A] font-semibold rounded-md">
                  {selectedSort}
                </h2>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                className="text-[#4A4A4A] h-[15px] lg:h-[20px] pr-[5px]"
              >
                <path
                  fillRule="evenodd"
                  d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            {showNetworks && (
              <div className="absolute w-full top-[84px] z-[60]   lg:left-0 lg:right-0 bg-[#ffffff]  rounded-[10px] shadow-[rgba(255,255,255,0.09)_0px_4px_4px_0px]">
                <div className="px-[20px] border-[#9860FF] rounded-lg border-2 w-full group-hover:text-white group-hover:bg-[#9860FF] py-[13px] space-y-[13px]">
                  <button onClick={() => handleSortChange("Bump order")} className="flex w-full items-center gap-[7px] cursor-pointer">
                    <h2 className="lg:text-[14px] w-full text-left p-1  text-[12px] hover:text-white hover:bg-[#9860FF] text-[#4A4A4A] font-semibold rounded-md">
                      Bump order
                    </h2>
                  </button>
                  <button onClick={() => handleSortChange("Last reply")} className="flex w-full items-center gap-[7px] cursor-pointer">
                    <h2 className="lg:text-[14px] w-full text-left p-1  text-[12px] hover:text-white hover:bg-[#9860FF] text-[#4A4A4A] font-semibold rounded-md">
                      Last reply
                    </h2>
                  </button>
                  <button onClick={() => handleSortChange('Count reply')} className="flex w-full items-center gap-[7px] cursor-pointer">
                    <h2 className="lg:text-[14px] w-full text-left p-1  text-[12px] hover:text-white hover:bg-[#9860FF] text-[#4A4A4A] font-semibold rounded-md">
                      Count reply
                    </h2>
                  </button>
                  <button onClick={() => handleSortChange('Currently live')} className="flex w-full items-center gap-[7px] cursor-pointer">
                    <h2 className="lg:text-[14px] w-full text-left p-1  text-[12px] hover:text-white hover:bg-[#9860FF] text-[#4A4A4A] font-semibold rounded-md">
                      Currently live
                    </h2>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="md:flex mt-4 xl:mt-0 justify-start xl:justify-center items-center gap-4">
          <div onClick={() => setshowSort(!showSort)} >
            <div className="relative mt-2 md:mt-0 w-full">
              <h2 className="text-white pl-2 mb-1 leading-[32px] lg:text-[19px]  text-[12px] font-bold">
                Sort order by
              </h2>
              <div className="lg:w-[200px] w-full bg-[#EEEEEE] py-3  px-[4px] lg:px-[15px]  lg:py-3 rounded-full flex items-center gap-[5px] lg:gap-0 justify-between cursor-pointer">
                <div className="flex px-3 items-center gap-[7px]">
                  <h2 className="lg:text-[14px] w-full text-left   text-[12px]  text-[#4A4A4A] font-semibold rounded-md ">
                    {selectedAssending}
                  </h2>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                  className="text-[#4A4A4A] h-[15px] lg:h-[20px] pr-[5px]"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              {showSort && (
                <div className="absolute top-[84px] z-[60] w-full lg:left-0 lg:right-0 bg-[#ffffff]  rounded-[10px] shadow-[rgba(255,255,255,0.09)_0px_4px_4px_0px]">
                  <div className="px-[20px] border-[#9860FF] rounded-lg border-2 w-full group-hover:text-white group-hover:bg-[#9860FF] py-[13px] space-y-[13px]">
                    <button className="flex w-full items-center gap-[7px] cursor-pointer">
                      <h2 className="lg:text-[14px] w-full text-left p-1  text-[12px] hover:text-white hover:bg-[#9860FF] text-[#4A4A4A] font-semibold rounded-md"
                        onClick={() => handleAssendingChange('Ascending')}>
                        Ascending
                      </h2>
                    </button>
                    <button className="flex w-full items-center gap-[7px] cursor-pointer">
                      <h2 className="lg:text-[14px] w-full text-left p-1  text-[12px] hover:text-white hover:bg-[#9860FF] text-[#4A4A4A] font-semibold rounded-md"
                        onClick={() => handleAssendingChange('Descending')}>
                        Descending
                      </h2>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="">
            <div
              onClick={() => setshowChain(!showChain)}
              className="relative mt-2 md:mt-0 w-full "
            >
              <h2 className="text-white pl-2 mb-1 leading-[32px] lg:text-[19px]  text-[12px] font-bold">
                Chain
              </h2>
              <div className="lg:w-[200px] bg-[#EEEEEE]  lg:px-[10px] py-3  px-[4px] lg:py-3 rounded-full flex items-center gap-[5px] lg:gap-0 justify-between cursor-pointer">
                <div className="flex px-3 items-center gap-[7px]">
                  <h2 className="lg:text-[14px] w-full text-left   text-[12px]  text-[#4A4A4A] font-semibold rounded-md ">
                    {selectedChain}
                  </h2>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                  className="text-[#4A4A4A] h-[15px] lg:h-[20px] pr-[5px]"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              {showChain && (
                <div className="absolute top-[84px] z-[60] w-full lg:left-0 lg:right-0 bg-[#ffffff]  rounded-[10px] shadow-[rgba(255,255,255,0.09)_0px_4px_4px_0px]">
                  <div className="px-[20px] border-[#9860FF] rounded-lg border-2 w-full group-hover:text-white group-hover:bg-[#9860FF] py-[13px] space-y-[13px]">
                    <button className="flex w-full items-center gap-[7px] cursor-pointer">
                      <h2 className="lg:text-[14px] w-full text-left p-1  text-[12px] hover:text-white hover:bg-[#9860FF] text-[#4A4A4A] font-semibold rounded-md"
                        onClick={() => handleChainChange("All chains")}>
                        All Chains
                      </h2>
                    </button>
                    <button className="flex w-full items-center gap-[7px] cursor-pointer">
                      <h2 className="lg:text-[14px] w-full text-left p-1  text-[12px] hover:text-white hover:bg-[#9860FF] text-[#4A4A4A] font-semibold rounded-md"
                        onClick={() => handleChainChange('ethereum')}>
                        Ethereum
                      </h2>
                    </button>
                    <button className="flex w-full items-center gap-[7px] cursor-pointer">
                      <h2 className="lg:text-[14px] w-full text-left p-1  text-[12px] hover:text-white hover:bg-[#9860FF] text-[#4A4A4A] font-semibold rounded-md"
                        onClick={() => handleChainChange('binancecoin')}>
                        BNB
                      </h2>
                    </button>
                    <button className="flex w-full items-center gap-[7px] cursor-pointer">
                      <h2 className="lg:text-[14px] w-full text-left p-1  text-[12px] hover:text-white hover:bg-[#9860FF] text-[#4A4A4A] font-semibold rounded-md"
                        onClick={() => handleChainChange('matic')}>
                        polygon
                      </h2>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <h2 className='text-[24px] mt-8 font-semibold text-white text-left'>Hil Completed Coins</h2>
      <div
        className="lg:grid flex flex-wrap grid-flow-row mx-auto  lg:grid-cols-3 xl:grid-cols-4 pt-3  !justify-center gap-8
    
     items-center"
      >
        {hils.map((i, index) => (

          <Link key={index} to={`/Trade/${i._id}`}>

            <div
              className="lg:w-[100%]    bg-[#0D0D0D] mx-auto col-span-1 md:w-[16rem]   relative  p-1     transform hover:scale-105 transition-transform duration-300 ease-in-out"
            >

              <div className="flex absolute left-4 top-4 rounded-full p-1 bg-black/30 justify-center items-center gap-2">
                <img className="h-[20px] object-contain" src={
                  i.chain === "ethereum"
                    ? ethe
                    : i.chain === "binancecoin"
                      ? bnb
                      : i.chain === "matic"
                        ? poly
                        : "path/to/default.png"
                } alt="" />
                <h2 className="text-[white]">{i.chain}</h2>
              </div>
              <img className='absolute bottom-0 right-0' src={image2} alt="" />
              <img className='absolute top-0 rotate-180 left-0' src={image2} alt="" />
              <img
                className="w-full  h-[7rem] object-cover  rounded-lg"
                alt="Card Image"
                src={i.image}
              />
              <div className=' flex relative pl-20 flex-row-reverse gap-3 justify-center pt-3 items-center'>
                <h2 className="text-[16px]  uppercase text-white  text-center leading-5   font-semibold">
                  {i.name}
                </h2>
                <div className="h-[50px] left-5 bottom-1 absolute rounded-full w-[50px]">
                  <img className=' rounded-full w-[50px] h-[50px] object-cover' src={i.creator.profilePicture} alt="" />
                </div>

              </div>

              <div className="p-2 ml-4 mt-4  rounded-b-2xl  grid grid-cols-2 justify-center items-center">
                <h2 className="text-[12px] leading-5 text-white  font-bold">
                  <span className="text-[14px] text-grade font-bold">Created by:</span>
                  <br />
                  <span className='text-[#5EEAD4]'> {shortenAddress(i.creator.wallet)}</span>
                </h2>
                <p className=" text-white leading-5 text-[12px] font-bold ">
                  <span className="text-[14px] text-grade font-bold">Market cap:</span>
                  <br />
                  <span className='text-[#5EEAD4]'> ${i.usdMarketCap.toFixed(0)}</span>
                </p>

                {/* <p class="text-white leading-5 text-[18px] font-bold "><span className='text-[12px] font-medium'>Symbol:</span><br/>{i.symbol}</p> */}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <h2 className='text-[24px] mt-8 font-semibold text-white text-left'>🔥Hot Token</h2>
      <div
        className="lg:grid flex flex-wrap grid-flow-row mx-auto  lg:grid-cols-3 xl:grid-cols-4 pt-3  !justify-center gap-8
    
     items-center"
      >
        {data.map((i, index) => (

          <Link key={index} to={`/Trade/${i._id}`}>

            <div
              className="lg:w-[100%]    bg-[#0D0D0D] mx-auto col-span-1 md:w-[16rem]   relative  p-1     transform hover:scale-105 transition-transform duration-300 ease-in-out"
            >

              <div className="flex absolute left-4 top-4 rounded-full p-1 bg-black/30 justify-center items-center gap-2">
                <img className="h-[20px] object-contain" src={
                  i.chain === "ethereum"
                    ? ethe
                    : i.chain === "binancecoin"
                      ? bnb
                      : i.chain === "matic"
                        ? poly
                        : "path/to/default.png"
                } alt="" />
                <h2 className="text-[white]">{i.chain}</h2>
              </div>
              <img className='absolute bottom-0 right-0' src={image2} alt="" />
              <img className='absolute top-0 rotate-180 left-0' src={image2} alt="" />
              <img
                className="w-full  h-[7rem] object-cover  rounded-lg"
                alt="Card Image"
                src={i.image}
              />
              <div className=' flex relative pl-20 flex-row-reverse gap-3 justify-center pt-3 items-center'>
                <h2 className="text-[16px]  uppercase text-white  text-center leading-5   font-semibold">
                  {i.name}
                </h2>
                <div className="h-[50px] left-5 bottom-1 absolute rounded-full w-[50px]">
                  <img className=' rounded-full w-[50px] h-[50px] object-cover' src={i.creator.profilePicture} alt="" />
                </div>

              </div>

              <div className="p-2 ml-4 mt-4  rounded-b-2xl  grid grid-cols-2 justify-center items-center">
                <h2 className="text-[12px] leading-5 text-white  font-bold">
                  <span className="text-[14px] text-grade font-bold">Created by:</span>
                  <br />
                  <span className='text-[#5EEAD4]'> {shortenAddress(i.creator.wallet)}</span>
                </h2>
                <p className=" text-white leading-5 text-[12px] font-bold ">
                  <span className="text-[14px] text-grade font-bold">Market cap:</span>
                  <br />
                  <span className='text-[#5EEAD4]'> ${i.usdMarketCap.toFixed(0)}</span>
                </p>

                {/* <p class="text-white leading-5 text-[18px] font-bold "><span className='text-[12px] font-medium'>Symbol:</span><br/>{i.symbol}</p> */}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>

  )
}

export default Dashboard