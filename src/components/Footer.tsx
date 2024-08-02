import React from 'react';

const Footer = () => {
  return (
    <div className="bg-backy py-2 flex flex-col items-center">
      <img src="/images.png" alt="Logo" className="mb-2 rounded-xl" style={{ maxHeight: '65px', width: 'auto' }} />
      <p className="text-white">©2024 by Aggie House</p>
    </div>
  );
};

export default Footer;