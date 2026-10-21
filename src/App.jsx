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

function checkIsVasanthPage() {
  if (typeof window === 'undefined') return false;
  const search = window.location.search.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  return (
    search.includes('page=vasanth') ||
    search.includes('page=showcase') ||
    search.includes('view=vasanth') ||
    search.includes('view=showcase') ||
    hash.includes('vasanth') ||
    hash.includes('showcase')
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
  const [isVasanthView, setIsVasanthView] = useState(checkIsVasanthPage);
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
      setIsVasanthView(checkIsVasanthPage());
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
    setIsVasanthView(false);
    setIsAdminView(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const openVasanthPage = () => {
    window.history.pushState({}, '', '?page=vasanth');
    setIsVasanthView(true);
    setIsDemoView(false);
    setIsAdminView(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const openAdmin = () => {
    window.history.pushState({}, '', '?page=admin');
    setIsAdminView(true);
    setIsVasanthView(false);
    setIsDemoView(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const returnToPortfolio = () => {
    window.history.pushState({}, '', window.location.pathname);
    setIsDemoView(false);
    setIsVasanthView(false);
    setIsAdminView(false);
  };

  const renderContent = () => {
    if (isAdminView) {
      return <AdminDashboard onReturnToPortfolio={returnToPortfolio} />;
    }

    if (isVasanthView) {
      return (
        <VasanthPage
          onReturnToPortfolio={returnToPortfolio}
          onOpenAdmin={openAdmin}
          settings={settings}
          onSettingsChange={handleSettingsChange}
        />
      );
    }

    if (isDemoView) {
      return <SkillsSphereDemo onReturnToPortfolio={returnToPortfolio} />;
    }

    return (
      <div className="App">
        <Navbar
          onOpenDemo={openDemo}
          onOpenVasanthPage={openVasanthPage}
          onOpenAdmin={openAdmin}
          settings={settings}
          onSettingsChange={handleSettingsChange}
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
  };

  return (
    <PortfolioDataProvider>
      {renderContent()}
    </PortfolioDataProvider>
  );
}

export default App;
