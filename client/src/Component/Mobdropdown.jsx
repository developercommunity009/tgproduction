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

const Mobdropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(images[0]); // Default selected image

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleImageSelect = (image) => {
    setSelectedImage(image); // Update the selected image
    setIsOpen(false); // Close the dropdown after selection
  };

  return (
    <div className="relative font-poppins  rounded-[16px]  border-x-2 border-b-2 border-white/50 w-full ">
      {/* Dropdown Button showing the selected image */}
      <div
        className="flex items-center   justify-center text-[14px]  gap-2 bg-grade text-white tracking-wide py-2 px-2 rounded-[16px] focus:outline-none"
        onClick={toggleDropdown}
      >
      <div className='flex justify-start items-center gap-2'>
        <img
          src={selectedImage.src}
          alt={selectedImage.label}
          className="w-8 h-8 rounded-full"
        />
        {selectedImage.label}
        </div>
        <ExpandMoreIcon/>
      </div>

      {/* Dropdown Menu with images */}
      {isOpen && (
        <div
          className="transition-all w-full duration-300 opacity-100 max-h-40 overflow-auto absolute bg-[#EFF1F6] rounded-xl border border-gray-200 shadow-lg mt-2  z-10"
        >
          <ul>
            {images.map((image) => (
              <li
                key={image.label}
                className="flex text-[#5cdbd4] items-center gap-2 px-4 py-2 hover:bg-gray-200 cursor-pointer"
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

export default Mobdropdown;
