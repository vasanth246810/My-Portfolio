import React, { useState, useMemo } from 'react';
import './AdminDashboard.css';
import { usePortfolioData } from '../../context/PortfolioDataContext';
import { getFirebaseConfig, saveFirebaseConfig, clearFirebaseConfig } from '../../services/firebase';
import { SkillIcon, BUILT_IN_ICON_KEYS } from '../SkillsSphere/skillAssetIcons.jsx';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Database, 
  ExternalLink, 
  ArrowLeft, 
  Lock, 
  LogOut, 
  Sparkles,
  Layers,
  Briefcase,
  Settings,
  Github,
  User,
  FileText,
  GraduationCap,
  Cpu,
  Award,
  BookOpen,
  Share2,
  Mail,
  Save,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

export default function AdminDashboard({ onReturnToPortfolio }) {
  const {
    profile,
    socials,
    skills,
    education,
    awards,
    writings,
    projects,
    experiences,
    isFirebaseConfigured,
    currentUser,
    loginAdmin,
    loginWithGitHub,
    logoutAdmin,
    updateProfile,
    updateSocials,
    updateSkills,
    createSkill,
    editSkill,
    removeSkill,
    createEducation,
    editEducation,
    removeEducation,
    createAward,
    editAward,
    removeAward,
    createWriting,
    editWriting,
    removeWriting,
    createProject,
    editProject,
    removeProject,
    createExperience,
    editExperience,
    removeExperience,
    populateWithDefaultData
  } = usePortfolioData();

  // Authentication State
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [bypassAuth, setBypassAuth] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState('profile');
  const [saveStatus, setSaveStatus] = useState('');

  const triggerSaveNotification = (msg = 'Changes saved successfully!') => {
    setSaveStatus(msg);
    setTimeout(() => setSaveStatus(''), 3500);
  };

  // 1. Profile State
  const [profileForm, setProfileForm] = useState(profile || {});
  const [roleInput, setRoleInput] = useState('');

  // 2. About Me State
  const [aboutForm, setAboutForm] = useState({
    classicAbout: profile?.classicAbout || '',
    aboutBio: profile?.aboutBio || '',
    aboutParas: profile?.aboutParas || [],
    flipCardTitle: profile?.flipCardTitle || '',
    flipCardBack: profile?.flipCardBack || ''
  });
  const [paraInput, setParaInput] = useState('');

  // 3. Socials & Contact State
  const [socialsForm, setSocialsForm] = useState(socials || {});

  // 4. Skills State & Filter
  const [skillCategoryFilter, setSkillCategoryFilter] = useState('All');
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [editingSkillId, setEditingSkillId] = useState(null);
  const [skillForm, setSkillForm] = useState({
    name: '',
    category: 'Frontend',
    customCategory: '',
    icon: 'react',
    imageUrl: '',
    level: 'Expert',
    color: '#61dafb'
  });

  // 5. Education Modal State
  const [isEduModalOpen, setIsEduModalOpen] = useState(false);
  const [editingEduId, setEditingEduId] = useState(null);
  const [eduForm, setEduForm] = useState({
    institution: '',
    degree: '',
    period: '',
    score: '',
    highlights: ''
  });

  // 6. Awards Modal State
  const [isAwardModalOpen, setIsAwardModalOpen] = useState(false);
  const [editingAwardId, setEditingAwardId] = useState(null);
  const [awardForm, setAwardForm] = useState({
    title: '',
    issuer: '',
    year: '2026',
    link: ''
  });

  // 7. Writings Modal State
  const [isWritingModalOpen, setIsWritingModalOpen] = useState(false);
  const [editingWritingId, setEditingWritingId] = useState(null);
  const [writingForm, setWritingForm] = useState({
    title: '',
    subtitle: '',
    meta: '6 min read · 2026',
    url: ''
  });

  // 8. Projects Modal State
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [projectForm, setProjectForm] = useState({
    title: '',
    no: '01 / 2026 · Product',
    tag: '',
    lede: '',
    award: '',
    chips: [],
    linkText: 'Read the write-up',
    linkUrl: '',
    githubUrl: '',
    image: ''
  });
  const [projectChipInput, setProjectChipInput] = useState('');

  // 9. Experiences Modal State
  const [isExpModalOpen, setIsExpModalOpen] = useState(false);
  const [editingExpId, setEditingExpId] = useState(null);
  const [expForm, setExpForm] = useState({
    role: '',
    company: '',
    navMeta: '',
    period: '',
    location: '',
    lede: '',
    points: [],
    chips: []
  });
  const [expPointInput, setExpPointInput] = useState('');
  const [expChipInput, setExpChipInput] = useState('');

  // 10. Firebase Config Tab State
  const [rawConfig, setRawConfig] = useState(() => JSON.stringify(getFirebaseConfig(), null, 2));
  const [configStatus, setConfigStatus] = useState('');
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState(null);

  // Sync incoming context changes if not editing
  React.useEffect(() => {
    if (profile) {
      setProfileForm(profile);
      setAboutForm({
        classicAbout: profile.classicAbout || '',
        aboutBio: profile.aboutBio || '',
        aboutParas: profile.aboutParas || [],
        flipCardTitle: profile.flipCardTitle || '',
        flipCardBack: profile.flipCardBack || ''
      });
    }
  }, [profile]);

  React.useEffect(() => {
    if (socials) setSocialsForm(socials);
  }, [socials]);

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setIsLoggingIn(true);
    try {
      await loginAdmin(authEmail, authPassword);
    } catch (err) {
      setAuthError(err.message || 'Failed to login. Please verify your credentials.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGitHubLogin = async (useRedirect = false) => {
    setAuthError('');
    setIsLoggingIn(true);
    try {
      await loginWithGitHub(useRedirect);
    } catch (err) {
      setAuthError(err.message || 'Failed to authenticate with GitHub.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Profile Save
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    await updateProfile(profileForm);
    triggerSaveNotification('Profile & Hero details saved!');
  };

  // About Save
  const handleSaveAbout = async (e) => {
    e.preventDefault();
    await updateProfile(aboutForm);
    triggerSaveNotification('About Me & Bio information saved!');
  };

  // Socials Save
  const handleSaveSocials = async (e) => {
    e.preventDefault();
    await updateSocials(socialsForm);
    triggerSaveNotification('Contact & Social links updated!');
  };

  // ================= Skills Handlers & Filters ================= //
  const availableCategories = useMemo(() => {
    const defaultCats = ['Frontend', 'Backend', 'Languages', 'Databases', 'Cloud & DevOps', 'Tools', 'AI / ML'];
    const customCats = new Set();
    skills.forEach(s => {
      if (s.category && !defaultCats.includes(s.category)) {
        customCats.add(s.category);
      }
    });
    return ['All', ...defaultCats, ...Array.from(customCats)];
  }, [skills]);

  const filteredSkills = useMemo(() => {
    if (skillCategoryFilter === 'All') return skills;
    return skills.filter(s => (s.category || '').toLowerCase() === skillCategoryFilter.toLowerCase());
  }, [skills, skillCategoryFilter]);

  const handleOpenAddSkill = () => {
    setEditingSkillId(null);
    setSkillForm({
      name: '',
      category: 'Frontend',
      customCategory: '',
      icon: 'react',
      imageUrl: '',
      level: 'Expert',
      color: '#61dafb'
    });
    setIsSkillModalOpen(true);
  };

  const handleOpenEditSkill = (skill) => {
    setEditingSkillId(skill.id);
    const standardCategories = ['Frontend', 'Backend', 'Languages', 'Databases', 'Cloud & DevOps', 'Tools', 'AI / ML'];
    const isCustom = skill.category && !standardCategories.includes(skill.category);
    setSkillForm({
      name: skill.name || '',
      category: isCustom ? 'Custom' : (skill.category || 'Frontend'),
      customCategory: isCustom ? skill.category : '',
      icon: skill.icon || '',
      imageUrl: skill.imageUrl || '',
      level: skill.level || 'Proficient',
      color: skill.color || '#38bdf8'
    });
    setIsSkillModalOpen(true);
  };

  const handleSaveSkill = async (e) => {
    e.preventDefault();
    if (!skillForm.name.trim()) return;
    const finalCategory = skillForm.category === 'Custom' 
      ? (skillForm.customCategory.trim() || 'Other') 
      : skillForm.category;

    const payload = {
      name: skillForm.name.trim(),
      category: finalCategory,
      icon: skillForm.icon.trim() || null,
      imageUrl: skillForm.imageUrl.trim() || null,
      level: skillForm.level || 'Proficient',
      color: skillForm.color || '#38bdf8'
    };

    if (editingSkillId) {
      await editSkill(editingSkillId, payload);
      triggerSaveNotification(`Updated "${payload.name}" skill!`);
    } else {
      await createSkill(payload);
      triggerSaveNotification(`Added "${payload.name}" to skills!`);
    }
    setIsSkillModalOpen(false);
  };

  const handleDeleteSkill = async (id, name) => {
    if (window.confirm(`Delete skill "${name}"? This will remove it from both the Sphere and Card grid.`)) {
      try {
        await removeSkill(id);
        triggerSaveNotification(`Deleted skill "${name}".`);
      } catch (err) {
        console.error('Delete skill error:', err);
        triggerSaveNotification(`Deleted skill "${name}" locally.`);
      }
    }
  };

  // ================= Project Handlers ================= //
  const handleOpenAddProject = () => {
    setEditingProjectId(null);
    setProjectForm({
      title: '',
      no: `0${projects.length + 1} / 2026 · Product`,
      tag: '',
      lede: '',
      award: '',
      chips: ['React', 'JavaScript'],
      linkText: 'Read the write-up',
      linkUrl: '',
      githubUrl: '',
      image: ''
    });
    setProjectChipInput('');
    setIsProjectModalOpen(true);
  };

  const handleOpenEditProject = (proj) => {
    setEditingProjectId(proj.id);
    setProjectForm({
      title: proj.title || '',
      no: proj.no || '',
      tag: proj.tag || '',
      lede: proj.lede || proj.description || '',
      award: proj.award || '',
      chips: Array.isArray(proj.chips) ? [...proj.chips] : [],
      linkText: proj.linkText || 'Read the write-up',
      linkUrl: proj.linkUrl || proj.Link || '',
      githubUrl: proj.githubUrl || proj.GithubLink || '',
      image: proj.image || ''
    });
    setProjectChipInput('');
    setIsProjectModalOpen(true);
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    if (!projectForm.title.trim()) return;
    try {
      if (editingProjectId) {
        await editProject(editingProjectId, projectForm);
        triggerSaveNotification(`Updated project "${projectForm.title}"`);
      } else {
        await createProject(projectForm);
        triggerSaveNotification(`Created new project "${projectForm.title}"`);
      }
    } catch (err) {
      console.warn('Project save warning:', err);
      triggerSaveNotification(`Saved project "${projectForm.title}" locally.`);
    }
    setIsProjectModalOpen(false);
  };

  const handleDeleteProject = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await removeProject(id);
        triggerSaveNotification(`Deleted project "${title}"`);
      } catch (err) {
        console.error('Delete project error:', err);
        triggerSaveNotification(`Deleted project "${title}" locally.`);
      }
    }
  };

  // ================= Experience Handlers ================= //
  const handleOpenAddExperience = () => {
    setEditingExpId(null);
    setExpForm({
      role: '',
      company: '',
      navMeta: 'Role · 2026',
      period: 'Jul 2026 – present',
      location: 'Remote',
      lede: '',
      points: [],
      chips: ['Python', 'FastAPI']
    });
    setExpPointInput('');
    setExpChipInput('');
    setIsExpModalOpen(true);
  };

  const handleOpenEditExperience = (exp) => {
    setEditingExpId(exp.id);
    setExpForm({
      role: exp.role || '',
      company: exp.company || '',
      navMeta: exp.navMeta || '',
      period: exp.period || '',
      location: exp.location || '',
      lede: exp.lede || '',
      points: Array.isArray(exp.points) ? [...exp.points] : [],
      chips: Array.isArray(exp.chips) ? [...exp.chips] : []
    });
    setExpPointInput('');
    setExpChipInput('');
    setIsExpModalOpen(true);
  };

  const handleSaveExperience = async (e) => {
    e.preventDefault();
    if (!expForm.role.trim() || !expForm.company.trim()) return;
    try {
      if (editingExpId) {
        await editExperience(editingExpId, expForm);
        triggerSaveNotification(`Updated experience at "${expForm.company}"`);
      } else {
        await createExperience(expForm);
        triggerSaveNotification(`Added experience at "${expForm.company}"`);
      }
    } catch (err) {
      console.warn('Experience save warning:', err);
      triggerSaveNotification(`Saved experience at "${expForm.company}" locally.`);
    }
    setIsExpModalOpen(false);
  };

  const handleDeleteExperience = async (id, company) => {
    if (window.confirm(`Are you sure you want to delete experience at "${company}"?`)) {
      try {
        await removeExperience(id);
        triggerSaveNotification(`Deleted experience at "${company}"`);
      } catch (err) {
        console.error('Delete experience error:', err);
        triggerSaveNotification(`Deleted experience at "${company}" locally.`);
      }
    }
  };

  // ================= Education Handlers ================= //
  const handleOpenAddEducation = () => {
    setEditingEduId(null);
    setEduForm({
      institution: '',
      degree: '',
      period: '2022 - 2026',
      score: 'CGPA 8.5',
      highlights: ''
    });
    setIsEduModalOpen(true);
  };

  const handleOpenEditEducation = (item) => {
    setEditingEduId(item.id);
    setEduForm({
      institution: item.institution || '',
      degree: item.degree || '',
      period: item.period || '',
      score: item.score || '',
      highlights: item.highlights || ''
    });
    setIsEduModalOpen(true);
  };

  const handleSaveEducation = async (e) => {
    e.preventDefault();
    if (!eduForm.institution.trim()) return;
    try {
      if (editingEduId) {
        await editEducation(editingEduId, eduForm);
        triggerSaveNotification('Education record updated!');
      } else {
        await createEducation(eduForm);
        triggerSaveNotification('New education record added!');
      }
    } catch (err) {
      console.warn('Education save warning:', err);
      triggerSaveNotification('Education record saved locally.');
    }
    setIsEduModalOpen(false);
  };

  const handleDeleteEducation = async (id, institution) => {
    if (window.confirm(`Delete education entry for "${institution}"?`)) {
      try {
        await removeEducation(id);
        triggerSaveNotification('Education record removed.');
      } catch (err) {
        console.error('Delete education error:', err);
        triggerSaveNotification('Education record removed locally.');
      }
    }
  };

  // ================= Awards Handlers ================= //
  const handleOpenAddAward = () => {
    setEditingAwardId(null);
    setAwardForm({ title: '', issuer: '', year: '2026', link: '' });
    setIsAwardModalOpen(true);
  };

  const handleOpenEditAward = (a) => {
    setEditingAwardId(a.id);
    setAwardForm({
      title: a.title || (typeof a === 'string' ? a : ''),
      issuer: a.issuer || '',
      year: a.year || '2026',
      link: a.link || ''
    });
    setIsAwardModalOpen(true);
  };

  const handleSaveAward = async (e) => {
    e.preventDefault();
    if (!awardForm.title.trim()) return;
    try {
      if (editingAwardId) {
        await editAward(editingAwardId, awardForm);
        triggerSaveNotification('Award entry updated!');
      } else {
        await createAward(awardForm);
        triggerSaveNotification('New award added!');
      }
    } catch (err) {
      console.warn('Award save warning:', err);
      triggerSaveNotification('Award entry saved locally.');
    }
    setIsAwardModalOpen(false);
  };

  const handleDeleteAward = async (id, title) => {
    if (window.confirm(`Delete award "${title}"?`)) {
      try {
        await removeAward(id);
        triggerSaveNotification('Award deleted.');
      } catch (err) {
        console.error('Delete award error:', err);
        triggerSaveNotification('Award deleted locally.');
      }
    }
  };

  // ================= Writings Handlers ================= //
  const handleOpenAddWriting = () => {
    setEditingWritingId(null);
    setWritingForm({ title: '', subtitle: '', meta: '6 min read · 2026', url: '' });
    setIsWritingModalOpen(true);
  };

  const handleOpenEditWriting = (w) => {
    setEditingWritingId(w.id);
    setWritingForm({
      title: w.title || '',
      subtitle: w.subtitle || '',
      meta: w.meta || '',
      url: w.url || ''
    });
    setIsWritingModalOpen(true);
  };

  const handleSaveWriting = async (e) => {
    e.preventDefault();
    if (!writingForm.title.trim()) return;
    try {
      if (editingWritingId) {
        await editWriting(editingWritingId, writingForm);
        triggerSaveNotification('Article updated!');
      } else {
        await createWriting(writingForm);
        triggerSaveNotification('Article publication added!');
      }
    } catch (err) {
      console.warn('Writing save warning:', err);
      triggerSaveNotification('Article publication saved locally.');
    }
    setIsWritingModalOpen(false);
  };

  const handleDeleteWriting = async (id, title) => {
    if (window.confirm(`Delete article "${title}"?`)) {
      try {
        await removeWriting(id);
        triggerSaveNotification('Article deleted.');
      } catch (err) {
        console.error('Delete writing error:', err);
        triggerSaveNotification('Article deleted locally.');
      }
    }
  };

  // ================= Firebase Config Handlers ================= //
  const handleSaveConfig = () => {
    try {
      const parsed = JSON.parse(rawConfig);
      saveFirebaseConfig(parsed);
      setConfigStatus('Config saved! Reloading...');
    } catch {
      setConfigStatus('Error: Invalid JSON format.');
    }
  };

  const handleClearConfig = () => {
    if (window.confirm('Reset to default project credentials?')) {
      clearFirebaseConfig();
    }
  };

  const handleSeedDatabase = async () => {
    if (window.confirm('Seed database with all default portfolio content (profile, projects, experiences, skills, education, awards, writings)?')) {
      setIsSeeding(true);
      try {
        const res = await populateWithDefaultData();
        setSeedResult(res);
        triggerSaveNotification('Database seeded with full portfolio data!');
      } catch (err) {
        alert('Seeding error: ' + err.message);
      } finally {
        setIsSeeding(false);
      }
    }
  };

  // Authentication check
  const isAuthenticated = Boolean(currentUser || bypassAuth);

  if (!isAuthenticated) {
    return (
      <div className="admin-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="admin-login-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Lock size={28} color="#fabd2f" />
            <h2 style={{ margin: 0 }}>Portfolio CMS Access</h2>
          </div>
          <p>
            Authorized admin credentials are required to modify the live portfolio in real time.
          </p>

          {authError && (
            <div style={{
              background: 'rgba(191, 97, 106, 0.2)',
              border: '1px solid #bf616a',
              color: '#eceff4',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '13px',
              marginBottom: '16px'
            }}>
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="admin-form-group">
              <label className="admin-label">Admin Email</label>
              <input
                type="email"
                className="admin-input"
                placeholder="vasanthKumar49480@gmail.com"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                required={isFirebaseConfigured}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Password</label>
              <input
                type="password"
                className="admin-input"
                placeholder="••••••••"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                required={isFirebaseConfigured}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
              {isFirebaseConfigured && (
                <>
                  <button type="submit" className="admin-btn admin-btn-primary" disabled={isLoggingIn} style={{ justifyContent: 'center' }}>
                    {isLoggingIn ? 'Signing in...' : 'Sign In with Email'}
                  </button>

                  <button
                    type="button"
                    className="admin-btn"
                    onClick={() => handleGitHubLogin(true)}
                    disabled={isLoggingIn}
                    style={{
                      justifyContent: 'center',
                      background: '#24292e',
                      color: '#ffffff',
                      border: '1px solid #444d56'
                    }}
                  >
                    <Github size={16} />
                    {isLoggingIn ? 'Redirecting to GitHub...' : 'Sign in with GitHub (Full Page Redirect)'}
                  </button>

                  <button
                    type="button"
                    className="admin-btn"
                    onClick={() => handleGitHubLogin(false)}
                    disabled={isLoggingIn}
                    style={{
                      justifyContent: 'center',
                      background: 'transparent',
                      color: '#8892b0',
                      border: '1px solid #2e3547',
                      fontSize: '12px'
                    }}
                  >
                    Try with Popup Window instead
                  </button>
                </>
              )}

              {typeof window !== 'undefined' && 
               (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && (
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={() => setBypassAuth(true)}
                  style={{ justifyContent: 'center' }}
                >
                  {isFirebaseConfigured ? 'Continue as Preview / Local Admin (Dev Only)' : 'Enter Admin Panel (Local / Preview Mode)'}
                </button>
              )}

              <button
                type="button"
                className="admin-btn"
                onClick={onReturnToPortfolio}
                style={{ justifyContent: 'center', background: 'transparent', color: '#8892b0' }}
              >
                ← Return to Portfolio
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-wrapper">
      <div className="admin-container">
        {/* Header */}
        <header className="admin-header">
          <div className="admin-title-wrap">
            <h1>
              <Sparkles size={24} color="#fabd2f" />
              Live Portfolio Content Manager
              <span className={`admin-badge ${currentUser ? 'connected' : 'offline'}`}>
                {currentUser ? 'Firebase Connected' : (isFirebaseConfigured ? 'Preview / Local Mode' : 'Local Preview')}
              </span>
            </h1>
            <div style={{ fontSize: '13px', color: '#8892b0' }}>
              Edit every detail of your live portfolio in real time without redeploying.
            </div>
          </div>

          <div className="admin-header-actions">
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={onReturnToPortfolio}
            >
              <ArrowLeft size={16} />
              View Live Portfolio
            </button>

            {currentUser && (
              <button
                type="button"
                className="admin-btn admin-btn-danger"
                onClick={() => logoutAdmin()}
                title="Log out"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            )}
          </div>
        </header>

        {/* Global Save Notification Toast */}
        {saveStatus && (
          <div style={{
            background: 'rgba(163, 190, 140, 0.2)',
            border: '1.5px solid #a3be8c',
            color: '#a3be8c',
            padding: '12px 18px',
            borderRadius: '8px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '14px',
            fontWeight: 600
          }}>
            <Check size={18} />
            {saveStatus}
          </div>
        )}

        {/* Tab Bar */}
        <nav className="admin-tabs">
          <button
            type="button"
            className={`admin-tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={15} style={{ marginRight: '6px', verticalAlign: '-2px' }} />
            Profile & Hero
          </button>

          <button
            type="button"
            className={`admin-tab ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            <FileText size={15} style={{ marginRight: '6px', verticalAlign: '-2px' }} />
            About Me
          </button>

          <button
            type="button"
            className={`admin-tab ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            <Layers size={15} style={{ marginRight: '6px', verticalAlign: '-2px' }} />
            Projects ({projects.length})
          </button>

          <button
            type="button"
            className={`admin-tab ${activeTab === 'experiences' ? 'active' : ''}`}
            onClick={() => setActiveTab('experiences')}
          >
            <Briefcase size={15} style={{ marginRight: '6px', verticalAlign: '-2px' }} />
            Experiences ({experiences.length})
          </button>

          <button
            type="button"
            className={`admin-tab ${activeTab === 'education' ? 'active' : ''}`}
            onClick={() => setActiveTab('education')}
          >
            <GraduationCap size={15} style={{ marginRight: '6px', verticalAlign: '-2px' }} />
            Education ({education.length})
          </button>

          <button
            type="button"
            className={`admin-tab ${activeTab === 'skills' ? 'active' : ''}`}
            onClick={() => setActiveTab('skills')}
          >
            <Cpu size={15} style={{ marginRight: '6px', verticalAlign: '-2px' }} />
            Skills & Toolbox ({skills.length})
          </button>

          <button
            type="button"
            className={`admin-tab ${activeTab === 'awards' ? 'active' : ''}`}
            onClick={() => setActiveTab('awards')}
          >
            <Award size={15} style={{ marginRight: '6px', verticalAlign: '-2px' }} />
            Awards & Honors ({awards.length})
          </button>

          <button
            type="button"
            className={`admin-tab ${activeTab === 'writings' ? 'active' : ''}`}
            onClick={() => setActiveTab('writings')}
          >
            <BookOpen size={15} style={{ marginRight: '6px', verticalAlign: '-2px' }} />
            Writings ({writings.length})
          </button>

          <button
            type="button"
            className={`admin-tab ${activeTab === 'contact' ? 'active' : ''}`}
            onClick={() => setActiveTab('contact')}
          >
            <Share2 size={15} style={{ marginRight: '6px', verticalAlign: '-2px' }} />
            Contact & Socials
          </button>

          <button
            type="button"
            className={`admin-tab ${activeTab === 'firebase' ? 'active' : ''}`}
            onClick={() => setActiveTab('firebase')}
          >
            <Settings size={15} style={{ marginRight: '6px', verticalAlign: '-2px' }} />
            Firebase Setup & Seed
          </button>
        </nav>

        {/* ================= TAB 1: PROFILE & HERO ================= */}
        {activeTab === 'profile' && (
          <div className="admin-form-section">
            <h3><User size={18} color="#fabd2f" /> Personal Information & Hero Section</h3>
            <p>Customize your identity, typewriter titles, availability status, and resume links.</p>

            <form onSubmit={handleSaveProfile}>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-label">Full Name</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={profileForm.name || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Initials Badge (Navbar & Icon)</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={profileForm.initials || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, initials: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Location</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={profileForm.location || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-label">Live Availability Status Pill</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={profileForm.status || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, status: e.target.value })}
                    placeholder="Actively Seeking Job Opportunities"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Resume Download Link (PDF)</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={profileForm.resumeUrl || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, resumeUrl: e.target.value })}
                    placeholder="/Vasanth_Resume.pdf or https://drive.google.com/..."
                  />
                </div>
              </div>

              {/* Typewriter Titles */}
              <div className="admin-form-group">
                <label className="admin-label">Rotating Typewriter Titles</label>
                <div className="admin-chip-builder">
                  {(profileForm.roles || []).map((r, i) => (
                    <span key={i} className="admin-tag-removable">
                      {r}
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...profileForm.roles];
                          updated.splice(i, 1);
                          setProfileForm({ ...profileForm, roles: updated });
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    placeholder="Type title (e.g. AI Engineer) & press Enter"
                    value={roleInput}
                    onChange={(e) => setRoleInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (roleInput.trim()) {
                          setProfileForm({
                            ...profileForm,
                            roles: [...(profileForm.roles || []), roleInput.trim()]
                          });
                          setRoleInput('');
                        }
                      }
                    }}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Classic Portfolio Lead Text</label>
                <textarea
                  className="admin-textarea"
                  rows={3}
                  value={profileForm.leadText || ''}
                  onChange={(e) => setProfileForm({ ...profileForm, leadText: e.target.value })}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Showcase / Interactive Page Hero Headline</label>
                <textarea
                  className="admin-textarea"
                  rows={3}
                  value={profileForm.showcaseHeadline || ''}
                  onChange={(e) => setProfileForm({ ...profileForm, showcaseHeadline: e.target.value })}
                />
              </div>

              <button type="submit" className="admin-btn admin-btn-primary">
                <Save size={16} />
                Save Profile Changes
              </button>
            </form>
          </div>
        )}

        {/* ================= TAB 2: ABOUT ME ================= */}
        {activeTab === 'about' && (
          <div className="admin-form-section">
            <h3><FileText size={18} color="#fabd2f" /> About Me & Biography</h3>
            <p>Edit your personal narrative, showcase stories, and flip card introduction.</p>

            <form onSubmit={handleSaveAbout}>
              <div className="admin-form-group">
                <label className="admin-label">Classic Portfolio Description</label>
                <textarea
                  className="admin-textarea"
                  rows={4}
                  value={aboutForm.classicAbout || ''}
                  onChange={(e) => setAboutForm({ ...aboutForm, classicAbout: e.target.value })}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Showcase Big Headline / Pitch Lede</label>
                <textarea
                  className="admin-textarea"
                  rows={3}
                  value={aboutForm.aboutBio || ''}
                  onChange={(e) => setAboutForm({ ...aboutForm, aboutBio: e.target.value })}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Showcase Story Paragraphs</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px' }}>
                  {(aboutForm.aboutParas || []).map((p, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <textarea
                        className="admin-textarea"
                        style={{ minHeight: '60px' }}
                        value={p}
                        onChange={(e) => {
                          const updated = [...aboutForm.aboutParas];
                          updated[idx] = e.target.value;
                          setAboutForm({ ...aboutForm, aboutParas: updated });
                        }}
                      />
                      <button
                        type="button"
                        className="admin-card-btn-danger"
                        onClick={() => {
                          const updated = [...aboutForm.aboutParas];
                          updated.splice(idx, 1);
                          setAboutForm({ ...aboutForm, aboutParas: updated });
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="Add a new story paragraph..."
                    value={paraInput}
                    onChange={(e) => setParaInput(e.target.value)}
                  />
                  <button
                    type="button"
                    className="admin-btn admin-btn-secondary"
                    onClick={() => {
                      if (paraInput.trim()) {
                        setAboutForm({
                          ...aboutForm,
                          aboutParas: [...(aboutForm.aboutParas || []), paraInput.trim()]
                        });
                        setParaInput('');
                      }
                    }}
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-label">3D Flip Card Title</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={aboutForm.flipCardTitle || ''}
                    onChange={(e) => setAboutForm({ ...aboutForm, flipCardTitle: e.target.value })}
                    placeholder="Vasanth S ⚡"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">3D Flip Card Back Summary</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={aboutForm.flipCardBack || ''}
                    onChange={(e) => setAboutForm({ ...aboutForm, flipCardBack: e.target.value })}
                  />
                </div>
              </div>

              <button type="submit" className="admin-btn admin-btn-primary">
                <Save size={16} />
                Save About Details
              </button>
            </form>
          </div>
        )}

        {/* ================= TAB 3: PROJECTS ================= */}
        {activeTab === 'projects' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px' }}>Active Projects</h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#8892b0' }}>
                  Projects created or updated here appear automatically in both pages.
                </p>
              </div>
              <button
                type="button"
                className="admin-btn admin-btn-primary"
                onClick={handleOpenAddProject}
              >
                <Plus size={16} />
                Add New Project
              </button>
            </div>

            <div className="admin-grid">
              {projects.map((proj, idx) => (
                <div key={proj.id || idx} className="admin-card">
                  <div>
                    <div className="admin-card-head">
                      <div>
                        <h4 className="admin-card-title">{proj.title}</h4>
                        <div className="admin-card-meta">{proj.no || 'Product'} · {proj.tag}</div>
                      </div>
                    </div>

                    <p className="admin-card-body">
                      {proj.lede || proj.description}
                    </p>

                    {proj.award && (
                      <div style={{ fontSize: '11px', color: '#fabd2f', marginBottom: '10px', fontWeight: '600' }}>
                        {proj.award}
                      </div>
                    )}

                    <div className="admin-card-chips">
                      {(proj.chips || []).map((c, i) => (
                        <span key={i} className="admin-card-chip">{c}</span>
                      ))}
                    </div>
                  </div>

                  <div className="admin-card-actions">
                    <button
                      type="button"
                      className="admin-card-btn admin-card-btn-edit"
                      onClick={() => handleOpenEditProject(proj)}
                    >
                      <Edit3 size={14} />
                      Edit
                    </button>
                    <button
                      type="button"
                      className="admin-card-btn admin-card-btn-danger"
                      onClick={() => handleDeleteProject(proj.id, proj.title)}
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 4: EXPERIENCES ================= */}
        {activeTab === 'experiences' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px' }}>Work Experience</h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#8892b0' }}>
                  Manage internships, roles, and employment history with bullet points.
                </p>
              </div>
              <button
                type="button"
                className="admin-btn admin-btn-primary"
                onClick={handleOpenAddExperience}
              >
                <Plus size={16} />
                Add Experience
              </button>
            </div>

            <div className="admin-grid">
              {experiences.map((exp, idx) => (
                <div key={exp.id || idx} className="admin-card">
                  <div>
                    <div className="admin-card-head">
                      <div>
                        <h4 className="admin-card-title">{exp.company}</h4>
                        <div className="admin-card-meta">{exp.role} · {exp.period}</div>
                      </div>
                    </div>

                    <div style={{ fontSize: '12px', color: '#9aa5b8', marginBottom: '12px', fontStyle: 'italic' }}>
                      {exp.location}
                    </div>

                    <p className="admin-card-body">
                      {exp.lede}
                    </p>

                    <div className="admin-card-chips">
                      {(exp.chips || []).map((c, i) => (
                        <span key={i} className="admin-card-chip">{c}</span>
                      ))}
                    </div>
                  </div>

                  <div className="admin-card-actions">
                    <button
                      type="button"
                      className="admin-card-btn admin-card-btn-edit"
                      onClick={() => handleOpenEditExperience(exp)}
                    >
                      <Edit3 size={14} />
                      Edit
                    </button>
                    <button
                      type="button"
                      className="admin-card-btn admin-card-btn-danger"
                      onClick={() => handleDeleteExperience(exp.id, exp.company)}
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 5: EDUCATION ================= */}
        {activeTab === 'education' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px' }}>Education & Qualifications</h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#8892b0' }}>
                  Universities, degrees, diplomas, grades, and periods.
                </p>
              </div>
              <button
                type="button"
                className="admin-btn admin-btn-primary"
                onClick={handleOpenAddEducation}
              >
                <Plus size={16} />
                Add Education
              </button>
            </div>

            <div className="admin-grid">
              {education.map((item, idx) => (
                <div key={item.id || idx} className="admin-card">
                  <div>
                    <h4 className="admin-card-title">{item.institution}</h4>
                    <div className="admin-card-meta" style={{ color: '#fabd2f' }}>{item.degree}</div>
                    <div style={{ fontSize: '12px', color: '#8892b0', margin: '6px 0 12px 0' }}>
                      {item.period} · {item.score}
                    </div>
                    {item.highlights && (
                      <p className="admin-card-body">{item.highlights}</p>
                    )}
                  </div>

                  <div className="admin-card-actions">
                    <button
                      type="button"
                      className="admin-card-btn admin-card-btn-edit"
                      onClick={() => handleOpenEditEducation(item)}
                    >
                      <Edit3 size={14} />
                      Edit
                    </button>
                    <button
                      type="button"
                      className="admin-card-btn admin-card-btn-danger"
                      onClick={() => handleDeleteEducation(item.id, item.institution)}
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 6: SKILLS & TOOLBOX ================= */}
        {activeTab === 'skills' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Cpu size={20} color="#fabd2f" /> Technical Skills & Toolbox
                </h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#8892b0' }}>
                  Manage your technical skills displayed dynamically on the 3D Interactive Sphere and Classic Card Grid.
                </p>
              </div>
              <button
                type="button"
                className="admin-btn admin-btn-primary"
                onClick={handleOpenAddSkill}
              >
                <Plus size={16} />
                Add New Skill
              </button>
            </div>

            {/* Category Filter Pills */}
            <div className="admin-filter-bar">
              {availableCategories.map((cat) => {
                const count = cat === 'All' 
                  ? skills.length 
                  : skills.filter(s => (s.category || '').toLowerCase() === cat.toLowerCase()).length;
                return (
                  <button
                    key={cat}
                    type="button"
                    className={`admin-filter-pill ${skillCategoryFilter === cat ? 'active' : ''}`}
                    onClick={() => setSkillCategoryFilter(cat)}
                  >
                    {cat} ({count})
                  </button>
                );
              })}
            </div>

            {/* Skills Card Grid */}
            {filteredSkills.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 20px', background: '#121212', borderRadius: '12px', border: '1px dashed #282828', color: '#888' }}>
                <Cpu size={32} style={{ opacity: 0.4, marginBottom: '8px' }} />
                <p style={{ margin: 0 }}>No skills found in category "{skillCategoryFilter}".</p>
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  style={{ marginTop: '12px' }}
                  onClick={handleOpenAddSkill}
                >
                  <Plus size={14} /> Add Skill to this category
                </button>
              </div>
            ) : (
              <div className="admin-skills-grid">
                {filteredSkills.map((s) => (
                  <div key={s.id} className="admin-card admin-skill-card">
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                        <div
                          className="admin-skill-icon-wrap"
                          style={{ borderColor: s.color ? `${s.color}50` : '#2e2e2e' }}
                        >
                          <SkillIcon icon={s.icon} imageUrl={s.imageUrl} size={28} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h4 className="admin-card-title" style={{ fontSize: '15px' }}>
                            {s.name}
                          </h4>
                          <div style={{ display: 'flex', gap: '6px', marginTop: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                            <span className="admin-card-chip" style={{ fontSize: '10px', padding: '2px 7px' }}>
                              {s.category || 'General'}
                            </span>
                            <span className="admin-skill-level-badge" data-level={s.level || 'Proficient'}>
                              {s.level || 'Proficient'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="admin-card-actions" style={{ marginTop: 'auto', paddingTop: '12px' }}>
                      <button
                        type="button"
                        className="admin-card-btn admin-card-btn-edit"
                        onClick={() => handleOpenEditSkill(s)}
                      >
                        <Edit3 size={13} />
                        Edit
                      </button>
                      <button
                        type="button"
                        className="admin-card-btn admin-card-btn-danger"
                        onClick={() => handleDeleteSkill(s.id, s.name)}
                      >
                        <Trash2 size={13} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 7: AWARDS ================= */}
        {activeTab === 'awards' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px' }}>Awards & Hackathon Honors</h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#8892b0' }}>
                  Showcase competition wins and accolades.
                </p>
              </div>
              <button
                type="button"
                className="admin-btn admin-btn-primary"
                onClick={handleOpenAddAward}
              >
                <Plus size={16} />
                Add Award
              </button>
            </div>

            <div className="admin-grid">
              {awards.map((a, idx) => {
                const title = typeof a === 'string' ? a : a.title;
                const issuer = typeof a === 'object' ? a.issuer : '';
                const year = typeof a === 'object' ? a.year : '';
                return (
                  <div key={a.id || idx} className="admin-card">
                    <div>
                      <h4 className="admin-card-title">{title}</h4>
                      {(issuer || year) && (
                        <div className="admin-card-meta">{issuer} {year ? `· ${year}` : ''}</div>
                      )}
                    </div>

                    <div className="admin-card-actions" style={{ marginTop: '16px' }}>
                      <button
                        type="button"
                        className="admin-card-btn admin-card-btn-edit"
                        onClick={() => handleOpenEditAward(a)}
                      >
                        <Edit3 size={14} />
                        Edit
                      </button>
                      <button
                        type="button"
                        className="admin-card-btn admin-card-btn-danger"
                        onClick={() => handleDeleteAward(a.id, title)}
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= TAB 8: WRITINGS ================= */}
        {activeTab === 'writings' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px' }}>Articles & Publications</h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#8892b0' }}>
                  Articles published on Medium, Dev.to, or external journals.
                </p>
              </div>
              <button
                type="button"
                className="admin-btn admin-btn-primary"
                onClick={handleOpenAddWriting}
              >
                <Plus size={16} />
                Add Article
              </button>
            </div>

            <div className="admin-grid">
              {writings.map((w, idx) => (
                <div key={w.id || idx} className="admin-card">
                  <div>
                    <h4 className="admin-card-title">{w.title}</h4>
                    {w.subtitle && (
                      <p style={{ fontSize: '13px', color: '#b0b8c6', margin: '4px 0 8px 0' }}>{w.subtitle}</p>
                    )}
                    <div className="admin-card-meta">{w.meta}</div>
                  </div>

                  <div className="admin-card-actions">
                    <button
                      type="button"
                      className="admin-card-btn admin-card-btn-edit"
                      onClick={() => handleOpenEditWriting(w)}
                    >
                      <Edit3 size={14} />
                      Edit
                    </button>
                    <button
                      type="button"
                      className="admin-card-btn admin-card-btn-danger"
                      onClick={() => handleDeleteWriting(w.id, w.title)}
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 9: CONTACT & SOCIALS ================= */}
        {activeTab === 'contact' && (
          <div className="admin-form-section">
            <h3><Share2 size={18} color="#fabd2f" /> Contact Info & Social Links</h3>
            <p>Update your email, WhatsApp, social networks, and EmailJS form keys.</p>

            <form onSubmit={handleSaveSocials}>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-label">Email Address</label>
                  <input
                    type="email"
                    className="admin-input"
                    value={socialsForm.email || ''}
                    onChange={(e) => setSocialsForm({ ...socialsForm, email: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">WhatsApp Link / Number</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={socialsForm.whatsapp || ''}
                    onChange={(e) => setSocialsForm({ ...socialsForm, whatsapp: e.target.value })}
                    placeholder="https://wa.me/9600245586"
                  />
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-label">GitHub Profile URL</label>
                  <input
                    type="url"
                    className="admin-input"
                    value={socialsForm.github || ''}
                    onChange={(e) => setSocialsForm({ ...socialsForm, github: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">LinkedIn Profile URL</label>
                  <input
                    type="url"
                    className="admin-input"
                    value={socialsForm.linkedin || ''}
                    onChange={(e) => setSocialsForm({ ...socialsForm, linkedin: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-label">Instagram Profile URL</label>
                  <input
                    type="url"
                    className="admin-input"
                    value={socialsForm.instagram || ''}
                    onChange={(e) => setSocialsForm({ ...socialsForm, instagram: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Twitter / X Profile URL</label>
                  <input
                    type="url"
                    className="admin-input"
                    value={socialsForm.twitter || ''}
                    onChange={(e) => setSocialsForm({ ...socialsForm, twitter: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ marginTop: '24px', borderTop: '1px solid #232834', paddingTop: '20px' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '15px' }}>EmailJS Form Credentials</h4>
                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label className="admin-label">EmailJS Service ID</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={socialsForm.emailjsServiceId || ''}
                      onChange={(e) => setSocialsForm({ ...socialsForm, emailjsServiceId: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">EmailJS Template ID</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={socialsForm.emailjsTemplateId || ''}
                      onChange={(e) => setSocialsForm({ ...socialsForm, emailjsTemplateId: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">EmailJS Public Key</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={socialsForm.emailjsPublicKey || ''}
                      onChange={(e) => setSocialsForm({ ...socialsForm, emailjsPublicKey: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <button type="submit" className="admin-btn admin-btn-primary">
                <Save size={16} />
                Save Contact & Social Details
              </button>
            </form>
          </div>
        )}

        {/* ================= TAB 10: FIREBASE CONFIG & SEED ================= */}
        {activeTab === 'firebase' && (
          <div className="admin-form-section">
            <h3><Database size={18} color="#fabd2f" /> Firebase Database Configuration</h3>
            <p>
              Your portfolio is hooked into Firebase Firestore for real-time live synchronization.
            </p>

            <div style={{ marginBottom: '24px' }}>
              <label className="admin-label">Live JSON Configuration</label>
              <textarea
                className="admin-textarea"
                rows={10}
                style={{ fontFamily: 'monospace', fontSize: '12px' }}
                value={rawConfig}
                onChange={(e) => setRawConfig(e.target.value)}
              />

              {configStatus && (
                <div style={{ fontSize: '13px', color: '#fabd2f', marginTop: '8px' }}>
                  {configStatus}
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                <button
                  type="button"
                  className="admin-btn admin-btn-primary"
                  onClick={handleSaveConfig}
                >
                  <Save size={16} />
                  Save Configuration
                </button>

                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={handleClearConfig}
                >
                  Reset Defaults
                </button>
              </div>
            </div>

            {/* Complete Data Seed Helper */}
            <div style={{
              background: '#151821',
              border: '1px solid #2e3547',
              borderRadius: '10px',
              padding: '20px'
            }}>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', color: '#fabd2f' }}>
                One-Click Complete Portfolio Seed
              </h4>
              <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#8892b0' }}>
                Populates your live Firebase Firestore with all default profile data, projects, experiences, skills, education, awards, writings, and social links.
              </p>

              <button
                type="button"
                className="admin-btn admin-btn-primary"
                onClick={handleSeedDatabase}
                disabled={isSeeding}
              >
                <RefreshCw size={16} className={isSeeding ? 'spin' : ''} />
                {isSeeding ? 'Seeding Database...' : 'Seed Entire Portfolio to Firebase'}
              </button>

              {seedResult && (
                <div style={{
                  background: 'rgba(163, 190, 140, 0.15)',
                  border: '1px solid #a3be8c',
                  color: '#a3be8c',
                  padding: '12px',
                  borderRadius: '6px',
                  marginTop: '16px',
                  fontSize: '13px'
                }}>
                  ✅ Successfully seeded: Profile, Socials, Skills, {seedResult.projectsAdded} Projects, {seedResult.experiencesAdded} Experiences, {seedResult.educationAdded} Education items, {seedResult.awardsAdded} Awards, and {seedResult.writingsAdded} Articles!
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ================= MODAL: PROJECT ================= */}
      {isProjectModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setIsProjectModalOpen(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{editingProjectId ? 'Edit Project' : 'Add New Project'}</h3>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setIsProjectModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProject}>
              <div className="admin-modal-body">
                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label className="admin-label">Project Title</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={projectForm.title}
                      onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Index / Category Meta</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={projectForm.no}
                      onChange={(e) => setProjectForm({ ...projectForm, no: e.target.value })}
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Tagline (One-line hook)</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={projectForm.tag}
                    onChange={(e) => setProjectForm({ ...projectForm, tag: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Description / Lede</label>
                  <textarea
                    className="admin-textarea"
                    rows={3}
                    value={projectForm.lede}
                    onChange={(e) => setProjectForm({ ...projectForm, lede: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Award / Badge (Optional)</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={projectForm.award}
                    onChange={(e) => setProjectForm({ ...projectForm, award: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Tech Stack Tags</label>
                  <div className="admin-chip-builder">
                    {projectForm.chips.map((chip, idx) => (
                      <span key={idx} className="admin-tag-removable">
                        {chip}
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...projectForm.chips];
                            updated.splice(idx, 1);
                            setProjectForm({ ...projectForm, chips: updated });
                          }}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      placeholder="Type tag & press Enter"
                      value={projectChipInput}
                      onChange={(e) => setProjectChipInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (projectChipInput.trim()) {
                            setProjectForm({
                              ...projectForm,
                              chips: [...projectForm.chips, projectChipInput.trim()]
                            });
                            setProjectChipInput('');
                          }
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label className="admin-label">Live Demo / Write-up URL</label>
                    <input
                      type="url"
                      className="admin-input"
                      value={projectForm.linkUrl}
                      onChange={(e) => setProjectForm({ ...projectForm, linkUrl: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">GitHub Repository URL</label>
                    <input
                      type="url"
                      className="admin-input"
                      value={projectForm.githubUrl}
                      onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Project Preview Image URL (Optional)</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="https://... or /assets/..."
                    value={projectForm.image}
                    onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={() => setIsProjectModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  {editingProjectId ? 'Update Project' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: EXPERIENCE ================= */}
      {isExpModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setIsExpModalOpen(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{editingExpId ? 'Edit Experience' : 'Add Experience'}</h3>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setIsExpModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveExperience}>
              <div className="admin-modal-body">
                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label className="admin-label">Role / Job Title</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={expForm.role}
                      onChange={(e) => setExpForm({ ...expForm, role: e.target.value })}
                      required
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Company / Organization</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={expForm.company}
                      onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label className="admin-label">Period / Dates</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={expForm.period}
                      onChange={(e) => setExpForm({ ...expForm, period: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Location (e.g. Remote, Bangalore)</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={expForm.location}
                      onChange={(e) => setExpForm({ ...expForm, location: e.target.value })}
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Overview / Summary Lede</label>
                  <textarea
                    className="admin-textarea"
                    rows={2}
                    value={expForm.lede}
                    onChange={(e) => setExpForm({ ...expForm, lede: e.target.value })}
                  />
                </div>

                {/* Bullet Points */}
                <div className="admin-form-group">
                  <label className="admin-label">Key Highlights / Bullets (HTML allowed: &lt;b&gt;bold&lt;/b&gt;)</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '8px' }}>
                    {expForm.points.map((pt, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{ color: '#fabd2f' }}>•</span>
                        <input
                          type="text"
                          className="admin-input"
                          value={pt}
                          onChange={(e) => {
                            const updated = [...expForm.points];
                            updated[idx] = e.target.value;
                            setExpForm({ ...expForm, points: updated });
                          }}
                        />
                        <button
                          type="button"
                          className="admin-card-btn-danger"
                          onClick={() => {
                            const updated = [...expForm.points];
                            updated.splice(idx, 1);
                            setExpForm({ ...expForm, points: updated });
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="Add highlight point..."
                      value={expPointInput}
                      onChange={(e) => setExpPointInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (expPointInput.trim()) {
                            setExpForm({
                              ...expForm,
                              points: [...expForm.points, expPointInput.trim()]
                            });
                            setExpPointInput('');
                          }
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="admin-btn admin-btn-secondary"
                      onClick={() => {
                        if (expPointInput.trim()) {
                          setExpForm({
                            ...expForm,
                            points: [...expForm.points, expPointInput.trim()]
                          });
                          setExpPointInput('');
                        }
                      }}
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Technologies Used</label>
                  <div className="admin-chip-builder">
                    {expForm.chips.map((chip, idx) => (
                      <span key={idx} className="admin-tag-removable">
                        {chip}
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...expForm.chips];
                            updated.splice(idx, 1);
                            setExpForm({ ...expForm, chips: updated });
                          }}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      placeholder="Type tech & press Enter"
                      value={expChipInput}
                      onChange={(e) => setExpChipInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (expChipInput.trim()) {
                            setExpForm({
                              ...expForm,
                              chips: [...expForm.chips, expChipInput.trim()]
                            });
                            setExpChipInput('');
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={() => setIsExpModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  {editingExpId ? 'Update Experience' : 'Create Experience'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDUCATION ================= */}
      {isEduModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setIsEduModalOpen(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{editingEduId ? 'Edit Education' : 'Add Education Record'}</h3>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setIsEduModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEducation}>
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label className="admin-label">Institution / University</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={eduForm.institution}
                    onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Degree / Field of Study</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={eduForm.degree}
                    onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label className="admin-label">Period (e.g. 2020 – 2024)</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={eduForm.period}
                      onChange={(e) => setEduForm({ ...eduForm, period: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Score / CGPA</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={eduForm.score}
                      onChange={(e) => setEduForm({ ...eduForm, score: e.target.value })}
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Highlights / Focus Areas</label>
                  <textarea
                    className="admin-textarea"
                    rows={2}
                    value={eduForm.highlights}
                    onChange={(e) => setEduForm({ ...eduForm, highlights: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={() => setIsEduModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  {editingEduId ? 'Update Record' : 'Add Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: AWARDS ================= */}
      {isAwardModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setIsAwardModalOpen(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{editingAwardId ? 'Edit Award' : 'Add Award / Honor'}</h3>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setIsAwardModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveAward}>
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label className="admin-label">Award Title</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={awardForm.title}
                    onChange={(e) => setAwardForm({ ...awardForm, title: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label className="admin-label">Issuer / Event</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={awardForm.issuer}
                      onChange={(e) => setAwardForm({ ...awardForm, issuer: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Year</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={awardForm.year}
                      onChange={(e) => setAwardForm({ ...awardForm, year: e.target.value })}
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Link (Optional)</label>
                  <input
                    type="url"
                    className="admin-input"
                    value={awardForm.link}
                    onChange={(e) => setAwardForm({ ...awardForm, link: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={() => setIsAwardModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  {editingAwardId ? 'Update Award' : 'Add Award'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: WRITINGS ================= */}
      {isWritingModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setIsWritingModalOpen(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{editingWritingId ? 'Edit Article' : 'Add Article'}</h3>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setIsWritingModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveWriting}>
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label className="admin-label">Article Title</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={writingForm.title}
                    onChange={(e) => setWritingForm({ ...writingForm, title: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Subtitle / Excerpt</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={writingForm.subtitle}
                    onChange={(e) => setWritingForm({ ...writingForm, subtitle: e.target.value })}
                  />
                </div>

                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label className="admin-label">Read Time & Meta</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={writingForm.meta}
                      onChange={(e) => setWritingForm({ ...writingForm, meta: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Article URL</label>
                    <input
                      type="url"
                      className="admin-input"
                      value={writingForm.url}
                      onChange={(e) => setWritingForm({ ...writingForm, url: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={() => setIsWritingModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  {editingWritingId ? 'Update Article' : 'Add Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: SKILLS ================= */}
      {isSkillModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setIsSkillModalOpen(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{editingSkillId ? 'Edit Skill' : 'Add New Skill'}</h3>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setIsSkillModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveSkill}>
              <div className="admin-modal-body">
                {/* Live Icon & Card Preview */}
                <div className="admin-skill-preview-box">
                  <div
                    className="admin-skill-icon-wrap"
                    style={{
                      width: '48px',
                      height: '48px',
                      borderColor: skillForm.color ? `${skillForm.color}60` : '#333'
                    }}
                  >
                    <SkillIcon icon={skillForm.icon} imageUrl={skillForm.imageUrl} size={30} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '16px', color: '#fff' }}>
                      {skillForm.name || 'Skill Name'}
                    </div>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <span className="admin-card-chip" style={{ fontSize: '10px' }}>
                        {skillForm.category === 'Custom' ? (skillForm.customCategory || 'Custom') : skillForm.category}
                      </span>
                      <span className="admin-skill-level-badge" data-level={skillForm.level}>
                        {skillForm.level}
                      </span>
                      {skillForm.color && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: '#999' }}>
                          <span
                            style={{
                              width: '10px',
                              height: '10px',
                              borderRadius: '50%',
                              background: skillForm.color,
                              display: 'inline-block'
                            }}
                          />
                          {skillForm.color}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Skill Name *</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={skillForm.name}
                    onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                    placeholder="e.g. React, Docker, PyTorch"
                    required
                  />
                </div>

                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label className="admin-label">Category</label>
                    <select
                      className="admin-input"
                      value={skillForm.category}
                      onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}
                    >
                      <option value="Frontend">Frontend</option>
                      <option value="Backend">Backend</option>
                      <option value="Languages">Languages</option>
                      <option value="Databases">Databases</option>
                      <option value="Cloud & DevOps">Cloud & DevOps</option>
                      <option value="Tools">Tools</option>
                      <option value="AI / ML">AI / ML</option>
                      <option value="Custom">+ Custom Category...</option>
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Proficiency Level</label>
                    <select
                      className="admin-input"
                      value={skillForm.level}
                      onChange={(e) => setSkillForm({ ...skillForm, level: e.target.value })}
                    >
                      <option value="Expert">Expert (3★)</option>
                      <option value="Proficient">Proficient (2★)</option>
                      <option value="Familiar">Familiar (1★)</option>
                    </select>
                  </div>
                </div>

                {skillForm.category === 'Custom' && (
                  <div className="admin-form-group">
                    <label className="admin-label">Custom Category Name *</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={skillForm.customCategory}
                      onChange={(e) => setSkillForm({ ...skillForm, customCategory: e.target.value })}
                      placeholder="e.g. Mobile, Systems, Security"
                      required={skillForm.category === 'Custom'}
                    />
                  </div>
                )}

                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label className="admin-label">Built-in Icon</label>
                    <select
                      className="admin-input"
                      value={skillForm.icon}
                      onChange={(e) => setSkillForm({ ...skillForm, icon: e.target.value })}
                    >
                      <option value="">(None / Custom URL)</option>
                      {BUILT_IN_ICON_KEYS.map((opt) => (
                        <option key={opt.key} value={opt.key}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Brand / Accent Color</label>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input
                        type="color"
                        value={skillForm.color || '#38bdf8'}
                        onChange={(e) => setSkillForm({ ...skillForm, color: e.target.value })}
                        style={{
                          width: '42px',
                          height: '40px',
                          padding: 0,
                          border: 'none',
                          background: 'transparent',
                          cursor: 'pointer',
                          borderRadius: '6px'
                        }}
                      />
                      <input
                        type="text"
                        className="admin-input"
                        value={skillForm.color}
                        onChange={(e) => setSkillForm({ ...skillForm, color: e.target.value })}
                        placeholder="#38bdf8"
                      />
                    </div>
                  </div>
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Custom Image URL (Optional)</label>
                  <input
                    type="url"
                    className="admin-input"
                    value={skillForm.imageUrl}
                    onChange={(e) => setSkillForm({ ...skillForm, imageUrl: e.target.value })}
                    placeholder="https://cdn.example.com/logo.svg"
                  />
                  <small style={{ color: '#888', display: 'block', marginTop: '4px' }}>
                    Overrides the built-in icon with an external SVG or PNG logo image URL.
                  </small>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={() => setIsSkillModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  {editingSkillId ? 'Update Skill' : 'Add Skill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
