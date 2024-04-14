import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';

export const SidebarData = [
  {
    title: "Home",
    path: "/",
    icon: <AiIcons.AiFillHome />,
    cName: 'nav-text'
  },
  {
    title: "About Us",
    path: "/about",
    icon: <IoIcons.IoIosPaper />,
    cName: 'nav-text'
  },
  {
    title: "Catalog",
    // path: '/products',
    icon: <FaIcons.FaCartPlus />,
    cName: 'nav-text'
  },
  {
    title: "Contact Us",
    path: "/contact",
    icon: <IoIcons.IoMdPeople />,
    cName: 'nav-text'
  },
  {
    title: 'Messages',
    path: '/messages',
    icon: <FaIcons.FaEnvelopeOpenText />,
    cName: 'nav-text'
  },
  {
    title: 'Support',
    path: '/support',
    icon: <IoIcons.IoMdHelpCircle />,
    cName: 'nav-text'
  }

  
];