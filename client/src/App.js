import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './pages/Navbar';
import Home from './pages/Home';
import BrowseNFTs from './pages/BrowseNFTs';
import MyNfts from './pages/MyNFTs';
import Profile from './pages/Profile';
import './global.css';
import LandingPage from './pages/LandingPage';
import NftUriSearch from './pages/Search';

const AppWrapper = () => {
  const location = useLocation();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js';
    script.onload = () => {
      window.particlesJS('particles-js', {
        particles: {
          number: { value: 80, density: { enable: true, value_area: 800 } },
          color: { value: ['#00f0ff'] },
          shape: { type: 'circle' },
          opacity: { value: 0.5, random: true },
          size: { value: 3, random: true },
          line_linked: { enable: true, distance: 150, color: '#ffffff', opacity: 0.2, width: 1 },
          move: { enable: true, speed: 2 }
        },
        interactivity: {
          events: {
            onhover: { enable: true, mode: 'grab' },
            onclick: { enable: true, mode: 'push' },
            resize: true
          },
          modes: {
            grab: { distance: 140, line_linked: { opacity: 0.8 } }
          }
        },
        retina_detect: true
      });
    };
    document.body.appendChild(script);
  }, []);

  return (
    <>
      <div id="particles-js"></div>
      {location.pathname !== '/' && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/browse-listed-nfts" element={<BrowseNFTs />} />
        <Route path="/my-nfts" element={<MyNfts />} />
        <Route path="/search" element={<NftUriSearch />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
};

const App = () => (
  <Router>
    <AppWrapper />
  </Router>
);

export default App;
