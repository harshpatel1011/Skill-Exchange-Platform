import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { User, Award, Plus, X, Edit3, Check, Zap, Star, CheckSquare } from 'lucide-react';
import './Profile.css';
const Profile = () => {
  const {
    currentUser,
    updateProfile
  } = useContext(AppContext);
  const [isEditing, setIsEditing] = useState(false);

  // Form fields state
  const [name, setName] = useState(currentUser.name);
  const [title, setTitle] = useState(currentUser.title);
  const [bio, setBio] = useState(currentUser.bio);

  // Interactive Tag Editor State
  const [newTeachSkill, setNewTeachSkill] = useState('');
  const [newLearnSkill, setNewLearnSkill] = useState('');
  const [skillsTeach, setSkillsTeach] = useState(currentUser.skillsTeach);
  const [skillsLearn, setSkillsLearn] = useState(currentUser.skillsLearn);
  const handleProfileSave = e => {
    e.preventDefault();
    updateProfile({
      name,
      title,
      bio,
      skillsTeach,
      skillsLearn
    });
    setIsEditing(false);
  };
  const addTeachSkill = () => {
    if (newTeachSkill.trim() && !skillsTeach.includes(newTeachSkill.trim())) {
      setSkillsTeach([...skillsTeach, newTeachSkill.trim()]);
      setNewTeachSkill('');
    }
  };
  const removeTeachSkill = skill => {
    setSkillsTeach(skillsTeach.filter(s => s !== skill));
  };
  const addLearnSkill = () => {
    if (newLearnSkill.trim() && !skillsLearn.includes(newLearnSkill.trim())) {
      setSkillsLearn([...skillsLearn, newLearnSkill.trim()]);
      setNewLearnSkill('');
    }
  };
  const removeLearnSkill = skill => {
    setSkillsLearn(skillsLearn.filter(s => s !== skill));
  };
  return <div className="profile-style-1">
      

      {/* Main Header */}
      <div className="profile-style-2">
        <div>
          <h1 className="profile-style-3">My Platform Profile</h1>
          <p className="profile-style-4">Manage your personal details, tags, achievements, and statistics.</p>
        </div>
        {!isEditing && <button className="btn btn-secondary" onClick={() => setIsEditing(true)}>
            <Edit3 size={16} /> Edit Profile
          </button>}
      </div>

      {/* Profile Info block */}
      {!isEditing ?
    // VIEW MODE PROFILE HEADER
    <section className="glass-panel profile-hero">
          <div className="profile-style-5">
            {currentUser.name ? currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'U'}
          </div>
          <div className="profile-style-6">
            <div className="profile-style-7">
              <h2 className="profile-style-8">{currentUser.name}</h2>
              <span className="badge badge-tech profile-style-9">
                Level {currentUser.level} Contributor
              </span>
            </div>
            <p className="profile-style-10">{currentUser.title}</p>
            <p className="profile-style-11">
              "{currentUser.bio}"
            </p>

            {/* Quick Metrics */}
            <div className="profile-style-12">
              <div>
                <span className="profile-style-13">Member Rating</span>
                <div className="profile-style-14">
                  <Star size={16} fill="#fbbf24" stroke="#fbbf24" />
                  <span className="profile-style-15">{currentUser.rating}</span>
                  <span className="profile-style-16">({currentUser.reviewsCount} reviews)</span>
                </div>
              </div>
              
              <div>
                <span className="profile-style-17">Completed Contracts</span>
                <div className="profile-style-18">
                  <CheckSquare size={16} className="text-gradient" />
                  <span className="profile-style-19">{currentUser.completedExchanges} Exchanges</span>
                </div>
              </div>

              <div>
                <span className="profile-style-20">Experience points (XP)</span>
                <div className="profile-style-21">
                  <Zap size={16} className="profile-style-22" />
                  <span className="profile-style-23">{currentUser.xp} / {currentUser.xpToNextLevel} XP</span>
                </div>
              </div>
            </div>

          </div>
        </section> :
    // EDIT MODE PROFILE HEADER
    <form onSubmit={handleProfileSave} className="glass-panel profile-style-24">
          <h3 className="profile-style-25">
            Edit Personal Profile Details
          </h3>

          <div className="profile-style-26">
            <div className="form-group profile-style-27">
              <label className="form-label">Full Name:</label>
              <input type="text" className="form-input" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="form-group profile-style-28">
              <label className="form-label">Professional Subtitle:</label>
              <input type="text" className="form-input" value={title} onChange={e => setTitle(e.target.value)} required />
            </div>
          </div>

          <div className="form-group profile-style-29">
            <label className="form-label">Personal Bio / Pitch Summary:</label>
            <textarea className="form-input profile-style-30" value={bio} onChange={e => setBio(e.target.value)} required></textarea>
          </div>

          {/* EDIT TAGS SECTION */}
          <div className="profile-style-31">
            
            {/* Skills I Can Teach Editor */}
            <div>
              <label className="form-label">Skills I Can Teach:</label>
              <div className="profile-style-32">
                <input type="text" className="form-input" placeholder="e.g. React, Docker, Cooking" value={newTeachSkill} onChange={e => setNewTeachSkill(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTeachSkill())} />
                <button type="button" className="btn btn-secondary profile-style-33" onClick={addTeachSkill}>
                  <Plus size={18} />
                </button>
              </div>
              <div className="profile-style-34">
                {skillsTeach.map(skill => <span key={skill} className="interactive-tag">
                    {skill}
                    <button type="button" className="tag-remove-btn" onClick={() => removeTeachSkill(skill)}>
                      <X size={12} />
                    </button>
                  </span>)}
              </div>
            </div>

            {/* Skills I Want to Learn Editor */}
            <div>
              <label className="form-label">Skills I Want to Learn:</label>
              <div className="profile-style-35">
                <input type="text" className="form-input" placeholder="e.g. Guitar, French, Baking" value={newLearnSkill} onChange={e => setNewLearnSkill(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addLearnSkill())} />
                <button type="button" className="btn btn-secondary profile-style-36" onClick={addLearnSkill}>
                  <Plus size={18} />
                </button>
              </div>
              <div className="profile-style-37">
                {skillsLearn.map(skill => <span key={skill} className="interactive-tag profile-style-38">
                    {skill}
                    <button type="button" className="tag-remove-btn" onClick={() => removeLearnSkill(skill)}>
                      <X size={12} />
                    </button>
                  </span>)}
              </div>
            </div>

          </div>

          <div className="profile-style-39">
            <button type="button" className="btn btn-secondary" onClick={() => {
          setName(currentUser.name);
          setTitle(currentUser.title);
          setBio(currentUser.bio);
          setSkillsTeach(currentUser.skillsTeach);
          setSkillsLearn(currentUser.skillsLearn);
          setIsEditing(false);
        }}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Check size={16} /> Save Profile Changes
            </button>
          </div>

        </form>}

      {/* Skills Display Cards in view mode */}
      {!isEditing && <section className="profile-style-40">
          
          <div className="glass-panel profile-style-41">
            <h3 className="profile-style-42">
              <span className="profile-style-43"></span>
              Skills I Teach
            </h3>
            <div className="profile-style-44">
              {currentUser.skillsTeach.map(skill => <span key={skill} className="badge badge-tech profile-style-45">
                  {skill}
                </span>)}
            </div>
          </div>

          <div className="glass-panel profile-style-46">
            <h3 className="profile-style-47">
              <span className="profile-style-48"></span>
              Skills I Learn
            </h3>
            <div className="profile-style-49">
              {currentUser.skillsLearn.map(skill => <span key={skill} className="badge badge-creative profile-style-50">
                  {skill}
                </span>)}
            </div>
          </div>

        </section>}

      {/* Gamified Achievements Block */}
      <section>
        <h2 className="profile-style-51">Achievements & Badges</h2>
        <p className="profile-style-52">Log hours and exchange skills to level up your contribution rank.</p>

        <div className="achievement-grid">
          {currentUser.achievements.map(ach => <div key={ach.id} className={`glass-panel badge-card ${ach.unlocked ? 'unlocked' : 'locked'}`}>
              <div className="badge-circle">
                {ach.icon}
              </div>
              <div className="profile-style-53">
                <div className="profile-style-54">
                  <h4 className="profile-style-55">{ach.name}</h4>
                  {ach.unlocked ? <span className="profile-style-56">Unlocked</span> : <span className="profile-style-57">Locked</span>}
                </div>
                <p className="profile-style-58">
                  {ach.desc}
                </p>
              </div>
            </div>)}
        </div>
      </section>

    </div>;
};
export default Profile;
