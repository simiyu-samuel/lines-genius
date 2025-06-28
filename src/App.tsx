import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { SavedLinesProvider } from './context/SavedLinesContext';
import { SubscriptionProvider } from './context/SubscriptionContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Landing } from './pages/Landing';
import { Generator } from './pages/Generator';
import { SavedLines } from './pages/SavedLines';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Auth } from './pages/Auth';
import { Pricing } from './pages/Pricing';
import { Community } from './pages/Community';
import { Courses } from './pages/Courses';
import { ApiDocs } from './pages/ApiDocs';

function App() {
  useEffect(() => {
    // Initialize EmailJS with the USER_ID from environment variables
    emailjs.init(import.meta.env.VITE_EMAILJS_USER_ID || 'qU2NlZClNfJyjoXMz');
  }, []); // Empty dependency array ensures it runs once on mount

  return (
    <ThemeProvider>
      <AuthProvider>
        <SubscriptionProvider>
          <SavedLinesProvider>
            <Router>
              <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 transition-colors duration-300">
                <Header />
                <main>
                  <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/generate" element={<Generator />} />
                    <Route path="/saved" element={<SavedLines />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/pricing" element={<Pricing />} />
                    <Route path="/community" element={<Community />} />
                    <Route path="/courses" element={<Courses />} />
                    <Route path="/api-docs" element={<ApiDocs />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </Router>
          </SavedLinesProvider>
        </SubscriptionProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;