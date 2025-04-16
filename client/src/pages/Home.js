import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <>
      <style>{`
        @font-face {
          font-family: 'Ailerons';
          src: url('https://cdn.jsdelivr.net/gh/edent/SuperTinyIcons/fonts/Ailerons-Typeface.otf') format('opentype');
        }

        .home-container {
          position: relative;
          z-index: 1;
          height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          color: white;
          font-family: 'Ailerons', sans-serif;
          padding: 0 2rem;
        }

        .home-heading {
          font-size: 4.5em;
          letter-spacing: 8px;
          color: #ffffff;
          text-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff;
          margin-bottom: 50px;
          animation: pulseGlow 3s ease-in-out infinite;
        }

        @keyframes pulseGlow {
          0%, 100% {
            text-shadow: 0 0 10px #0ff, 0 0 20px #0ff, 0 0 30px #0ff;
          }
          50% {
            text-shadow: 0 0 20px #0ff, 0 0 30px #0ff, 0 0 40px #0ff;
          }
        }

        .login-link {
          padding: 14px 32px;
          background: linear-gradient(135deg, rgba(0,255,255,0.15), rgba(0,255,255,0.05));
          color: #ffffff;
          border: 2px solid #00ffff;
          border-radius: 12px;
          font-size: 1.3em;
          text-decoration: none;
          box-shadow: 0 0 20px #00ffff;
          transition: all 0.3s ease;
          backdrop-filter: blur(4px);
        }

        .login-link:hover {
          box-shadow: 0 0 25px #00ffff, 0 0 35px #00ffff;
          transform: scale(1.08);
          background: rgba(0, 255, 255, 0.2);
        }
      `}</style>

      <div className="home-container">
        <h1 className="home-heading">Enter the NFT Multiverse</h1>
        <Link className="login-link" to="/profile">
          Connect with Metamask
        </Link>
      </div>
    </>
  );
};

export default Home;
