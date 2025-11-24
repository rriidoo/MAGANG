import { useState } from 'react';
import { Settings } from 'lucide-react';
import { ContentProvider } from './contexts/ContentContext';
import Hero from './components/Hero';
import About from './components/About';
import Positions from './components/Positions';
import Benefits from './components/Benefits';
import Testimonials from './components/Testimonials';
import RegistrationForm from './components/RegistrationForm';
import FAQ from './components/FAQ';
import ClosingCTA from './components/ClosingCTA';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';

function App() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const scrollToRegister = () => {
    const element = document.getElementById('register');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToPositions = () => {
    const element = document.getElementById('positions');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <ContentProvider>
      <div className="min-h-screen">
        <Hero onDaftarClick={scrollToRegister} onPelajariClick={scrollToPositions} />
        <About />
        <Positions />
        <Benefits />
        <Testimonials />
        <RegistrationForm />
        <FAQ />
        <ClosingCTA onDaftarClick={scrollToRegister} />
        <Footer />
        
        {/* Admin Panel Toggle Button */}
        <button
          onClick={() => setIsAdminOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-emerald-500 to-lime-500 hover:from-emerald-600 hover:to-lime-600 text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 z-40"
          title="Open Admin Panel"
        >
          <Settings className="w-6 h-6" />
        </button>

        {/* Admin Panel */}
        <AdminPanel isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
      </div>
    </ContentProvider>
  );
}

export default App;
