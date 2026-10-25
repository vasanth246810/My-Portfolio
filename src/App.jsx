import React, { useState, useEffect } from 'react';
import './App.css';
import { PortfolioDataProvider } from './context/PortfolioDataContext';
import { Home } from './component/Home';
import { Navbar, DEFAULT_SETTINGS } from './component/Navbar';
import About from './component/About';
import Projects from './component/Projects';
import GitContributionMap from './component/GitContributions/GitContributionMap';
import Contact from './component/contact';
import Footer from './component/Footer';
import Skills from './component/Skills';
import SkillsSphereDemo from './component/SkillsSphere/SkillsSphereDemo';
import VasanthPage from './component/VasanthPage/VasanthPage';
import AdminDashboard from './component/Admin/AdminDashboard';

function checkIsDemo() {
  if (typeof window === 'undefined') return false;
  const search = window.location.search.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  return (
    search.includes('demo=skills-sphere') ||
    search.includes('view=sphere') ||
    hash.includes('skills-sphere') ||
    hash.includes('demo')
  );
}

function checkIsClassicPortfolio() {
  if (typeof window === 'undefined') return false;
  const search = window.location.search.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  return (
    search.includes('page=classic') ||
    search.includes('page=old') ||
    search.includes('view=classic') ||
    search.includes('view=old') ||
    hash.includes('classic') ||
    hash.includes('old')
  );
}

function checkIsAdmin() {
  if (typeof window === 'undefined') return false;
  const search = window.location.search.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  return (
    search.includes('page=admin') ||
    search.includes('view=admin') ||
    search.includes('admin=true') ||
    hash.includes('admin')
  );
}

function App() {
  const [isDemoView, setIsDemoView] = useState(checkIsDemo);
  const [isClassicView, setIsClassicView] = useState(checkIsClassicPortfolio);
  const [isAdminView, setIsAdminView] = useState(checkIsAdmin);

  // Settings state persisted in localStorage
  const [settings, setSettings] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('portfolio_settings');
        if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      } catch {
        // Fallback to default on parse error
      }
    }
    return DEFAULT_SETTINGS;
  });

  const handleSettingsChange = (newSettings) => {
    setSettings(newSettings);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('portfolio_settings', JSON.stringify(newSettings));
      } catch {
        // Storage quota / private browsing fallback
      }
    }
  };

  useEffect(() => {
    const handleUrlChange = () => {
      setIsDemoView(checkIsDemo());
      setIsClassicView(checkIsClassicPortfolio());
      setIsAdminView(checkIsAdmin());
    };

    // Hotkey: Ctrl + Shift + A or Cmd + Shift + A opens Admin CMS
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        openAdmin();
      }
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const openDemo = () => {
    window.history.pushState({}, '', '?demo=skills-sphere');
    setIsDemoView(true);
    setIsClassicView(false);
    setIsAdminView(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const openClassicPortfolio = () => {
    window.history.pushState({}, '', '?page=classic');
    setIsClassicView(true);
    setIsDemoView(false);
    setIsAdminView(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const openAdmin = () => {
    window.history.pushState({}, '', '?page=admin');
    setIsAdminView(true);
    setIsClassicView(false);
    setIsDemoView(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const returnToMainPortfolio = () => {
    window.history.pushState({}, '', window.location.pathname);
    setIsClassicView(false);
    setIsDemoView(false);
    setIsAdminView(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const renderContent = () => {
    if (isAdminView) {
      return <AdminDashboard onReturnToPortfolio={returnToMainPortfolio} />;
    }

    if (isDemoView) {
      return <SkillsSphereDemo onReturnToPortfolio={returnToMainPortfolio} />;
    }

    if (isClassicView) {
      return (
        <div className="App">
          <Navbar
            onOpenDemo={openDemo}
            onOpenVasanthPage={returnToMainPortfolio}
            onOpenAdmin={openAdmin}
            settings={settings}
            onSettingsChange={handleSettingsChange}
            isClassicView={true}
          />
          <Home />
          <About />
          <Skills settings={settings} onSettingsChange={handleSettingsChange} />
          <Projects />
          <GitContributionMap />
          <Contact />
          <Footer />
        </div>
      );
    }

    // Default: New Portfolio (VasanthPage) is the Main Portfolio
    return (
      <VasanthPage
        onOpenClassicPortfolio={openClassicPortfolio}
        onOpenAdmin={openAdmin}
        settings={settings}
        onSettingsChange={handleSettingsChange}
      />
    );
  };

  return (
    <PortfolioDataProvider>
      {renderContent()}
    </PortfolioDataProvider>
  );
}

export default App;
