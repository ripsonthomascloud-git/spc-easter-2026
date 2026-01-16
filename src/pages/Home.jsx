import React from 'react';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import ProgramSection from '../components/ProgramSection';
import TicketOptionsSection from '../components/TicketOptionsSection';
import SponsorsSection from '../components/SponsorsSection';
import RegistrationSection from '../components/RegistrationSection';
import Footer from '../components/Footer';

function Home() {
  return (
    <div className="App">
      <HeroSection />
      <AboutSection />
      <ProgramSection />
      <TicketOptionsSection />
      <SponsorsSection />
      <RegistrationSection />
      <Footer />
    </div>
  );
}

export default Home;
