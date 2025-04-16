// src/components/Navbar.js
import React from 'react';
import { useLocation } from 'react-router-dom';
import { FaUser, FaImages, FaSearch, FaStore } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';


const Navbar = () => {
  const location = useLocation();

  if (location.pathname === '/') return null;

  return (
    <>
      <style>{`
        @keyframes fadeSlideDown {
          0% {
            opacity: 0;
            transform: translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          display: flex;
          justify-content: center;
          gap: 3rem;
          padding: 1rem 2rem;
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(0, 255, 255, 0.2);
          box-shadow: 0 0 10px rgba(0, 255, 255, 0.15), 0 0 30px rgba(0, 255, 255, 0.1);
          z-index: 999;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          animation: fadeSlideDown 0.5s ease-in-out;
        }

        .nav-link {
          color: #ffffff;
          text-decoration: none;
          font-size: 1.05rem;
          font-weight: 500;
          position: relative;
          padding: 6px 10px;
          transition: all 0.3s ease-in-out;
        }

        .nav-link:hover {
          color: #00ffff;
        }

        .nav-link.active {
            color: #00ffff;
        }

        .nav-link::after {
          content: '';
          position: absolute;
          width: 0%;
          height: 2px;
          bottom: 0;
          left: 0;
          background-color: #00ffff;
          transition: width 0.3s ease-in-out;
        }

        .nav-link:hover::after, .nav-link.active::after {
          width: 100%;
        }

        .nav-content {
            display: flex;
            align-items: center;
            gap: 6px;
        }
      `}</style>

        <nav className="navbar">
            <NavLink className="nav-link" to="/profile">
                <span className="nav-content">
                    <FaUser style={{ marginRight: '6px' }} />
                    Profile
                </span>
            </NavLink>
            <NavLink className="nav-link" to="/my-nfts">
                <span className="nav-content">
                    <FaImages style={{ marginRight: '6px' }} />
                    My NFTs
                </span>
            </NavLink>
            <NavLink className="nav-link" to="/search">
                <span className="nav-content">
                    <FaSearch style={{ marginRight: '6px' }} />
                    Search
                </span>
            </NavLink>
            <NavLink className="nav-link" to="/browse-listed-nfts">
                <span className="nav-content">
                    <FaStore style={{ marginRight: '6px' }} />
                    Browse Listed NFTs
                </span>
            </NavLink>
        </nav>

    </>
  );
};

export default Navbar;
