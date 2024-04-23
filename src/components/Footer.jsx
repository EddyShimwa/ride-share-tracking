import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faHome, faBell } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
    const handleHeartClick = () => {
        console.log('Heart clicked');
    }

    const handleHomeClick = () => {
        console.log('Home clicked');
    }

    const handleBellClick = () => {
        console.log('Bell clicked');
    }
  return (
<div className='flex justify-between p-3 bg-gradient-to-r from-green-500 to-blue-500 h-[10vh] sm:h-[15vh] md:h-[8vh] lg:h-[25vh] xl:h-[8vh] items 2xl:h-[35vh] items-center'>
  <FontAwesomeIcon icon={faHeart} color={"white"} size="2x" onClick={handleHeartClick}/>
  <FontAwesomeIcon icon={faHome} color={"white"} size="2x" onClick={handleHomeClick}/>
  <FontAwesomeIcon icon={faBell} color={"white"} size="2x" onClick={handleBellClick}/>
</div>
  );
};

export default Footer;