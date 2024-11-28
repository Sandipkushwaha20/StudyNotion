import React, { useEffect, useState } from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
// import AiOutlineMenu from 'react-icons/ai'
import { Link, matchPath, useLocation } from 'react-router-dom';
import { SidebarData } from './SidebarData';
import './SideBar.css';
import { IconContext } from 'react-icons';
import { apiConnector } from '../../../services/apiConnector';
import { categories } from '../../../services/apis';
import { BsChevronDown } from 'react-icons/bs';
// import ProfileDropdown from '../../core/Auth/ProfileDropdown';
// import { useSelector } from 'react-redux';
// import { ACCOUNT_TYPE } from '../../../utils/constants';

function SideBar() {
  const [sidebar, setSidebar] = useState(false);
  const location = useLocation();
  const [loading , setLoading] = useState(false);
  const showSidebar = () => setSidebar(!sidebar);
  const [subLinks, setSubLinks] = useState([]);
  // const { token } = useSelector((state) => state.auth);
  // const { user } = useSelector((state) => state.profile);
  // const { totalItems } = useSelector((state) => state.cart);
  
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API);
        setSubLinks(res.data.data);
      } catch (error) {
        console.log("Could not fetch Categories.", error);
      }
      setLoading(false);
    })();
  }, []);

  const matchRoute = (route) => {
    return matchPath({ path: route } , location.pathname);
  }
  return (
    <div className='absol'>
      <IconContext.Provider value={{ color: '#fff' }}>
        <div className='SideBar'>
          <Link to='#' className='menu-bars'>
          {/* <AiOutlineMenu fontSize={24} fill="#AFB2BF" /> */}
            <FaIcons.FaBars onClick={showSidebar} />
          </Link>
        </div>
        <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
          <ul className='nav-menu-items' onClick={showSidebar}>
            <li className='SideBar-toggle'>
              <Link to='#' className='menu-bars'>
                <AiIcons.AiOutlineClose />
              </Link>
            </li>
            {SidebarData.map((link, index) => {
              return (
                <li key={index} className={link.cName}>
                    {link.title === "Catalog" ? (
                    <>
                        <div
                        className={`group relative flex cursor-pointer items-center gap-1 ml-10 ${
                            matchRoute("/catalog/:catalogName")
                            ? "text-yellow-25"
                            : "text-richblack-25"
                        }`}
                        >
                        <p>{link.title}</p>
                        <BsChevronDown />
                        <div className="invisible absolute left-[50%] top-[50%] z-[1000] 
                        flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg
                         bg-richblack-500 p-4 text-richblack-900  opacity-0 transition-all
                          duration-150 group-hover:visible group-hover:translate-y-[1.65em] 
                          group-hover:opacity-100 lg:w-[300px] ">
                            <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%]
                             translate-y-[-40%] rotate-45 select-none rounded bg-richblack-500"></div>
                            {loading ? (
                            <p className="text-center">Loading...</p>
                            ) : subLinks.length ? (
                                <div className="">
                                {subLinks.map((subLink, i) => (
                                <Link
                                        to={`/catalog/${subLink.name.split(" ").join("-").toLowerCase()}`}
                                    className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblue-500 "
                                    key={i}
                                >
                                    <p>{subLink.name}</p>
                                </Link>
                                ))}
                            </div>
                                ) : (
                            <p className="text-center">No Courses Found</p>
                            )}
                        </div>
                    </div>
                    </>
                    ) : (
                  <Link to={link?.path}>
                    <p
                      className={`${
                        matchRoute(link?.path)
                          ? "text-yellow-25"
                          : "text-richblack-25"
                      }`}
                    >
                      {link.title}
                    </p>
                  </Link>
                )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Login / Signup / Dashboard */}
        {/* no need to login or signup bc we are using the same code of Navbar  */}
      </IconContext.Provider>
    </div>
  );
}

export default SideBar;



