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
import ProfileDropdown from '../../core/Auth/ProfileDropdown';
import { useSelector } from 'react-redux';
import { ACCOUNT_TYPE } from '../../../utils/constants';

function SideBar() {
  const [sidebar, setSidebar] = useState(false);
  const location = useLocation();
  const [loading , setLoading] = useState(false);
  const showSidebar = () => setSidebar(!sidebar);
  const [subLinks, setSubLinks] = useState([]);
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);
  
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
    <>
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
                        <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
                            <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                            {loading ? (
                            <p className="text-center">Loading...</p>
                            ) : subLinks.length ? (
                                <>
                                {subLinks.map((subLink, i) => (
                                <Link
                                        to={`/catalog/${subLink.name.split(" ").join("-").toLowerCase()}`}
                                    className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblue-500 "
                                    key={i}
                                >
                                    <p>{subLink.name}</p>
                                </Link>
                                ))}
                            </>
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
        <div className="hidden items-center gap-x-4 md:flex">
          {user && user.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
            <Link to="/dashboard/cart" className="relative">
              <AiIcons.AiOutlineShoppingCart className="text-2xl text-richblack-100" />
              {totalItems > 0 && (
                <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                  {totalItems}
                </span>
              )}
            </Link>
          )}
          {token === null && (
            <Link to="/login">
              <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                Log in
              </button>
            </Link>
          )}
          {token === null && (
            <Link to="/signup">
              <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                Sign up
              </button>
            </Link>
          )}
          {token !== null && <ProfileDropdown />}
        </div>
      </IconContext.Provider>
    </>
  );
}

export default SideBar;