import React from 'react';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import SponsorsSlider from '../components/SponsorsSlider';
import ProgramSection from '../components/ProgramSection';
import TicketOptionsSection from '../components/TicketOptionsSection';
import SponsorsSection from '../components/SponsorsSection';
import RegistrationSection from '../components/RegistrationSection';
import Disclaimer from '../components/Disclaimer';
import Footer from '../components/Footer';

function Home() {
  return (
    <div className="App">
      <HeroSection />
      <AboutSection />
      <SponsorsSlider />
      <ProgramSection />
      <TicketOptionsSection />
      <SponsorsSection />
      <RegistrationSection />
      <Disclaimer />
      <Footer />
    </div>
  );
}

export default Home;
