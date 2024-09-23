
import { PencilIcon } from '@heroicons/react/24/solid'
import pic from '../../../src/assets/dummy.jpg'
import poly from '../../../src/assets/polygon.png'
import ethe from '../../../src/assets/ETH.png'
import sally from '../../../src/assets/card2.png'
import { Link } from 'react-router-dom'
import image2 from "../../../src/assets/image2.png"
import { useContext, useEffect, useState } from 'react'
import { useWeb3ModalAccount } from '@web3modal/ethers5/react'
import { ContextApi } from '../../Context/ContextApi'
import Table from '../../Component/Table'
import { json } from 'd3'


const Profile = () => {

  const { storedUser, setstoredUser, getCoinByHeld, userId, getCoinsByUserId, setUserProfilePicture, getTrxnByUser, getTrxnByCoin } = useContext(ContextApi);
  const investmentType = ['My Created Token', 'My Trading History', "My Holding"]
  const [activeType, setactiveType] = useState(investmentType[0])
  const { address } = useWeb3ModalAccount();

  const [data, setData] = useState([]);
  const [trxn, settTrxn] = useState([]);
  const [held, setHeld] = useState([]);
  const [selectedImage, setSelectedImage] = useState(storedUser?.profilePicture || '');
  const [loading, setLoading] = useState(false);

  const shortenAddress = (addre) => {
    // Ensure the address and storedUser exist
    if (!addre || !storedUser?.wallet || addre !== storedUser?.wallet) {
      return 'Connect with own wallet';
    }
  
    // Safely shorten the address
    return `${addre.slice(0, 6)}...${addre.slice(-4)}`;
  };

  const shortAddress = address ? shortenAddress(address) : '';

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Show a preview of the selected image immediately
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);

      // Start loading
      setLoading(true);

      const formData = new FormData();
      formData.append('image', file);
      formData.append('wallet', address);

      try {
        // Call the async function from context
        const response = await setUserProfilePicture(formData);

        // Wait for 3 seconds (adjust as needed)
        await new Promise(resolve => setTimeout(resolve, 3000));

        if (response.statusCode === 200) {
          const newProfilePicture = response.data.profilePicture;

          // Log for debugging
          console.log('New profile picture URL:', newProfilePicture);

          // Update storedUser profile picture
          setstoredUser(prevState => ({ ...prevState, profilePicture: newProfilePicture }));

          // Update selectedImage to ensure it shows the new picture
          setSelectedImage(newProfilePicture);
        } else {
          console.error(response.message);
          // Revert to previous image if there's an error
          setSelectedImage(storedUser?.profilePicture || '');
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        // Revert to previous image on error
        setSelectedImage(storedUser?.profilePicture || '');
      } finally {
        // End loading
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (address) {
        const result = await getCoinsByUserId(userId);
        if (result) {
          setData(result.coins);
        }
      }
    };

    fetchData();
  }, [address, getCoinsByUserId, userId]);

  useEffect(() => {
    setSelectedImage(storedUser?.profilePicture || '');
  }, [storedUser]);


  useEffect(() => {
    const result = async () => {
      try {
        // Fetch transactions by user
        const trxnData = await getTrxnByUser(userId);
        settTrxn(trxnData);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    result();
  }, []);
  useEffect(() => {
    const result = async () => {
      try {
        const heldCoinByUser = await getCoinByHeld(userId);
        setHeld(heldCoinByUser.coins)
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };
    result();
  }, []);




  return (
    <div className='lg:px-16 md:px-8 px-4 font-Montserrat mt-36 pb-24 lg:pb-12  py-4 md:py-12'>

      <div className='relative'>

        <div className='absolute bottom-[-45px] sm:bottom-[-65px] left-0 right-0 flex justify-center'>
          <div className='relative'>
            <img src={selectedImage ? selectedImage : pic}
              alt="Profile" className='w-[90px] sm:w-[130px] h-[90px] sm:h-[130px] rounded-full border-[3px] border-[#9860FF] shadow-lg '
            />
            {loading && (
              <div className="absolute inset-0 flex justify-center items-center">
                <div className="loader text-[#9860FF]">Loading...</div>
              </div>
            )}
            <div className='absolute top-0 bottom-0 right-[-6px] sm:right-[-10.5px] flex items-center'>
              <div className='flex mt-[40px] cursor-pointer justify-center items-center h-[27px] sm:h-[35px] w-[27px] sm:w-[35px] rounded-full btn-bg'
                onClick={() => document.getElementById('fileInput').click()}>
                <PencilIcon className='text-[#9860FF] h-[15px] sm:h-[17px]' />
              </div>
            </div>
            <input
              type='file'
              id='fileInput'
              accept='image/*'
              className='hidden'
              onChange={handleImageChange}
            />
          </div>
        </div>

      </div>
      <h2 className='text-[#9860FF] font-bold text-[20px] sm:text-[25px] text-center mt-[55px] sm:mt-[80px]'>
        {shortAddress}
      </h2>
      <div className='flex justify-center my-[50px]  relative'>

        <div className='relative flex justify-center border border-[#666666]  items-center py-2  md:h-[57px] px-[7px] rounded-[9px]'
          style={{
            background: '#0D0D0D'
          }}
        >
          <div className=' grid grid-rows-2 md:grid-rows-1 items-center justify-center grid-flow-col  gap-2'>
            {investmentType.map((item, i) => (
              <div key={i} >
                <div className={` w-[140px] `} onClick={() => setactiveType(item)}>
                  <button className={`rounded-[6px] w-full text-[14px] font-semibold h-[40px] ${activeType === item ? 'text-white bg-grade' : ' text-[#93A4BD]'} `}

                  >
                    {item}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {activeType === 'My Created Token' && (
        <div
          className="lg:grid flex flex-wrap grid-flow-row mx-auto  lg:grid-cols-3 xl:grid-cols-4 pt-3  !justify-center gap-8
    
     items-center"
        >
          {data.map((i, index) => (
            <Link to={`/Trade/${i._id}`} key={index}>
              <div
                key={index}
                class="lg:w-[100%]    bg-[#0D0D0D] mx-auto col-span-1 md:w-[16rem]   relative  p-1     transform hover:scale-105 transition-transform duration-300 ease-in-out"
              >
                <div className="flex absolute left-4 top-4 rounded-full p-1 bg-black/30 justify-center items-center gap-2">
                  <img className="h-[20px] object-contain" src={i.eth} alt="" />
                  <h2 className="text-[white]">{i.ethname}</h2>
                </div>
                <img className='absolute bottom-0 right-0' src={image2} alt="" />
                <img className='absolute top-0 rotate-180 left-0' src={image2} alt="" />
                <img
                  class="w-full  h-[7rem] object-cover  rounded-lg"
                  alt="Card Image"
                  src={i.image}
                />
                <div className=' flex relative pl-20 flex-row-reverse gap-3 justify-center pt-3 items-center'>
                  <h2 class="text-[16px]  uppercase text-white  text-center leading-5   font-semibold">
                    {i.name}
                  </h2>
                  <div className="h-[50px] left-5 bottom-1 absolute rounded-full w-[50px]"> 
                <img className=' rounded-full w-[50px] h-[50px] object-cover' src={i.creator.profilePicture} alt="" />
                </div>
                </div>
                <div class="p-2 ml-4 mt-4  rounded-b-2xl  grid grid-cols-2 justify-center items-center">
                  <h2 class="text-[12px] leading-5 text-white  font-bold">
                    <span className="text-[14px] text-grade font-bold">Created by:</span>
                    <br />
                    <span className='text-[#5EEAD4]'>  {shortenAddress(i.creator.wallet)}</span>
                  </h2>
                  <p class=" text-white leading-5 text-[12px] font-bold ">
                    <span className="text-[14px] text-grade font-bold">Market cap:</span>
                    <br />
                    <span className='text-[#5EEAD4]'> {i.usdMarketCap.toFixed(0)}</span>
                  </p>

                  {/* <p class="text-white leading-5 text-[18px] font-bold "><span className='text-[12px] font-medium'>Symbol:</span><br/>{i.symbol}</p> */}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      {activeType === 'My Trading History' && (
        <Table trxn={trxn} />
      )}

      {activeType === 'My Holding' && (
        <div
          className="lg:grid flex flex-wrap grid-flow-row mx-auto  lg:grid-cols-3 xl:grid-cols-4 pt-3  !justify-center gap-8
           
            items-center"
        >
          {held.map((i, index) => (

            <Link key={index} to={`/Trade/${i.coin._id}`}>
              <div className="lg:w-[100%]    bg-[#0D0D0D] mx-auto col-span-1 md:w-[16rem]   relative  p-1     transform hover:scale-105 transition-transform duration-300 ease-in-out"
              >
                <div className="flex absolute left-4 top-4 rounded-full p-1 bg-black/30 justify-center items-center gap-2">
                  <img className="h-[20px] object-contain" src={i.eth} alt="" />
                  <h2 className="text-[white]">{i.ethname}</h2>
                </div>
                <img className='absolute bottom-0 right-0' src={image2} alt="" />
                <img className='absolute top-0 rotate-180 left-0' src={image2} alt="" />
                <img
                  class="w-full  h-[7rem] object-cover  rounded-lg"
                  alt="Card Image"
                  src={i.coin.image}
                />
                <div className=' flex relative pl-20 flex-row-reverse gap-3 justify-center pt-3 items-center'>
                  <h2 class="text-[16px]  uppercase text-white  text-center leading-5   font-semibold">
                    {i.name}
                  </h2>
                </div>
                <div class="p-2 ml-4 mt-4  rounded-b-2xl  grid grid-cols-2 justify-center items-center">
                  <h2 class="text-[12px] leading-5 text-white  font-bold">
                    <span className="text-[14px] text-grade font-bold">QTY:</span>
                    <br />
                    <span className='text-[#5EEAD4]'>  {i.quantity.toFixed(4)}</span>
                  </h2>
                  <p class=" text-white leading-5 text-[12px] font-bold ">
                    <span className="text-[14px] text-grade font-bold">Market cap:</span>
                    <br />
                    <span className='text-[#5EEAD4]'> {i.coin.marketCap.toFixed(4)}</span>
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

    </div>
  )
}

export default Profile