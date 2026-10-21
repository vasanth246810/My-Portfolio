import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  PROJECTS as DEFAULT_PROJECTS, 
  EXPERIENCES as DEFAULT_EXPERIENCES,
  DEFAULT_SKILL_ITEMS,
  groupSkillsByCategory,
  EDUCATION as DEFAULT_EDUCATION,
  AWARDS as DEFAULT_AWARDS,
  WRITINGS as DEFAULT_WRITINGS,
  DEFAULT_PROFILE,
  DEFAULT_SOCIALS
} from '../component/VasanthPage/vasanthData';
import {
  isFirebaseConfigured,
  subscribeToLiveProjects,
  subscribeToLiveExperiences,
  addProjectToDB,
  updateProjectInDB,
  deleteProjectFromDB,
  addExperienceToDB,
  updateExperienceInDB,
  deleteExperienceFromDB,
  subscribeToLiveProfile,
  saveProfileToDB,
  subscribeToLiveSocials,
  saveSocialsToDB,
  subscribeToLiveEducation,
  addEducationToDB,
  updateEducationInDB,
  deleteEducationFromDB,
  subscribeToLiveSkills,
  saveSkillsToDB,
  subscribeToLiveAwards,
  addAwardToDB,
  updateAwardInDB,
  deleteAwardFromDB,
  subscribeToLiveWritings,
  addWritingToDB,
  updateWritingInDB,
  deleteWritingFromDB,
  seedDatabase,
  subscribeToAuthChanges,
  loginAdminUser,
  loginWithGitHub,
  logoutAdminUser,
  isUserAuthorizedAdmin,
  checkRedirectResult
} from '../services/firebase';

const PortfolioDataContext = createContext(null);

function normalizeSkillsData(raw) {
  if (!raw || !Array.isArray(raw)) return DEFAULT_SKILL_ITEMS;
  // If array of categories: [{ category: 'LANGUAGES', skills: [...] }]
  if (raw.length > 0 && Array.isArray(raw[0].skills)) {
    return raw.flatMap((cat, cIdx) =>
      cat.skills.map((s, sIdx) => ({
        id: (s.name || `skill-${cIdx}-${sIdx}`).toLowerCase().replace(/[^a-z0-9]/g, '-'),
        name: s.name,
        category: cat.category,
        icon: s.icon || null,
        imageUrl: s.imageUrl || null,
        level: s.level || 'Proficient',
        weight: s.weight || 2,
        color: s.color || '#38bdf8'
      }))
    );
  }
  return raw;
}

