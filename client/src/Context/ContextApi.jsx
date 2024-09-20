import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import { TG_SERVER_URI } from '../../constant';
console.log(TG_SERVER_URI)

// Create the context
export const ContextApi = createContext();

// Create a provider component
export const Context = ({ children }) => {



    const [userId, setUserId] = useState('');
    const [storedUser, setstoredUser] = useState('');

    const [data, setData] = useState([]);
    const [hils, setHils] = useState([]);


    //  UPLOAD IMAGE TO CLOUDNARY
    const uploadToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append('image', file);
        try {
            const response = await axios.post(`${TG_SERVER_URI}/images/upload`, formData);
            return response.data.data.image;  // Make sure the returned data contains the `url` property
        } catch (error) {
            throw new Error('Failed to upload image to Cloudinary');
        }
    };



    // CREATE COIN
    const createCoin = async (formData) => {
        try {
            const response = await axios.post(`${TG_SERVER_URI}/coins/`, formData);
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    // CREATE User
    const createUser = async (wallet) => {

        try {
            // Clear local storage at the start of the function

            const response = await axios.post(`${TG_SERVER_URI}/users/`, { wallet });
            console.log(response);
            const user = response.data.data.user || response.data.data.existingUser;

            // Save the new user data in local storage
            localStorage.setItem('user', JSON.stringify(user));

            return user;
        } catch (error) {
            throw error;
        }
    };



    const getUserIdFromLocalStorage = () => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            return user; // or user.id depending on your field name
        }
        return null;
    };


    // GET ALL  COINS
    const getAllCoins = async () => {
        try {
            const response = await axios.get(`${TG_SERVER_URI}/coins/`,);
            setData(response.data.data.coins);
            return;
        } catch (error) {
            throw error;
        }
    };

    // GET ALL  COINS
    const getHilCoins = async () => {
        try {
            const response = await axios.get(`${TG_SERVER_URI}/coins/hill/coins`,);
            setHils(response.data.data.coins);
            return;
        } catch (error) {
            throw error;
        }
    };


    // GET A  COIN
    const getACoin = async (id) => {
        try {
            const response = await axios.get(`${TG_SERVER_URI}/coins/${id}`);
            return response.data.data;
        } catch (error) {
            throw error;
        }
    };

    // GET COINS BY WALLET 
    const getCoinsByUserId = async (userId) => {
        try {
            const response = await axios.get(`${TG_SERVER_URI}/coins/coins/${userId}`);
            return response.data.data;
        } catch (error) {
            throw error;
        }
    };

    // GET COINS BY SEARCH
    const getCoinsBySearch = async (value) => {

        try {
            const response = await axios.get(`${TG_SERVER_URI}/coins/search`, { params: { query: value } });
            
            setData(response.data.data)
            return response.data.data;
        } catch (error) {
            throw error;
        }
    };


    // GET CHART DATA BY  COINID 
    const getChartDataByCoinId = async (coinId) => {
        try {
            const response = await axios.get(`${TG_SERVER_URI}/chart/${coinId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    };



    // SET USER PROFILE PICTURE
    const setUserProfilePicture = async (formData) => {
        try {
            const response = await axios.patch(`${TG_SERVER_URI}/users/updateprofileimagebywallet`, formData);
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    const filterCoins = async (filters) => {
        try {
            const response = await axios.get(`${TG_SERVER_URI}/coins/`, { params: filters });
            setData(response.data.data.coins); // Update state with filtered coins
            return response.data.data.coins;
        } catch (error) {
            throw error;
        }
    };



    //GET COMMENTS BY COIN 
    const getCommentsByCoin = async (coinId) => {
        try {
            const response = await axios.get(`${TG_SERVER_URI}/comments/${coinId}`);
            return response.data.message;
        } catch (error) {
            throw error;
        }
    };
    //GET TRXN BY COIN 

    const getTrxnByCoin = async (coinId) => {
        try {
            const response = await axios.get(`${TG_SERVER_URI}/trnx/coin/${coinId}`);
            return response.data.data;
        } catch (error) {
            throw error;
        }
    };


    //GET  COIN BY USER HELD 

    const getCoinByHeld = async (userId) => {
        try {
            const response = await axios.get(`${TG_SERVER_URI}/coins/coinheld/${userId}`);
            return response.data.data;
        } catch (error) {
            throw error;
        }
    };

    //GET Candle Data
    const getcoinCandle = async (coinData) => {
        const { interval, coinId } = coinData
        try {
            const response = await axios.get(`${TG_SERVER_URI}/candle/candlesticks`, {
                params: {
                    interval: interval,
                    coinId: coinId
                }
            });

            return response.data.data;
        } catch (error) {
            throw error;
        }
    };

    //GET TRXN BY USER 
    const getTrxnByUser = async (userId) => {
        try {
            const response = await axios.get(`${TG_SERVER_URI}/trnx/user/${userId}`);
            return response.data.data;
        } catch (error) {
            throw error;
        }
    };

    //GET  LATEST TRXN 
    const getLatestTrxn = async (userId) => {
        try {
            const response = await axios.get(`${TG_SERVER_URI}/trnx/getlatest`);
            console.log(response.data.data)
            return response.data.data;
        } catch (error) {
            throw error;
        }
    };


    //POST COMMENTS TO COIN 
    const postCommentsToCoin = async (commentData) => {
        try {
            const response = await axios.post(`${TG_SERVER_URI}/comments/`, commentData);
            return response.data.message;
        } catch (error) {
            throw error;
        }
    };

    //POST COMMENTS TO COIN 
    const buyToken = async (coinData) => {
        const { coinId, ...other } = coinData
        try {
            const response = await axios.post(`${TG_SERVER_URI}/coins/buy/${coinId}`, other);
            return response.data;
        } catch (error) {
            throw error;
        }
    };
    //POST COMMENTS TO COIN 
    const sellToken = async (coinData) => {
        const { coinId, ...other } = coinData
        try {
            const response = await axios.post(`${TG_SERVER_URI}/coins/sell/${coinId}`, other);
            return response.data;
        } catch (error) {
            throw error;
        }
    };
    //POST COMMENTS TO COIN 
    const getCoinHoldres = async (coinId) => {
        try {
            const response = await axios.get(`${TG_SERVER_URI}/coins/coinholdres/${coinId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    //REPLY TO COMMENTS 
    const replyToComment = async (replyData) => {
        const { commentId, ...forbodyData } = replyData;
        try {
            const response = await axios.post(`${TG_SERVER_URI}/comments/${commentId}/reply/`, forbodyData);
            return response.data.message;
        } catch (error) {
            throw error;
        }

    };

    //TOGGEL LIKE
    const toggelLike = async (likeData) => {
        const { commentId, userId } = likeData
        try {
            const response = await axios.put(`${TG_SERVER_URI}/comments/${commentId}/like/`, { userId });
            return response.data.message;
        } catch (error) {
            throw error;
        }
    };



    useEffect(() => {
        const fetchUserId = () => {
            try {
                const user = getUserIdFromLocalStorage();
                if (user) {
                    setstoredUser(user)
                    setUserId(user._id);
                }
            } catch (error) {
                console.error("Error fetching user ID from local storage:", error);
            }
        };

        fetchUserId();
    }, []);


    return (
        <ContextApi.Provider value={{
            createUser,
            replyToComment,
            setUserProfilePicture,
            getCoinsByUserId,
            postCommentsToCoin,
            toggelLike,
            getCommentsByCoin,
            userId,
            storedUser,
            uploadToCloudinary,
            createCoin,
            getAllCoins,
            getACoin,
            data,
            setData,
            filterCoins,
            setstoredUser,
            buyToken,
            sellToken,
            getTrxnByUser,
            getTrxnByCoin,
            getcoinCandle,
            getCoinByHeld,
            getChartDataByCoinId,
            getCoinHoldres,
            hils,
            setHils,
            getHilCoins,
            getLatestTrxn,
            getCoinsBySearch
        }}>
            {children}
        </ContextApi.Provider>
    );
};
