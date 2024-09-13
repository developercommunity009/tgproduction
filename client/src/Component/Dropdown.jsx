import React, { useState } from 'react';
import eth from "../../src/assets/ETH.png"
import polygon from "../../src/assets/polygon.png"
import bnb from "../../src/assets/bnb.jpeg"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// Sample images for the dropdown options
const images = [
  { src: eth, label: 'Ethereum' },
  { src: polygon, label: 'Polygom' },
  { src: bnb , label: 'BNB' },

];

const Dropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(images[0]);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleImageSelect = (image) => {
    setSelectedImage(image); 
    setIsOpen(false);
  };

  return (
    <div className="relative font-poppins w-[18%]  rounded-[16px]  border-x-2 border-b-2 border-white/50  hidden md:block ">
      <button
        className="flex items-center w-full justify-center   md:text-[14px]  gap-2 bg-grade text-white tracking-wide py-2 px-2 rounded-[16px] focus:outline-none  "
        onClick={toggleDropdown}
      >
        <img
          src={selectedImage.src}
          alt={selectedImage.label}
          className="w-8 h-8 rounded-full"
        />
        {selectedImage.label}
        <ExpandMoreIcon/>
      </button>
      {isOpen && (
        <div
          className="transition-all w-full duration-300 opacity-100 max-h-40 overflow-auto absolute bg-[#EFF1F6] rounded-xl border border-gray-200 shadow-lg mt-2  z-10"
        >
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
