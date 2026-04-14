import React from "react";
import {
  User,
  Briefcase,
  Code,
  Link as LinkIcon,
  Award,
  Save,
  X,
  ExternalLink,
} from "lucide-react";
import { Skill } from "@/lib/types";

interface ProfileFormData {
  fullName: string;
  bio: string;
  roleTitle: string;
  devStack: string;
  linkedinUrl: string;
  portfolioUrl: string;
  selectedSkills: number[];
}

interface ProfileInfoFormProps {
  formData: ProfileFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProfileFormData>>;
  allSkills: Skill[];
  handleSaveProfile: (e: React.FormEvent) => Promise<void>;
  saving: boolean;
  searchSkill: string;
  setSearchSkill: React.Dispatch<React.SetStateAction<string>>;
}

// Reusable Tailwind classes for the consistent theme
const INPUT_CLASS =
  "w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-600 text-white focus:outline-none focus:border-primary transition-colors text-sm md:text-base";
const LABEL_CLASS = "block text-sm font-medium text-slate-300 mb-2";
const CARD_CLASS =
  "card p-4 md:p-6 border border-slate-700/50 hover:shadow-xl transition-shadow duration-300";
const ICON_CONTAINER_CLASS = "p-2 bg-purple-500/20 rounded-lg";
const HEADER_ICON_CLASS = "text-purple-400";
const SAVE_BUTTON_CLASS =
  "w-full py-3 bg-gradient-to-r from-primary to-accent text-white rounded-lg font-medium hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 flex items-center justify-center gap-3 text-base md:text-lg shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed";