export function PortfolioDataProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Live state with defaults
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [socials, setSocials] = useState(DEFAULT_SOCIALS);
  const [skills, setSkills] = useState(DEFAULT_SKILL_ITEMS);
  const [education, setEducation] = useState(DEFAULT_EDUCATION);
  const [awards, setAwards] = useState(DEFAULT_AWARDS);
  const [writings, setWritings] = useState(DEFAULT_WRITINGS);
  const [projects, setProjects] = useState(DEFAULT_PROJECTS);
  const [experiences, setExperiences] = useState(DEFAULT_EXPERIENCES);

  const [hasFirestoreData, setHasFirestoreData] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Subscribe to Firebase Auth with strict admin authorization
  useEffect(() => {
    // Process redirect authentication if page returned from GitHub redirect
    if (isFirebaseConfigured) {
      checkRedirectResult().catch(err => {
        console.warn('[Firebase] Redirect result check:', err);
      });
    }

    const unsubscribe = subscribeToAuthChanges((user) => {
      if (user && !isUserAuthorizedAdmin(user)) {
        console.warn('[Security] Unauthorized user attempted access:', user.email, user.displayName);
        logoutAdminUser();
        setCurrentUser(null);
      } else {
        setCurrentUser(user);
      }
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Subscribe to Live Firestore collections / documents
  useEffect(() => {
    // Always check localStorage first for existing drafts / modifications
    try {
      const localProf = localStorage.getItem('local_portfolio_profile');
      const localSoc = localStorage.getItem('local_portfolio_socials');
      const localSkills = localStorage.getItem('local_portfolio_skills');
      const localEdu = localStorage.getItem('local_portfolio_education');
      const localAwards = localStorage.getItem('local_portfolio_awards');
      const localWritings = localStorage.getItem('local_portfolio_writings');
      const localProjs = localStorage.getItem('local_portfolio_projects');
      const localExps = localStorage.getItem('local_portfolio_experiences');

      if (localProf) {
        const parsed = JSON.parse(localProf);
        if (parsed && ((parsed.aboutBio || '').includes('shiny at 2AM') || (parsed.aboutParas && parsed.aboutParas.some(p => p.includes('Thapar'))))) {
          localStorage.removeItem('local_portfolio_profile');
          setProfile(DEFAULT_PROFILE);
        } else {
          setProfile(parsed);
        }
      }
      if (localSoc) setSocials(JSON.parse(localSoc));
      if (localSkills) setSkills(normalizeSkillsData(JSON.parse(localSkills)));
      if (localEdu) setEducation(JSON.parse(localEdu));

      if (localAwards) {
        const parsed = JSON.parse(localAwards);
        if (Array.isArray(parsed) && parsed.some(a => (a.title || '').includes('Economic Times'))) {
          localStorage.removeItem('local_portfolio_awards');
          setAwards(DEFAULT_AWARDS);
        } else {
          setAwards(parsed);
        }
      }

      if (localWritings) {
        const parsed = JSON.parse(localWritings);
        if (Array.isArray(parsed) && parsed.some(w => (w.url || '').includes('aahilminookhan'))) {
          localStorage.removeItem('local_portfolio_writings');
          setWritings(DEFAULT_WRITINGS);
        } else {
          setWritings(parsed);
        }
      }

      if (localProjs) {
        const parsed = JSON.parse(localProjs);
        if (Array.isArray(parsed) && parsed.some(p => p.id === 'holt' || p.id === 'sop-opera')) {
          localStorage.removeItem('local_portfolio_projects');
          setProjects(DEFAULT_PROJECTS);
        } else {
          setProjects(parsed);
        }
      }

      if (localExps) {
        const parsed = JSON.parse(localExps);
        if (Array.isArray(parsed) && parsed.some(e => e.id === 'samsung-prism' || e.id === 'oddmind')) {
          localStorage.removeItem('local_portfolio_experiences');
          setExperiences(DEFAULT_EXPERIENCES);
        } else {
          setExperiences(parsed);
        }
      }
    } catch (err) {
      console.warn('[Storage] Error loading local draft:', err);
    }

    if (!isFirebaseConfigured) {
      setIsLoading(false);
      return;
    }

    // Subscribe to Profile
    const unsubProfile = subscribeToLiveProfile((liveProfile) => {
      if (liveProfile && Object.keys(liveProfile).length > 0) {
        setProfile(prev => ({ ...prev, ...liveProfile }));
        setHasFirestoreData(true);
      }
    });

    // Subscribe to Socials
    const unsubSocials = subscribeToLiveSocials((liveSocials) => {
      if (liveSocials && Object.keys(liveSocials).length > 0) {
        setSocials(prev => ({ ...prev, ...liveSocials }));
      }
    });

    // Subscribe to Skills
    const unsubSkills = subscribeToLiveSkills((liveSkills) => {
      if (liveSkills && liveSkills.length > 0) {
        setSkills(normalizeSkillsData(liveSkills));
      }
    });

    // Subscribe to Education
    const unsubEdu = subscribeToLiveEducation((liveEdu) => {
      if (liveEdu && liveEdu.length > 0) {
        setEducation(liveEdu);
        localStorage.setItem('local_portfolio_education', JSON.stringify(liveEdu));
      } else {
        const stored = localStorage.getItem('local_portfolio_education');
        if (stored) {
          try {
            setEducation(JSON.parse(stored));
          } catch {
            setEducation(DEFAULT_EDUCATION);
          }
        }
      }
    });

    // Subscribe to Awards
    const unsubAwards = subscribeToLiveAwards((liveAwards) => {
      if (liveAwards && liveAwards.length > 0) {
        setAwards(liveAwards);
        localStorage.setItem('local_portfolio_awards', JSON.stringify(liveAwards));
      } else {
        const stored = localStorage.getItem('local_portfolio_awards');
        if (stored) {
          try {
            setAwards(JSON.parse(stored));
          } catch {
            setAwards(DEFAULT_AWARDS);
          }
        }
      }
    });

    // Subscribe to Writings
    const unsubWritings = subscribeToLiveWritings((liveWritings) => {
      if (liveWritings && liveWritings.length > 0) {
        setWritings(liveWritings);
        localStorage.setItem('local_portfolio_writings', JSON.stringify(liveWritings));
      } else {
        const stored = localStorage.getItem('local_portfolio_writings');
        if (stored) {
          try {
            setWritings(JSON.parse(stored));
          } catch {
            setWritings(DEFAULT_WRITINGS);
          }
        }
      }
    });

    // Subscribe to Projects
    const unsubProjects = subscribeToLiveProjects((liveList) => {
      if (liveList && liveList.length > 0) {
        setProjects(liveList);
        localStorage.setItem('local_portfolio_projects', JSON.stringify(liveList));
        setHasFirestoreData(true);
      } else {
        const stored = localStorage.getItem('local_portfolio_projects');
        if (stored) {
          try {
            setProjects(JSON.parse(stored));
          } catch {
            setProjects(DEFAULT_PROJECTS);
          }
        } else {
          setProjects(DEFAULT_PROJECTS);
        }
      }
      setIsLoading(false);
    });

    // Subscribe to Experiences
    const unsubExperiences = subscribeToLiveExperiences((liveList) => {
      if (liveList && liveList.length > 0) {
        setExperiences(liveList);
        localStorage.setItem('local_portfolio_experiences', JSON.stringify(liveList));
      } else {
        const stored = localStorage.getItem('local_portfolio_experiences');
        if (stored) {
          try {
            setExperiences(JSON.parse(stored));
          } catch {
            setExperiences(DEFAULT_EXPERIENCES);
          }
        } else {
          setExperiences(DEFAULT_EXPERIENCES);
        }
      }
    });

    return () => {
      unsubProfile();
      unsubSocials();
      unsubSkills();
      unsubEdu();
      unsubAwards();
      unsubWritings();
      unsubProjects();
      unsubExperiences();
    };
  }, []);

  // Compute skill categories automatically
  const skillCategories = useMemo(() => {
    return groupSkillsByCategory(skills);
  }, [skills]);

  // ================= CRUD Actions ================= //

  // Profile
  const updateProfile = async (profileData) => {
    const merged = { ...profile, ...profileData };
    setProfile(merged);
    localStorage.setItem('local_portfolio_profile', JSON.stringify(merged));
    if (isFirebaseConfigured && currentUser) {
      try {
        await saveProfileToDB(merged);
      } catch (err) {
        console.warn('[Firebase] Could not save profile:', err);
      }
    }
    return merged;
  };

  // Socials / Contact config
  const updateSocials = async (socialsData) => {
    const merged = { ...socials, ...socialsData };
    setSocials(merged);
    localStorage.setItem('local_portfolio_socials', JSON.stringify(merged));
    if (isFirebaseConfigured && currentUser) {
      try {
        await saveSocialsToDB(merged);
      } catch (err) {
        console.warn('[Firebase] Could not save socials:', err);
      }
    }
    return merged;
  };

  // Skills
  const createSkill = async (skillData) => {
    const newSkill = {
      ...skillData,
      id: skillData.id || 'skill-' + Date.now(),
      weight: skillData.weight || (skillData.level === 'Expert' ? 3 : skillData.level === 'Familiar' ? 1 : 2)
    };
    const updated = [...skills, newSkill];
    setSkills(updated);
    localStorage.setItem('local_portfolio_skills', JSON.stringify(updated));
    if (isFirebaseConfigured && currentUser) {
      try {
        await saveSkillsToDB(updated);
      } catch (err) {
        console.warn('[Firebase] Could not save skills:', err);
      }
    }
    return newSkill;
  };

  const editSkill = async (id, skillData) => {
    const updated = skills.map(s => {
      if (s.id === id) {
        const merged = { ...s, ...skillData };
        merged.weight = merged.weight || (merged.level === 'Expert' ? 3 : merged.level === 'Familiar' ? 1 : 2);
        return merged;
      }
      return s;
    });
    setSkills(updated);
    localStorage.setItem('local_portfolio_skills', JSON.stringify(updated));
    if (isFirebaseConfigured && currentUser) {
      try {
        await saveSkillsToDB(updated);
      } catch (err) {
        console.warn('[Firebase] Could not save skills:', err);
      }
    }
    return { id, ...skillData };
  };

  const removeSkill = async (id) => {
    const updated = skills.filter(s => s.id !== id);
    setSkills(updated);
    localStorage.setItem('local_portfolio_skills', JSON.stringify(updated));
    if (isFirebaseConfigured && currentUser) {
      try {
        await saveSkillsToDB(updated);
      } catch (err) {
        console.warn('[Firebase] Could not remove skill:', err);
      }
    }
  };

  const updateSkills = async (newSkillsList) => {
    setSkills(newSkillsList);
    localStorage.setItem('local_portfolio_skills', JSON.stringify(newSkillsList));
    if (isFirebaseConfigured && currentUser) {
      try {
        await saveSkillsToDB(newSkillsList);
      } catch (err) {
        console.warn('[Firebase] Could not save skills list:', err);
      }
    }
    return newSkillsList;
  };

  // Education
  const createEducation = async (eduData) => {
    let newId = 'local-' + Date.now();
    let savedInDB = false;
    let dbItem = null;
    if (isFirebaseConfigured && currentUser) {
      try {
        dbItem = await addEducationToDB(eduData);
        savedInDB = true;
      } catch (err) {
        console.warn('[Firebase] Could not add education:', err);
      }
    }
    const newEdu = savedInDB && dbItem ? dbItem : { ...eduData, id: newId };
    const updated = [...education, newEdu];
    setEducation(updated);
    localStorage.setItem('local_portfolio_education', JSON.stringify(updated));
    return newEdu;
  };

  const editEducation = async (id, eduData) => {
    const updated = education.map(e => e.id === id ? { ...e, ...eduData } : e);
    setEducation(updated);
    localStorage.setItem('local_portfolio_education', JSON.stringify(updated));
    if (isFirebaseConfigured && currentUser && !id.startsWith('local-')) {
      try {
        await updateEducationInDB(id, eduData);
      } catch (err) {
        console.warn('[Firebase] Could not update education:', err);
      }
    }
    return { id, ...eduData };
  };

  const removeEducation = async (id) => {
    const updated = education.filter(e => e.id !== id);
    setEducation(updated);
    localStorage.setItem('local_portfolio_education', JSON.stringify(updated));
    if (isFirebaseConfigured && currentUser && !id.startsWith('local-')) {
      try {
        await deleteEducationFromDB(id);
      } catch (err) {
        console.warn('[Firebase] Could not delete education:', err);
      }
    }
  };

  // Awards
  const createAward = async (awardData) => {
    let newId = 'local-' + Date.now();
    let savedInDB = false;
    let dbItem = null;
    if (isFirebaseConfigured && currentUser) {
      try {
        dbItem = await addAwardToDB(awardData);
        savedInDB = true;
      } catch (err) {
        console.warn('[Firebase] Could not add award:', err);
      }
    }
    const newAward = savedInDB && dbItem ? dbItem : { ...awardData, id: newId };
    const updated = [...awards, newAward];
    setAwards(updated);
    localStorage.setItem('local_portfolio_awards', JSON.stringify(updated));
    return newAward;
  };

  const editAward = async (id, awardData) => {
    const updated = awards.map(a => a.id === id ? { ...a, ...awardData } : a);
    setAwards(updated);
    localStorage.setItem('local_portfolio_awards', JSON.stringify(updated));
    if (isFirebaseConfigured && currentUser && !id.startsWith('local-')) {
      try {
        await updateAwardInDB(id, awardData);
      } catch (err) {
        console.warn('[Firebase] Could not update award:', err);
      }
    }
    return { id, ...awardData };
  };

  const removeAward = async (id) => {
    const updated = awards.filter(a => a.id !== id);
    setAwards(updated);
    localStorage.setItem('local_portfolio_awards', JSON.stringify(updated));
    if (isFirebaseConfigured && currentUser && !id.startsWith('local-')) {
      try {
        await deleteAwardFromDB(id);
      } catch (err) {
        console.warn('[Firebase] Could not delete award:', err);
      }
    }
  };

  // Writings
  const createWriting = async (writingData) => {
    let newId = 'local-' + Date.now();
    let savedInDB = false;
    let dbItem = null;
    if (isFirebaseConfigured && currentUser) {
      try {
        dbItem = await addWritingToDB(writingData);
        savedInDB = true;
      } catch (err) {
        console.warn('[Firebase] Could not add writing:', err);
      }
    }
    const newWriting = savedInDB && dbItem ? dbItem : { ...writingData, id: newId };
    const updated = [...writings, newWriting];
    setWritings(updated);
    localStorage.setItem('local_portfolio_writings', JSON.stringify(updated));
    return newWriting;
  };

  const editWriting = async (id, writingData) => {
    const updated = writings.map(w => w.id === id ? { ...w, ...writingData } : w);
    setWritings(updated);
    localStorage.setItem('local_portfolio_writings', JSON.stringify(updated));
    if (isFirebaseConfigured && currentUser && !id.startsWith('local-')) {
      try {
        await updateWritingInDB(id, writingData);
      } catch (err) {
        console.warn('[Firebase] Could not update writing:', err);
      }
    }
    return { id, ...writingData };
  };

  const removeWriting = async (id) => {
    const updated = writings.filter(w => w.id !== id);
    setWritings(updated);
    localStorage.setItem('local_portfolio_writings', JSON.stringify(updated));
    if (isFirebaseConfigured && currentUser && !id.startsWith('local-')) {
      try {
        await deleteWritingFromDB(id);
      } catch (err) {
        console.warn('[Firebase] Could not delete writing:', err);
      }
    }
  };

  // Projects
  const createProject = async (projectData) => {
    let newId = 'local-' + Date.now();
    let savedInDB = false;
    let dbItem = null;
    if (isFirebaseConfigured && currentUser) {
      try {
        dbItem = await addProjectToDB(projectData);
        savedInDB = true;
      } catch (err) {
        console.warn('[Firebase] Could not add project:', err);
      }
    }
    const newProj = savedInDB && dbItem ? dbItem : { ...projectData, id: newId };
    const updated = [newProj, ...projects];
    setProjects(updated);
    localStorage.setItem('local_portfolio_projects', JSON.stringify(updated));
    return newProj;
  };

  const editProject = async (id, projectData) => {
    const updated = projects.map(p => p.id === id ? { ...p, ...projectData } : p);
    setProjects(updated);
    localStorage.setItem('local_portfolio_projects', JSON.stringify(updated));
    if (isFirebaseConfigured && currentUser && !id.startsWith('local-')) {
      try {
        await updateProjectInDB(id, projectData);
      } catch (err) {
        console.warn('[Firebase] Could not update project:', err);
      }
    }
    return { id, ...projectData };
  };

  const removeProject = async (id) => {
    const updated = projects.filter(p => p.id !== id);
    setProjects(updated);
    localStorage.setItem('local_portfolio_projects', JSON.stringify(updated));
    if (isFirebaseConfigured && currentUser && !id.startsWith('local-')) {
      try {
        await deleteProjectFromDB(id);
      } catch (err) {
        console.warn('[Firebase] Could not delete project:', err);
      }
    }
  };

  // Experiences
  const createExperience = async (expData) => {
    let newId = 'local-' + Date.now();
    let savedInDB = false;
    let dbItem = null;
    if (isFirebaseConfigured && currentUser) {
      try {
        dbItem = await addExperienceToDB(expData);
        savedInDB = true;
      } catch (err) {
        console.warn('[Firebase] Could not add experience:', err);
      }
    }
    const newExp = savedInDB && dbItem ? dbItem : { ...expData, id: newId };
    const updated = [newExp, ...experiences];
    setExperiences(updated);
    localStorage.setItem('local_portfolio_experiences', JSON.stringify(updated));
    return newExp;
  };

  const editExperience = async (id, expData) => {
    const updated = experiences.map(e => e.id === id ? { ...e, ...expData } : e);
    setExperiences(updated);
    localStorage.setItem('local_portfolio_experiences', JSON.stringify(updated));
    if (isFirebaseConfigured && currentUser && !id.startsWith('local-')) {
      try {
        await updateExperienceInDB(id, expData);
      } catch (err) {
        console.warn('[Firebase] Could not update experience:', err);
      }
    }
    return { id, ...expData };
  };

  const removeExperience = async (id) => {
    const updated = experiences.filter(e => e.id !== id);
    setExperiences(updated);
    localStorage.setItem('local_portfolio_experiences', JSON.stringify(updated));
    if (isFirebaseConfigured && currentUser && !id.startsWith('local-')) {
      try {
        await deleteExperienceFromDB(id);
      } catch (err) {
        console.warn('[Firebase] Could not delete experience:', err);
      }
    }
  };

  // Complete seed database
  const populateWithDefaultData = async () => {
    if (isFirebaseConfigured) {
      return await seedDatabase({
        initialProjects: DEFAULT_PROJECTS,
        initialExperiences: DEFAULT_EXPERIENCES,
        initialProfile: DEFAULT_PROFILE,
        initialSocials: DEFAULT_SOCIALS,
        initialEducation: DEFAULT_EDUCATION,
        initialSkills: DEFAULT_SKILL_ITEMS,
        initialAwards: DEFAULT_AWARDS,
        initialWritings: DEFAULT_WRITINGS
      });
    } else {
      setProfile(DEFAULT_PROFILE);
      setSocials(DEFAULT_SOCIALS);
      setSkills(DEFAULT_SKILL_ITEMS);
      setEducation(DEFAULT_EDUCATION);
      setAwards(DEFAULT_AWARDS);
      setWritings(DEFAULT_WRITINGS);
      setProjects(DEFAULT_PROJECTS);
      setExperiences(DEFAULT_EXPERIENCES);
      localStorage.clear();
      return {
        profileSeeded: true,
        socialsSeeded: true,
        skillsSeeded: true,
        projectsAdded: DEFAULT_PROJECTS.length,
        experiencesAdded: DEFAULT_EXPERIENCES.length,
        educationAdded: DEFAULT_EDUCATION.length,
        awardsAdded: DEFAULT_AWARDS.length,
        writingsAdded: DEFAULT_WRITINGS.length
      };
    }
  };

  const value = {
    profile,
    socials,
    skills,
    skillCategories,
    education,
    awards,
    writings,
    projects,
    experiences,
    isLoading,
    isFirebaseConfigured,
    hasFirestoreData,
    currentUser,
    isAuthLoading,
    loginAdmin: loginAdminUser,
    loginWithGitHub,
    logoutAdmin: logoutAdminUser,
    updateProfile,
    updateSocials,
    createSkill,
    editSkill,
    removeSkill,
    updateSkills,
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
  };

  return (
    <PortfolioDataContext.Provider value={value}>
      {children}
    </PortfolioDataContext.Provider>
  );
}

export function usePortfolioData() {
  const context = useContext(PortfolioDataContext);
  if (!context) {
    throw new Error('usePortfolioData must be used within a PortfolioDataProvider');
  }
  return context;
}
