import React, { useEffect, useRef, memo, useContext } from "react";

import dummy from '../../../src/assets/dummy.jpg'
import pic from '../../../src/assets/card4.png'
import { useState } from "react";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { ContextApi } from "../../Context/ContextApi";
import { useParams } from "react-router-dom";
import moment from 'moment';
import Tokentable from "./Tokentable";
import SplineArea from "../../Component/Garph";
import { useSocket } from "../../Context/SocketContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useWeb3Modal, useWeb3ModalAccount } from "@web3modal/ethers5/react";



const Buy = () => {
  const { getACoin, getCoinHoldres, getCommentsByCoin, getChartDataByCoinId, getCoinByHeld, userId, replyToComment, getTrxnByCoin, postCommentsToCoin, toggelLike, buyToken, sellToken } = useContext(ContextApi);
  const { address } = useWeb3ModalAccount();
  const { open } = useWeb3Modal();
  const { socket } = useSocket();
  const { id } = useParams();
  const [buy, setBuy] = useState(true);
  const [threads, setThreads] = useState(true);
  const [showSort, setShowSort] = useState(false);
  const [count, setCount] = useState(0);
  const [coinData, setCoinData] = useState(null)
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const [showReplies, setShowReplies] = useState({});
  const [openReplyInput, setOpenReplyInput] = useState({});
  const [replyTexts, setReplyTexts] = useState({});
  const [trads, setTrads] = useState([]);
  const [data, setData] = useState([]);
  const [holders, setHolders] = useState([]);

  const [selectedOption, setSelectedOption] = useState('Newest');
  const [sortedComments, setSortedComments] = useState(comments);

  useEffect(() => {
    sortComments(selectedOption);
  }, [comments, selectedOption]);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setShowSort(false);
  };

  const shortenAddress = (addre) => {
    return `${addre.slice(0, 6)}...${addre.slice(-4)}`;
  };

  const sortComments = (option) => {
    const sorted = [...comments].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);

      if (option === 'Newest') {
        return dateB - dateA; // Newest first
      } else if (option === 'Oldest') {
        return dateA - dateB; // Oldest first
      }
      return 0;
    });
    setSortedComments(sorted);
  };


  const toggleShowReplies = (index) => {
    setShowReplies((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const toggleReplyInput = (index) => {
    setOpenReplyInput((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleInputReplyChange = (index, e) => {
    const { value } = e.target;
    setReplyTexts((prev) => ({
      ...prev,
      [index]: value,
    }));
  };


  const handleInputChange = (e) => {
    setComment(e.target.value);
  };

  const fetchComment = async () => {
    try {
      const data = await getCommentsByCoin(id);
      setComments(data);
    } catch (error) {
      console.error('Error fetching coin data:', error);
    }
  };



  const postComment = async () => {
    if (!comment.trim()) {
      return;
    }
    // Prepare comment data
    const commentData = {
      content: comment.trim(),
      coinId: id,
      userId,
    };
    try {
      await postCommentsToCoin(commentData);
      // Reset comment input after successful post
      setComment('');
      fetchComment()
    } catch (err) {
      console.error('Error posting comment:', err);
    }
  };



  // FOR Reply
  const replyComment = async (index, commentId) => {
    const replyText = replyTexts[index]; // Get the specific reply text for this comment by index

    if (!replyText || !replyText.trim()) {
      return;
    }

    // Prepare comment data
    const replyData = {
      content: replyText.trim(),
      commentId,
      userId,
    };

    try {
      await replyToComment(replyData);
      // Reset comment input after successful post
      setReplyTexts((prev) => ({
        ...prev,
        [index]: '', // Clear the reply text for this specific index
      }));
      fetchComment();
    } catch (err) {
      console.error('Error posting comment:', err);
    }
  };

  // LIKE & DISLIKE COMMENT
  const likeDisLikeComment = async (commentId) => {
    const likeData = {
      commentId,
      userId,
    };
    try {
      await toggelLike(likeData);
      fetchComment();
    } catch (err) {
      console.error('Error posting comment:', err);
    }
  };






  useEffect(() => {
    if (!socket) return;

    // Listen for trade buy events
    socket.on("tradeBuy", (data) => {
      console.log("Buy event received:", data);
      fetchCoinData(); // Update coin and transaction data
    });

    // Listen for trade sell events
    socket.on("tradeSell", (data) => {
      console.log("Sell event received:", data);
      fetchCoinData(); // Update coin and transaction data
    });

    // Clean up on component unmount
    return () => {
      socket.off("tradeBuy");
      socket.off("tradeSell");
    };
  }, [socket]); // Re-run the effect when the socket is available

  const fetchCoinData = async () => {
    try {
      const data = await getACoin(id);
      setCoinData(data.coin);
      const result = await getTrxnByCoin(id);
      setTrads(result);
      const response = await getChartDataByCoinId(id);
      const coinChartData = response.data;

      // Transform the API data to fit the chart's format
      const transformedData = coinChartData.map(item => ({
        x: new Date(item.timestamp * 1000), // Convert Unix timestamp to JavaScript Date
        y: item.price // Use price for y-axis
      }));



      setData(transformedData);
    } catch (error) {
      console.error("Error fetching coin data:", error);
    }
  };

  const getHolders = async (id) => {
    try {
      const data = await getCoinHoldres(id);
      setHolders(data.data.holders);
    } catch (error) {
      console.error("Error fetching coin data:", error);
    }
  };

  useEffect(() => {
    fetchCoinData(); // Fetch coin and transaction data on mount
    getHolders(id)
  }, [id]);
  console.log(coinData)
  const buyCoins = async () => {
    const coinData = {
      coinId: id,
      amount: count,
      userId,
    };

    try {
      const res = await buyToken(coinData);
      setCount(0);
      if (res.statusCode === 200) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
      socket.emit("buy", coinData);
    } catch (error) {
      console.error("Error buying coins:", error);
    }
  };

  const sellCoins = async () => {
    const coinData = {
      coinId: id,
      amount: count,
      userId,
    };

    try {
      const res = await sellToken(coinData);
      setCount(0);
      console.log(res)
      if (res.statusCode === 200) {
        toast.success(res.message);
      }
      socket.emit("sell", coinData);
    } catch (error) {
      console.error("Error selling coins:", error);
      toast.error(error?.response?.data?.message);
    }
  };

  const handleChange = (e) => {
    setCount(e.target.value);
  };

  const getTokenSymbol = () => {
    switch (coinData?.chain?.toLowerCase()) {
      case "binancecoin":
        return "BNB";
      case "ethereum":
        return "ETH";
      case "matic":
        return "MATIC";
      default:
        return "";
    }
  };


  return (
    <>
      <ToastContainer />

      <div className="lg:px-16 max-w-[500px] md:max-w-[1569px] mx-auto text-white md:px-8 px-4 font-poppins mt-4 pb-24 xl:pb-12 pt-4 lg:py-12">
        <div className=" w-full flex flex-col lg:flex-row   gap-8 lg:gap-2 !justify-start lg:justify-between  !items-start">

          <SplineArea data={data} />



          <div className="lg:col-span-1 lg:ml-auto  md:ml-[30%] md:col-span-2  col-span-3 h-full sticky w-full md:w-[50%] mx-auto   ">
            <div className="      bg-[#0D0D0D] rounded-lg    px-6 py-3">
              <div className="flex justify-start gap-2 items-center">
                <div className=" relative h-[55px] w-[55px]">
                  <img
                    src={coinData?.image}
                    alt=""
                    className="rounded-full border h-full w-full object-cover "
                  />
                </div>
                <h2 className="text-[20px]  uppercase text-white  text-center leading-5   font-bold">
                  {coinData?.name}
                </h2>
              </div>
              <div className="flex justify-start pt-3 gap-4 items-center">
                <button
                  onClick={() => setBuy(!buy)}
                  className={`text-[16px] font-bold font-Montserrat uppercase   text-center leading-5 ${buy ? "text-[#9860FF]" : "text-white"
                    }`}
                >
                  Buy
                </button>
                <button
                  onClick={() => setBuy(!buy)}
                  className={`text-[16px] font-bold font-Montserrat uppercase  text-center leading-5 ${buy ? "text-white" : "text-[#9860FF]"
                    }   `}
                >
                  Sell
                </button>
              </div>
              <h1 className="w-full border mt-3 border-gray-300 h-[1px]"></h1>
              <div className="mt-3">
                <h2 className="text-left text-white font-semibold text-[16px]">
                  {`Enter Amount in ${getTokenSymbol()}`}
                </h2>

                <h1 className="w-full border mt-3 border-gray-300 h-[1px]"></h1>
                <input
                  className="text-lg text-white font-medium mt-3 w-full text-center bg-transparent p-1 border border-gray-500 rounded-md"
                  type="text"
                  placeholder={`Enter amount in ${getTokenSymbol()}`}
                  value={count}
                  onChange={handleChange}
                />
                {address ? (
                  // Check if the market cap is less than or equal to 69000
                  coinData?.usdMarketCap <= 69000 ? (
                    // If buying, display the Buy button
                    buy ? (
                      <div
                        className="rounded-full mt-3 items-center justify-center flex border-x-2 border-b-2 border-white/50 shadow-lg bg-grade text-white duration-300 cursor-pointer active:scale-[0.98]"
                        onClick={buyCoins}
                      >
                        <button className="px-5 rounded-full py-2">
                          <a href="#">Buy</a>
                        </button>
                      </div>
                    ) : (
                      // If selling, display the Sell button
                      <div
                        className="rounded-full mt-3 items-center justify-center flex border-x-2 border-b-2 border-white/50 shadow-lg bg-grade text-white duration-300 cursor-pointer active:scale-[0.98]"
                        onClick={sellCoins}
                      >
                        <button className="px-5 rounded-full py-2">
                          <a href="#">Sell</a>
                        </button>
                      </div>
                    )
                  ) : (
                    // If the market cap is above 69000, display Trade End
                    <div className="rounded-full mt-3 items-center justify-center flex border-x-2 border-b-2 border-white/50 shadow-lg bg-grade text-white duration-300 cursor-pointer active:scale-[0.98]">
                      <button className="px-5 rounded-full py-2">
                        <a href="#">Trade End</a>
                      </button>
                    </div>
                  )
                ) : (
                  // If no wallet is connected, display Connect Wallet button
                  <div className="rounded-full mt-3 items-center justify-center flex border-x-2 border-b-2 border-white/50 shadow-lg bg-grade text-white duration-300 cursor-pointer active:scale-[0.98]"
                  onClick={()=>open()}>
                    <button className="px-5 rounded-full py-2">
                      <a href="#">Connect Wallet</a>
                    </button>
                  </div>
                )}

                <div className="flex mt-3 justify-between items-center p-2">
                  <div>
                    <h2 className="text-white leading-5 text-[14px] font-bold" >MC</h2>
                    <h2 className="text-[#ACB6E5] text-[12px] text-grade font-bold">${coinData?.usdMarketCap?.toFixed(0)}</h2>
                  </div>
                  <div>
                    <h2 className="text-white leading-5 text-[14px] font-bold" >Price</h2>
                    <h2 className="text-[#ACB6E5] text-[12px] text-grade font-bold">${coinData?.currentPrice?.toFixed(6)}</h2>
                  </div>

                </div>
              </div>
            </div>

            {coinData?.creator === userId && coinData?.usdMarketCap > 69000 && (
              <div className="rounded-full mt-3 items-center justify-center flex border-x-2 border-b-2 border-white/50 shadow-lg bg-grade text-white duration-300 cursor-pointer active:scale-[0.98]">
                <button className="px-5 rounded-full py-2">
                  <a className="" href="#">Deploy Token</a>
                </button>
              </div>
            )}


            <div>
              <h1 className="text-[12px] leading-[24px] bg-[#0D0D0D] text-justify mt-2 rounded-lg font-light text-[#CFC8C8] p-4">
                {coinData && coinData.description}
              </h1>
            </div>

          </div>
        </div>

        <div className="flex flex-col-reverse lg:ml-auto md:ml-[5%] lg:flex-row justify-center lg:justify-between lg:items-start items-center w-full gap-8  lg:gap-2">
          <div className=" w-full   ">
            <div className="flex justify-start gap-4">
              <button onClick={() => setThreads(!threads)}
                className={`relative px-8 py-2  rounded-md border-x-2 border-b-2 border-white/50  isolation-auto z-10 
            font-bold overflow-hidden hover:scale-105 ${threads ? "bg-grade " : "  bg-[#0D0D0D] "}  `}
              >
                Thread
              </button>
              <button onClick={() => setThreads(!threads)}
                className={`relative px-8 py-2  rounded-md border-x-2 border-b-2 border-white/50  isolation-auto z-10 
         font-bold overflow-hidden hover:scale-105 ${threads ? "bg-[#0D0D0D] " : "bg-grade"}  `}
              >
                Trades
              </button>
            </div>
            {threads ? (
              <div className="mt-6 w-full  ">
                <div className="relative border-b flex justify-between items-center px-3 rounded-lg mt-2 border-[#9860FF] ">
                  <input
                    type="text"
                    className="bg-transparent outline-none lg:w-[400px] xl:w-[500px] text-white pr- py-[9px] text-[16px] rounded-[12px]"
                    placeholder="Add Comment"
                    value={comment}
                    onChange={handleInputChange}
                  />

                  <button className="text-[#9860FF] font-semibold text-[16px]"
                    onClick={postComment}>
                    post
                  </button>
                </div>
                <div className="flex  mt-4 gap-4 justify-start items-center">
                  <h2 className="text-[#CFC8C8] font-semibold text-[16px]">Sort by</h2>
                  <div
                    onClick={() => setShowSort(!showSort)}
                    className="block"
                  >
                    <div className="relative">
                      <div className="w-[200px] border border-[#9860FF]  px-[10px] py-2 rounded-[10px] flex items-center gap-[5px] lg:gap-0 justify-between cursor-pointer">
                        <div className="flex items-center gap-[7px]">
                          <h2 className="text-[14px] text-white font-normal block">
                            {selectedOption}
                          </h2>
                        </div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden="true"
                          className="text-[#9860FF] h-[15px] lg:h-[20px] pr-[5px]"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      {showSort && (
                        <div className="absolute top-[45px] z-[60]  border border-[#9860FF] left-0 right-0 bg-[black]  rounded-[10px] shadow-[rgba(255,255,255,0.09)_0px_4px_4px_0px]">
                          <div className="py-[5px]  ">
                            <h2 className="text-white text-center text-[14px] font-normal"></h2>
                          </div>
                          <div className="px-[20px] py-[13px] space-y-[13px]">
                            <button className="flex items-center gap-[7px] cursor-pointer"
                              onClick={() => handleOptionClick('Oldest')}>
                              <h2 className="text-[14px] text-white font-normal">
                                Oldest
                              </h2>
                            </button>
                            <button className="flex items-center gap-[7px] cursor-pointer">
                              <h2 className="text-[14px] text-white font-normal"
                                onClick={() => handleOptionClick('Newest')}>
                                Newest
                              </h2>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {sortedComments.map((comment, index) => (
                  <div
                    key={comment.id || index}
                    className="flex w-full mt-6 justify-start items-start gap-2"
                  >
                    <div className=" relative h-[50px] w-[50px] md:h-[40px] md:w-[40px]">
                      <img
                        src={comment.userId.profilePicture || dummy}
                        alt=""
                        className="rounded-full border h-full w-full object-cover border-[#FFF3F3]"
                      />
                    </div>
                    <div>
                      <h2 className=" text-[16px]">{comment.userId.wallet}</h2>
                      <p className="text-[12px]">{moment(comment.createdAt).format('MMM D, YYYY h:mm A')}</p>
                      <h2 className="font-normal mt-2 text-[14px]">{comment.content}</h2>
                      <div className="flex justify-between items-center">
                        <h2
                          onClick={() => toggleShowReplies(index)}
                          className="font-bold cursor-pointer text-[white] mt-2 text-[12px]"
                        >
                          {showReplies[index]
                            ? `Hide ${comment.replies.length} replies`
                            : `Show ${comment.replies.length} replies`}
                        </h2>
                        <div className="flex gap-1" onClick={() => likeDisLikeComment(comment._id)}>
                          <FavoriteBorderIcon style={{ color: 'gray', fontSize: '18px' }} aria-label="like" />
                          <span className="text-[14px]">{comment.likes.length}</span>
                        </div>
                        <button
                          onClick={() => toggleReplyInput(index)}
                          className="text-[#9860FF] hover:underline font-semibold text-[12px]"
                        >
                          click for reply
                        </button>
                      </div>
                      {showReplies[index] && comment.replies.map((reply, replyIndex) => (
                        <div key={reply.id || replyIndex} className="flex mt-6 justify-start items-start gap-2">
                          <div className="relative h-[50px] w-[50px] md:h-[40px] md:w-[40px]">
                            <img
                              src={reply.user.profilePicture || dummy}
                              alt=""
                              className="rounded-full border h-full w-full object-cover border-[#FFF3F3]"
                            />
                          </div>
                          <div>
                            <h2 className="text-[16px]">{reply.user.wallet}</h2>
                            <p className="text-[12px]">{moment(reply.createdAt).format('MMM D, YYYY h:mm A')}</p>
                            <h2 className="font-normal mt-2 text-[14px]">{reply.content}</h2>
                          </div>
                        </div>
                      ))}
                      {openReplyInput[index] && (
                        <div className="relative border-b flex justify-between items-center px-3 rounded-lg mt-2 border-[#9860FF]">
                          <input
                            type="text"
                            className="bg-transparent outline-none lg:w-[400px] xl:w-[500px] text-white py-[9px] text-[16px] rounded-[12px]"
                            placeholder="Reply Comment"
                            value={replyTexts[index] || ''} // Set value from state or empty string
                            onChange={(e) => handleInputReplyChange(index, e)} // Pass index to handler
                          />
                          <button
                            className="text-[#9860FF] font-semibold text-[12px]"
                            onClick={() => replyComment(index, comment._id)} // Pass index and comment ID
                          >
                            Reply
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-6 w-full  ">
                <Tokentable trads={trads} />
              </div>
            )}


          </div>
          <div className="text-[12px] w-full md:w-[49%]  leading-[24px] bg-[#0D0D0D] text-justify mt-2 rounded-lg font-light text-[#CFC8C8] p-4">
            <h1 className="text-2xl font-bold text-white ">Holders</h1>
            {holders.map((i, index) => (
              <div key={index} className="flex w-full items-center justify-between mt-2 p-2">
                <div className="flex items-center justify-start">
                  <div className="h-10 w-10 rounded-full overflow-hidden">
                    <img className="object-cover object-center h-full w-full" src={i.user.profilePicture || dummy} alt="" />
                  </div>

                  <h1 className="text-[#808080] text-[16px] font-semibold ml-[8px] cursor-pointer">{shortenAddress(i.user.wallet)}</h1>
                </div>
                <h1 className="text-white  text-[16px] font-semibold  ">{i.tokenQty.toFixed(2)}</h1>
              </div>
            ))}
          </div>
        </div>


        {/* {openreply && (
        <div className="relative border-b flex justify-between items-center px-3 rounded-lg mt-2 border-[#9860FF] ">
          <input
            type="text"
            className="bg-transparent outline-none lg:w-[400px] xl:w-[500px] text-white pr- py-[9px] text-[16px] rounded-[12px]"
            placeholder="Add Comment"
          />

          <button className="text-[#9860FF] font-semibold text-[16px]">
            Reply
          </button>
        </div>
      )} */}
      </div>
    </>
  );
};

export default Buy;