const ProfileInfoForm: React.FC<ProfileInfoFormProps> = ({
  formData,
  setFormData,
  allSkills,
  handleSaveProfile,
  saving,
  searchSkill,
  setSearchSkill,  
}) => {

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSkillToggle = (skillId: number) => {
    setFormData((prev) => ({
      ...prev,
      selectedSkills: prev.selectedSkills.includes(skillId)
        ? prev.selectedSkills.filter((id) => id !== skillId)
        : [...prev.selectedSkills, skillId],
    }));
  };

  const filteredSkills = allSkills.filter((skill) =>
    skill.name.toLowerCase().includes(searchSkill.toLowerCase())
  );

  const selectedSkillsData = allSkills.filter((skill) =>
    formData.selectedSkills.includes(skill.id)
  );

  return (
    <form onSubmit={handleSaveProfile} className="space-y-4 md:space-y-6">
      {/* Basic Info Card */}
      <div className={CARD_CLASS}>
        <div className="flex items-center gap-3 mb-6">
          <div className={ICON_CONTAINER_CLASS}>
            <User className={HEADER_ICON_CLASS} size={24} />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white">
            Basic Information
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="md:col-span-2">
            <label className={LABEL_CLASS}>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className={INPUT_CLASS}
              placeholder="John Doe"
            />
          </div>

          <div className="md:col-span-2">
            <label className={LABEL_CLASS}>Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows={4}
              className={`${INPUT_CLASS} resize-none`}
              placeholder="Tell us about yourself, your passions, and what drives you..."
            />
            <p className="text-xs text-slate-500 mt-2">
              {formData.bio.length} characters
            </p>
          </div>

          <div>
            <label className={LABEL_CLASS}>Role Title</label>
            <div className="relative">
              <Briefcase
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                size={18}
              />
              <input
                type="text"
                name="roleTitle"
                value={formData.roleTitle}
                onChange={handleInputChange}
                className={`${INPUT_CLASS} pl-10`}
                placeholder="Frontend Developer"
              />
            </div>
          </div>

          <div>
            <label className={LABEL_CLASS}>Dev Stack</label>
            <div className="relative">
              <Code
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                size={18}
              />
              <input
                type="text"
                name="devStack"
                value={formData.devStack}
                onChange={handleInputChange}
                className={`${INPUT_CLASS} pl-10`}
                placeholder="React, Node.js, PostgreSQL"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Social Links Card */}
      <div className={CARD_CLASS}>
        <div className="flex items-center gap-3 mb-6">
          <div className={ICON_CONTAINER_CLASS}>
            <LinkIcon className={HEADER_ICON_CLASS} size={24} />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white">
            Social Links
          </h2>
        </div>

        <div className="space-y-4 md:space-y-6">
          <div>
            <label className={LABEL_CLASS}>LinkedIn Profile</label>
            <div className="relative">
              {/* LinkedIn Icon - kept original SVG but applied slate-500 text color */}
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
              <input
                type="url"
                name="linkedinUrl"
                value={formData.linkedinUrl}
                onChange={handleInputChange}
                className={`${INPUT_CLASS} pl-10`}
                placeholder="https://linkedin.com/in/username"
              />
            </div>
          </div>

          <div>
            <label className={LABEL_CLASS}>Portfolio Website</label>
            <div className="relative">
              <ExternalLink
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                size={18}
              />
              <input
                type="url"
                name="portfolioUrl"
                value={formData.portfolioUrl}
                onChange={handleInputChange}
                className={`${INPUT_CLASS} pl-10`}
                placeholder="https://yourportfolio.com"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Skills Card */}
      <div className={CARD_CLASS}>
        <div className="flex items-center gap-3 mb-6">
          <div className={ICON_CONTAINER_CLASS}>
            <Award className={HEADER_ICON_CLASS} size={24} />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white">
            Skills & Expertise
          </h2>
        </div>

        {selectedSkillsData.length > 0 && (
          <div className="mb-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <p className="text-sm font-medium text-slate-400 mb-3">
              Selected Skills ({selectedSkillsData.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedSkillsData.map((skill) => (
                <button
                  key={skill.id}
                  type="button"
                  onClick={() => handleSkillToggle(skill.id)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/20 text-primary border border-primary/30 rounded-full text-sm font-medium hover:bg-primary/30 transition-all group"
                >
                  {skill.name}
                  <X
                    size={14}
                    className="group-hover:scale-110 transition-transform"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mb-4">
          <input
            type="text"
            value={searchSkill}
            onChange={(e) => setSearchSkill(e.target.value)}
            placeholder="🔍 Search skills..."
            className={INPUT_CLASS}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-96 overflow-y-auto p-2 bg-slate-900/30 rounded-lg border border-slate-700/50">
          {filteredSkills.map((skill) => (
            <label
              key={skill.id}
              className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-all ${
                formData.selectedSkills.includes(skill.id)
                  ? "bg-primary/20 border-2 border-primary/50 shadow-lg shadow-primary/10" // Increased opacity/intensity slightly for selected state
                  : "bg-slate-800/50 border-2 border-transparent hover:border-slate-600 hover:bg-slate-800"
              }`}
            >
              <input
                type="checkbox"
                checked={formData.selectedSkills.includes(skill.id)}
                onChange={() => handleSkillToggle(skill.id)}
                // Adjusted checkbox style to fit the dark theme better
                className="w-4 h-4 rounded border-slate-500 bg-slate-900 text-primary focus:ring-primary focus:ring-offset-slate-900 transition-all"
              />
              <span
                className={`text-sm font-medium ${
                  formData.selectedSkills.includes(skill.id)
                    ? "text-primary"
                    : "text-slate-300"
                }`}
              >
                {skill.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="sticky bottom-0 md:bottom-6 z-10 p-4 md:p-0 bg-slate-900/80 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none -mx-4 md:mx-0 -mb-4 md:mb-0 border-t border-slate-700/50 md:border-none">
        <button type="submit" disabled={saving} className={SAVE_BUTTON_CLASS}>
          {saving ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Saving Changes...
            </>
          ) : (
            <>
              <Save size={20} />
              Save All Changes
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ProfileInfoForm;
