import React, { useEffect } from 'react';
import logo from '../logo.png';

const LandingPage = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js';
    script.onload = () => {
      window.particlesJS("particles-js", {
        particles: {
          number: { value: 80, density: { enable: true, value_area: 800 } },
          color: { value: ["#00f0ff"] },
          shape: { type: "circle", stroke: { width: 0, color: "#000" } },
          opacity: { value: 0.5, random: true },
          size: { value: 4, random: true },
          line_linked: {
            enable: true,
            distance: 150,
            color: "#ffffff",
            opacity: 0.2,
            width: 1
          },
          move: {
            enable: true,
            speed: 2,
            direction: "none",
            random: false,
            straight: false,
            out_mode: "out",
            bounce: false
          }
        },
        interactivity: {
          detect_on: "canvas",
          events: {
            onhover: { enable: true, mode: "grab" },
            onclick: { enable: true, mode: "push" },
            resize: true
          },
          modes: {
            grab: { distance: 140, line_linked: { opacity: 0.8 } },
            bubble: { distance: 400, size: 40, duration: 2, opacity: 0.8 },
            repulse: { distance: 200, duration: 0.4 },
            push: { particles_nb: 4 },
            remove: { particles_nb: 2 }
          }
        },
        retina_detect: true
      });
    };
    document.body.appendChild(script);
  }, []);

  const startZoomOut = () => {
    document.querySelector('.center-content').classList.add('zoom-out');

    const spaceshipLine = document.createElement('div');
    spaceshipLine.classList.add('spaceship-line');
    document.body.appendChild(spaceshipLine);

    document.querySelector('.enter-button').style.display = 'none';

    setTimeout(() => {
      window.location.href = 'profile';
    }, 2000);
  };

  return (
    <>
      <style>{`
        html, body, #root {
          margin: 0;
          padding: 0;
          height: 100%;
          background: #000;
          overflow: hidden;
          font-family: 'Stellar', sans-serif;
        }

        #particles-js {
          position: absolute;
          width: 100%;
          height: 100%;
          z-index: 0;
        }

        .center-content {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          z-index: 1;
        }

        .logo-image {
          width: 120px;
          margin-bottom: 20px;
          filter: drop-shadow(0 0 12px rgba(0, 255, 255, 0.6));
          animation: pulse 2s infinite alternate;
        }

        @keyframes pulse {
          from { transform: scale(1); opacity: 0.9; }
          to { transform: scale(1.05); opacity: 1; }
        }

        .kalaverse-text {
          font-size: 4em;
          letter-spacing: 18px;
          background: linear-gradient(45deg, #ff007f, #00ff7f, #007fff, #ff7f00);
          background-clip: text;
          color: transparent;
          text-shadow: 0 0 15px #0ff, 0 0 25px #0ff;
          animation: colorShift 3s infinite alternate;
        }

        @keyframes colorShift {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }

        .neon-underline {
          margin-top: 20px;
          width: 250px;
          height: 5px;
          background: #0ff;
          filter: blur(4px);
          border-radius: 3px;
        }

        .enter-button {
  margin-top: 60px;
  padding: 12px 28px;
  background: transparent;
  color: white;
  border: 2px solid #0ff;
  border-radius: 10px;
  font-size: 1.2em;
  cursor: pointer;
  box-shadow: 0 0 15px #0ff;
  transition: background 0.3s ease, box-shadow 0.3s ease;
  z-index: 1;
}

.enter-button:hover {
  background: rgba(0, 255, 255, 0.1);
  box-shadow: 0 0 25px #0ff, 0 0 25px #0ff;
}



        .zoom-out {
          animation: zoomOutEffect 2s forwards;
        }

        @keyframes zoomOutEffect {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(3);
            opacity: 0;
          }
        }

        .spaceship-line {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 2px;
          height: 100%;
          background-color: #00f0ff;
          transform-origin: center;
          animation: spaceshipLines 2s linear forwards;
          z-index: 5;
        }

        .spaceship-line::before,
        .spaceship-line::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          background-color: #00f0ff;
          width: 2px;
          height: 150px;
          animation: spaceshipLines 2s linear forwards;
        }

        .spaceship-line::before { transform: rotate(45deg); }
        .spaceship-line::after { transform: rotate(-45deg); }

        @keyframes spaceshipLines {
          0% { transform: scale(1); opacity: 0; }
          50% { transform: scale(3); opacity: 1; }
          100% { transform: scale(5); opacity: 0; }
        }
      `}</style>

      <div id="particles-js"></div>

      <div className="center-content">
        <img src={logo} alt="Logo" className="logo-image" />
        <div className="kalaverse-text">MINTEREST</div>
        <div className="neon-underline"></div>
        <button className="enter-button" onClick={startZoomOut}>ENTER</button>
      </div>
    </>
  );
};

export default LandingPage;
