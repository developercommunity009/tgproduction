import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import eth from "../../src/assets/ETH.png";
import polygon from "../../src/assets/polygon.png";
import bnb from "../../src/assets/bnb.jpeg";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const images = [
  { src: eth, label: 'Ethereum', chainId: '0x1' },    // Ethereum Mainnet
  { src: polygon, label: 'Polygon', chainId: '0x89' }, // Polygon Mainnet
  { src: bnb, label: 'BNB', chainId: '0x56' },        // BNB Smart Chain
];

const Dropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const init = async () => {
      // Check if the browser has an Ethereum provider (like MetaMask)
      if (window.ethereum) {
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(web3Provider);

        // Get the current account
        const accounts = await web3Provider.listAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      } else {
        console.error('Ethereum provider not found. Please install MetaMask.');
      }
    };

    init();
  }, []);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleImageSelect = async (image) => {
    setSelectedImage(image);
    setIsOpen(false);

    if (!provider || !account) {
      console.error("No provider or account found. Please connect your wallet.");
      return;
    }

    try {
      await provider.send('wallet_switchEthereumChain', [
        { chainId: image.chainId }
      ]);
      console.log(`Successfully switched to ${image.label}`);
    } catch (error) {
      console.error(`Error switching to ${image.label}:`, error);

      if (error.code === 4902) {
        try {
          await provider.send('wallet_addEthereumChain', [
            {
              chainId: image.chainId,
              chainName: image.label,
              nativeCurrency: {
                name: image.label === 'BNB' ? 'BNB' : image.label === 'Polygon' ? 'MATIC' : 'ETH',
                symbol: image.label === 'BNB' ? 'BNB' : image.label === 'Polygon' ? 'MATIC' : 'ETH',
                decimals: 18,
              },
              rpcUrls: [
                image.label === 'BNB' ? 'https://bsc-dataseed.binance.org/' :
                image.label === 'Polygon' ? 'https://polygon-rpc.com/' :
                'https://mainnet.infura.io/v3/2O5Wir4dxBijQYRqg0GIv0oSS4S'
              ],
              blockExplorerUrls: [
                image.label === 'BNB' ? 'https://bscscan.com' :
                image.label === 'Polygon' ? 'https://polygonscan.com' :
                'https://etherscan.io'
              ],
            },
          ]);
          console.log(`Successfully added and switched to ${image.label}`);
        } catch (addError) {
          console.error(`Failed to add ${image.label} network:`, addError);
        }
      }
    }
  };

  return (
    <div className="relative font-poppins w-[18%] rounded-[16px] border-x-2 border-b-2 border-white/50 hidden md:block">
      <button
        className="flex items-center w-full justify-center md:text-[14px] gap-2 bg-grade text-white tracking-wide py-2 px-2 rounded-[16px] focus:outline-none"
        onClick={toggleDropdown}
      >
        <img
          src={selectedImage.src}
          alt={selectedImage.label}
          className="w-8 h-8 rounded-full"
        />
        {selectedImage.label}
        <ExpandMoreIcon />
      </button>
      {isOpen && (
        <div className="transition-all w-full duration-300 opacity-100 max-h-40 overflow-auto absolute bg-[#EFF1F6] rounded-xl border border-gray-200 shadow-lg mt-2 z-10">
          <ul>
            {images.map((image) => (
              <li
                key={image.label}
                className="flex text-[#3C2763] items-center gap-2 px-4 py-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => handleImageSelect(image)}
              >
                <img
                  src={image.src}
                  alt={image.label}
                  className="w-8 h-8 rounded-full"
                />
                {image.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
