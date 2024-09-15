import React, { useContext, useEffect, useState } from 'react';
import { Input } from "@material-tailwind/react";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { ContextApi } from '../../Context/ContextApi';
import { useWeb3Modal, useWeb3ModalAccount } from '@web3modal/ethers5/react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';





const Create = () => {

  const { userId, createCoin, uploadToCloudinary } = useContext(ContextApi);
  const { address } = useWeb3ModalAccount(); // Assuming this is needed elsewhere in the component
  const { open } = useWeb3Modal();
  const navigate = useNavigate()
  const [showOption, setshowOption] = useState(false);


  const [formData, setFormData] = useState({
    name: '',
    ticker: '',
    description: '',
    liquidity: '',
    image: '',
    chain: '',
    telegramLink: '',
    twitterLink: '',
    website: '',
    creator: userId || ''
  });
  console.log(formData)

  const [errors, setErrors] = useState({});

  // Update creator field whenever userId changes
  useEffect(() => {
    if (userId) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        creator: userId,
      }));
    }
  }, [userId]);

  // Handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  // Handle file upload and update image in formData
  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    if (file) {
      try {
        // Upload the file to Cloudinary
        const image = await uploadToCloudinary(file);

        // Log the image object to verify its structure
        console.log('Uploaded image object:', image.url);

        // Check if `image.url` exists
        if (image && image.url) {
          // Update the formData with the Cloudinary URL
          setFormData((prevFormData) => ({
            ...prevFormData,
            image: image.url,
          }));
        } else {
          console.error('Image URL not found in the response');
        }

      } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
      }
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.ticker) newErrors.ticker = 'Ticker is required';
    // if (!formData.totalSupply) newErrors.totalSupply = 'Total Supply is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.liquidity) newErrors.liquidity = 'add Liquidity is required';
    if (!formData.chain) newErrors.chain = 'Chain selection is required';
    if (!formData.image) newErrors.image = 'Image is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    validateForm();
    try {

      const response = await createCoin(formData);
      if (response?.data) {
        toast.success(response.message);
      }
      setErrors({});
      setFormData(prev => ({ ...prev, name: '', ticker: '', description: '', liquidity: '', image: '', chain: '', telegramLink: '', twitterLink: '', website: '' }));
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      toast.error(error);
    }
  };


  return (<>

    <ToastContainer />
    <div className="lg:px-16  px-4 mt-4 font-poppins max-w-[620px] mx-auto pb-24 lg:pb-12   py-12">
      <div className="p-4 rounded-xl border border-[#9860FF]">
        <div className="flex-col w-full  flex justify-start gap-1 mt-3 items-start ">
          <h1 className="text-[white] font-semibold  md:text-[16px]">
            Name
          </h1>
          <Input
            name="name"
            color="teal"
            labelProps={{ className: "hidden" }}
            className={`!border p-[7px] ${errors.name ? 'border-red-500' : 'border-gray-300'} bg-transparent !outline-none shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-white placeholder:opacity-70 focus:!border-[#9860FF] focus:!border-t-[#9860FF]  rounded-lg text-white`}
            placeholder="Token Name"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
        </div>
        <div className="flex-col w-full  flex justify-start gap-1 mt-3 items-start ">
          <h1 className="text-[white] font-semibold  md:text-[16px]">
            Ticker
          </h1>
          <Input
            name="ticker"
            color="teal"
            labelProps={{ className: "hidden" }}
            className={`!border p-[7px] ${errors.ticker ? 'border-red-500' : 'border-gray-300'} bg-transparent !outline-none shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-white placeholder:opacity-70 focus:!border-[#9860FF] focus:!border-t-[#9860FF]  rounded-lg text-white`}
            placeholder="Token Ticker"
            value={formData.ticker}
            onChange={handleChange}
          />
          {errors.ticker && <p className="text-red-500 text-xs">{errors.ticker}</p>}
        </div>
        <div className="flex-col mt-3 w-full  flex justify-start gap-1 items-start ">
          <h1 className="text-[white] font-semibold  md:text-[16px]">
            Description
          </h1>
          <textarea
            name="description"
            color="teal"
            labelProps={{ className: "hidden" }}
            className={`!border p-[7px] ${errors.description ? 'border-red-500' : 'border-gray-300'} bg-transparent !outline-none shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-white placeholder:opacity-70 focus:!border-[#9860FF] focus:!border-t-[#9860FF] w-full  rounded-lg text-white`}
            placeholder="Briefly describe your token.."
            value={formData.description}
            onChange={handleChange}
          />
          {errors.description && <p className="text-red-500 text-xs">{errors.description}</p>}
        </div>
        <div className="flex-col w-full  flex justify-start gap-1 mt-3 items-start ">
          <h1 className="text-[white] font-semibold  md:text-[16px]">
            Image
          </h1>
          <Input
            name="image"
            accept="image/*"
            type="file"
            color="teal"
            labelProps={{ className: "hidden" }}
            className={`!border cursor-pointer p-[7px] ${errors.image ? 'border-red-500' : 'border-gray-300'} bg-transparent !outline-none shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#9860FF] focus:!border-t-[#9860FF] rounded-lg text-white`}
            onChange={handleFileChange}
          />
          {errors.image && <p className="text-red-500 text-xs">{errors.image}</p>}
        </div>
        <div className="flex-col w-full flex justify-start gap-1 mt-3 items-start">
          <h1 className="text-[white] font-semibold md:text-[16px]">Select Chain</h1>
          <select
            name="chain"
            value={formData.chain}
            onChange={handleChange}
            className="border w-full p-[7px] border-gray-300 bg-black outline-none shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:border-[#9860FF] rounded-lg text-white"
          >
            <option value="" disabled>Select a chain</option>
            <option value="ethereum">Ethereum</option>
            <option value="matic">Matic</option>
            <option value="binancecoin">binancecoin</option>
          </select>
          {errors.chain && <p className="text-red-500 text-xs">{errors.chain}</p>}
        </div>

        <div onClick={() => setshowOption(!showOption)} className="flex mt-3 cursor-pointer justify-start gap-1 items-center"><h1 className="text-[white] font-semibold  md:text-[16px]">
          {!showOption ? "Show more options" : "Hide more options"}
        </h1>
          <button className="text-[#9860FF] hover:underline font-semibold  md:text-[16px]">{!showOption ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}</button>

        </div>
        {showOption && (
          <>
            <div className="flex-col w-full  flex justify-start gap-1 mt-3 items-start ">
              <h1 className="text-[white] font-semibold  md:text-[16px]">
                Telegram link
              </h1>
              <Input
                name="telegramLink"
                color="teal"
                labelProps={{ className: "hidden" }}
                className="!border p-[7px] !border-gray-300 bg-transparent !outline-none shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-white placeholder:opacity-70 focus:!border-[#9860FF] focus:!border-t-[#9860FF]  rounded-lg text-white"
                placeholder="Optional"
                value={formData.telegramLink}
                onChange={handleChange}
              />
            </div>
            <div className="flex-col w-full  flex justify-start gap-1 mt-3 items-start ">
              <h1 className="text-[white] font-semibold  md:text-[16px]">
                Twitter link
              </h1>
              <Input
                name="twitterLink"
                color="teal"
                labelProps={{ className: "hidden" }}
                className="!border p-[7px] !border-gray-300 bg-transparent !outline-none shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-white placeholder:opacity-70 focus:!border-[#9860FF] focus:!border-t-[#9860FF]  rounded-lg text-white"
                placeholder="Optional"
                value={formData.twitterLink}
                onChange={handleChange}
              />
            </div>
            <div className="flex-col w-full  flex justify-start gap-1 mt-3 items-start ">
              <h1 className="text-[white] font-semibold  md:text-[16px]">
                Website
              </h1>
              <Input
                name="website"
                color="teal"
                labelProps={{ className: "hidden" }}
                className="!border p-[7px] !border-gray-300 bg-transparent !outline-none shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-white placeholder:opacity-70 focus:!border-[#9860FF] focus:!border-t-[#9860FF]  rounded-lg text-white"
                placeholder="Optional"
                value={formData.website}
                onChange={handleChange}
              />
            </div>
          </>
        )}

        <h1 className="text-[#9860FF] mt-3 font-medium  md:text-[14px]">
          Tip: coin data cannot be changed after creation
        </h1>
        {!address && <button className="bg-grade mx-auto my-6 text-center text-white  btn-shadow  text-[16px] font-normal tracking-wide border-x-2 border-b-2 border-white/50 p-3 flex justify-center items-start rounded-[16px] "
          onClick={() => open()} >
          Connect Wallet
        </button>}
        {address && <button
          className="bg-grade mx-auto my-6 text-center text-white  btn-shadow  text-[16px] font-normal tracking-wide border-x-2 border-b-2 border-white/50 p-3 flex justify-center items-start rounded-[16px]"
          onClick={handleSubmit}>
          Create Token
        </button>}
        <h1 className="text-[#9860FF] mt-3 font-medium  md:text-[14px]">
          When your coin completes its bonding curve you receive 0.5 SOL
        </h1>
      </div>
    </div>
  </>
  );
};

export default Create;