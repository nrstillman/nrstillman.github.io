import Layout from '../components/Layout';
import Footer from '../components/Footer';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';

const AboutPage = () => {
  const [loaded, setLoaded] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [hoverImage, setHoverImage] = useState('default');
  
  // Animation on component mount
  useEffect(() => {
    setLoaded(true);
  }, []);
  
  return (
      <Layout>
      {/* Main content with adjusted ratio */}
      <div className="flex flex-col lg:flex-row flex-grow">
        {/* Left side - Text content area (3/5) */}
        <div className="w-full lg:w-3/5 px-8 lg:px-12 py-12">
          <div className={`transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/*<h1 className="text-4xl lg:text-5xl font-bold mb-8 text-left">Transform your digital presence.</h1>*/}            
            <p className="text-lg mb-6 leading-relaxed text-left">
              I am interested in developing interpretable AI methods for scientific research, with a specific focus on 
              <span 
                className={`font-bold mx-1 border-b ${darkMode ? 'border-white' : 'border-gray-800'} cursor-pointer`}
                onMouseEnter={() => setHoverImage('simulation-methods')}
                onMouseLeave={() => setHoverImage('default')}
              >
                simulation-based methods.
              </span> 
              I am especially interested in
              <span 
                className={`font-bold mx-1 border-b ${darkMode ? 'border-white' : 'border-gray-800'} cursor-pointer`}
                onMouseEnter={() => setHoverImage('sbi')}
                onMouseLeave={() => setHoverImage('default')}
              >
                simulation-based inference,
              </span>
              <span 
                className={`font-bold mx-1 border-b ${darkMode ? 'border-white' : 'border-gray-800'} cursor-pointer`}
                onMouseEnter={() => setHoverImage('geometric-learning')}
                onMouseLeave={() => setHoverImage('default')}
              >
                geometric learning,
              </span>
              and 
              <span 
                className={`font-bold mx-1 border-b ${darkMode ? 'border-white' : 'border-gray-800'} cursor-pointer`}
                onMouseEnter={() => setHoverImage('hybrid-models')}
                onMouseLeave={() => setHoverImage('default')}
              >
                deep generative or hybrid models.
              </span>
              I have worked on research problems in many different fields, ranging from nanotechnology through to finance but my long-term aim is to combine deep learning with traditional mathematical models of complex and collective systems to discover new rules for 
              <span 
                className={`font-bold mx-1 border-b ${darkMode ? 'border-white' : 'border-gray-800'} cursor-pointer`}
                onMouseEnter={() => setHoverImage('living-systems')}
                onMouseLeave={() => setHoverImage('default')}
              >
                living and non-equilibrium systems 
              </span> and integrating these rules into 
              <span 
                className={`font-bold mx-1 border-b ${darkMode ? 'border-white' : 'border-gray-800'} cursor-pointer`}
                onMouseEnter={() => setHoverImage('active-learning')}
                onMouseLeave={() => setHoverImage('default')}
              >
              active learning and experiment design.
              </span>               
            </p>
                      
            <p className="text-lg mb-6 leading-relaxed text-left">
            I received my PhD in Engineering Mathematics from the University of Bristol in 2018, for my doctoral research on using atomic force microscopy (AFM) to acoustically measure material stiffness at the nanoscale. After completing my PhD, I joined the EVONANO project (2018), where I developed a computational pipeline for the automatic discovery of nanomedicines. I later worked in the Mayor lab at UCL (2021), developing models for cell migration and researching methods to extract mathematical models directly from experimental data. In 2023, I joined Simudyne where I currently lead on AI R&D, applying deep learning with simulation-based methods to the latest problems in industry.
            </p>

            <p className="text-lg mb-6 leading-relaxed text-left">
              My research has been generously supported by grants and awards, including funding from EDF, Sellafield, and EPSRC (2014-2018), EU Horizon 2020 FET-Open (2018-2020), the Alan Turing Institute (2021) and the Wellcome Trust (2021-2022).
            </p>
            
                        <p className="text-lg mb-6 leading-relaxed text-left">
              This site is under constant development and personal writings should not be treated as reference material. Note that all writings are my own work and are not constructed using generative models (except my internal one). This website is best viewed on a large screen. 
            </p>
            <div className="text-left">
              <button className={`mt-8 px-6 py-3 rounded-full transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                darkMode ? 'bg-white text-gray-900' : 'bg-gray-800 text-white'
              }`}>
                Get in touch
              </button>
            </div>
                        
            <Footer className="mt-16" />
          </div>
        </div>
        



        {/* Right side - Full-height hover content section (2/5) */}
        <div className={`hidden lg:block lg:w-2/5 transition-all duration-1000 ${
          loaded ? 'opacity-100' : 'opacity-0'
        } bg-gray-200 text-gray-800`}>
          <div className="sticky top-0 h-screen w-full flex items-center justify-center">
            {hoverImage === 'simulation-methods' && (
              <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300">
                <div className="text-center p-6">
                  <h3 className="text-2xl font-bold mb-4">Simulation-methods</h3>
                  <p className="text-base max-w-xs mx-auto">
                    Exploring the frontiers of AI and human interaction through rigorous methods 
                    and innovative approaches.
                  </p>
                </div>
              </div>
            )}
            
            {hoverImage === 'sbi' && (
              <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300">
                <div className="text-center p-6">
                  <h3 className="text-2xl font-bold mb-4">Simulation-based Inference</h3>
                  <p className="text-base max-w-xs mx-auto">
                    Designing intuitive ways for humans to interact with complex systems.
                  </p>
                </div>
              </div>
            )}
            
            {hoverImage === 'living-systems' && (
              <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300">
                <div className="text-center p-6">
                  <h3 className="text-2xl font-bold mb-4">Living Systems</h3>
                  <p className="text-base max-w-xs mx-auto">
                    Designing intuitive ways for humans to interact with complex systems.
                  </p>
                </div>
              </div>
            )}
            
            {hoverImage === 'active-learning' && (
              <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300">
                <div className="text-center p-6">
                  <h3 className="text-2xl font-bold mb-4">Active Learning & Experiment Design</h3>
                  <p className="text-base max-w-xs mx-auto">
                    Designing intuitive ways for humans to interact with complex systems.
                  </p>
                </div>
              </div>
            )}
            {hoverImage === 'geometric-learning' && (
              <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300">
                <div className="text-center p-6">
                  <h3 className="text-2xl font-bold mb-4">Geometric Learning & GNNs</h3>
                  <p className="text-base max-w-xs mx-auto">
                    Building practical tools that solve real-world problems.
                  </p>
                </div>
              </div>
            )}
            
            {hoverImage === 'default' && (
              <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300">
                <div className="text-center p-6">
                  <h3 className="text-3xl font-bold mb-4">Welcome</h3>
                  <p className="text-base max-w-xs mx-auto">
                    Hover over highlighted text to explore my work.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;