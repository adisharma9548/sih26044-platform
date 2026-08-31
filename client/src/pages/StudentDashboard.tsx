import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { studentService, type StudentProfile, type CareerIntelligence } from '../services/student.service';
import { Card, CardContent, CardHeader, CardTitle } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import SkillsManagement from './StudentDashboard/SkillsManagement';
import EducationList from './StudentDashboard/EducationList';
import ProjectsList from './StudentDashboard/ProjectsList';
import CertificationsList from './StudentDashboard/CertificationsList';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [intelligence, setIntelligence] = useState<CareerIntelligence | null>(null);
  const [careerOptions, setCareerOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    enrollmentNumber: '',
    department: '',
    year: 1,
    targetRole: '',
  });

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const [data, intelligenceData, options] = await Promise.all([studentService.getProfile(), studentService.getCareerIntelligence(), studentService.getCareerOptions()]);
      setProfile(data);
      setIntelligence(intelligenceData);
      setCareerOptions(options);
      setFormData({
        name: data.name,
        enrollmentNumber: data.enrollmentNumber,
        department: data.department,
        year: data.year,
        targetRole: data.targetRole || 'Full Stack Developer',
      });
      setError('');
    } catch {
      setError('Unable to load your profile. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await studentService.updateProfile(formData);
      setIsEditing(false);
      fetchProfile();
    } catch {
      alert('Update failed. Please check your inputs.');
    }
  };

  const refreshProfile = () => fetchProfile();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 dark:text-gray-400">Loading your profile…</div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-4 rounded-lg border border-red-200 dark:border-red-800">
        {error || 'Profile not found.'}
      </div>
    );
  }

  // Calculate completion
  const completion = (() => {
    let score = 0;
    if (profile.name) score += 15;
    if (profile.enrollmentNumber) score += 10;
    if (profile.department) score += 10;
    if (profile.year) score += 10;
    if (profile.education?.length > 0) score += 15;
    if (profile.skills?.length > 0) score += 15;
    if (profile.projects?.length > 0) score += 15;
    if (profile.certifications?.length > 0) score += 10;
    return Math.min(score, 100);
  })();
  const readiness = intelligence?.readinessScore ?? 0;
  const skillGaps = intelligence?.skillGaps ?? [];
  const biggestOpportunity = intelligence?.biggestOpportunity;

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div><p className="text-xs font-bold uppercase tracking-[.14em] text-[#0d7c8a]">Career intelligence</p><h1 className="mt-1 text-2xl font-bold tracking-tight text-[#092b4c]">Good morning, {profile.name?.split(' ')[0] || user?.email}</h1></div>
        <button className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-600 hover:border-[#0d7c8a]">View my roadmap →</button>
      </div>

      <section className="intelligence-card overflow-hidden rounded-2xl border border-[#d8e8ed] bg-white">
        <div className="grid gap-0 lg:grid-cols-[.85fr_1.5fr_.9fr]">
          <div className="border-b border-slate-100 p-6 lg:border-b-0 lg:border-r"><p className="text-xs font-bold uppercase tracking-[.14em] text-slate-500">Career readiness</p><div className="mt-5 flex items-center gap-4"><div className="score-ring !h-[86px] !w-[86px]"><span><b className="!text-[25px]">{readiness}</b><small>%</small></span></div><div><p className="font-bold text-[#092b4c]">{intelligence?.targetRole || profile.targetRole}</p><p className="mt-1 text-xs leading-5 text-slate-500">Based on your saved skills and evidence.</p></div></div><div className="mt-5 border-t border-slate-100 pt-4 text-sm"><span className="text-slate-500">Profile completion</span><p className="mt-1 font-semibold text-[#087a73]">{intelligence?.profileCompletion ?? completion}% complete →</p></div></div>
          <div className="border-b border-slate-100 p-6 lg:border-b-0 lg:border-r"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-slate-500">Your skills vs industry</p><h2 className="mt-1 font-bold text-[#092b4c]">Skill gap snapshot</h2></div><span className="rounded-md bg-[#edf8f7] px-2 py-1 text-xs font-semibold text-[#087a73]">Live profile data</span></div><div className="mt-5 space-y-3">{skillGaps.slice(0, 4).map((skill) => <div key={skill.name} className="grid grid-cols-[74px_1fr_36px] items-center gap-3 text-xs"><span className="font-medium text-slate-600">{skill.name}</span><div><div className="flex h-2 overflow-hidden rounded-full bg-slate-100"><span className="bg-[#159d93]" style={{width: `${Math.min(skill.current, skill.required)}%`}} /></div><p className="mt-1 text-[10px] text-slate-400">You {skill.current}% · Goal {skill.required}%</p></div><span className="font-bold text-[#0d7c8a]">{skill.gap ? `+${skill.gap}` : 'Ready'}</span></div>)}</div></div>
          <div className="bg-[#f2f9f8] p-6"><p className="text-xs font-bold uppercase tracking-[.14em] text-[#087a73]">Biggest opportunity</p><h2 className="mt-2 text-lg font-bold text-[#092b4c]">{biggestOpportunity?.name || 'Build your skill profile'}</h2><p className="mt-1 text-sm text-slate-500">{biggestOpportunity ? `Close a ${biggestOpportunity.gap}-point gap to unlock more matching roles.` : 'Add skills to receive a personalised roadmap.'}</p><div className="mt-5 space-y-2 text-xs font-medium text-slate-600">{(intelligence?.roadmap ?? []).slice(0, 3).map((step, index) => <p key={step}>0{index + 1} · {step}</p>)}</div><button className="mt-5 w-full rounded-lg bg-[#073b63] px-3 py-2.5 text-sm font-semibold text-white hover:bg-[#052f50]">Start roadmap</button></div>
        </div>
      </section>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader><CardTitle className="dark:text-white">Profile Completion</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">{completion}%</div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
              <div className="bg-primary-600 h-2 rounded-full transition-all duration-500" style={{ width: `${completion}%` }}></div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {completion === 100 ? 'Fully complete! 🎉' : 'Add more details to improve your profile'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="dark:text-white">Skills</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{profile.skills?.length || 0}</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Skills added</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="dark:text-white">Projects</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{profile.projects?.length || 0}</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Projects showcased</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="dark:text-white">Certifications</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{profile.certifications?.length || 0}</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Certifications earned</p>
          </CardContent>
        </Card>
      </div>

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="dark:text-white">Personal Information</CardTitle>
            {!isEditing && (
              <Button size="sm" onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <Input
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                fullWidth
                required
              />
              <Input
                label="Enrollment Number"
                name="enrollmentNumber"
                value={formData.enrollmentNumber}
                onChange={(e) => setFormData({ ...formData, enrollmentNumber: e.target.value })}
                fullWidth
                required
              />
              <Input
                label="Department"
                name="department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                fullWidth
                required
              />
              <Input
                label="Year (1-5)"
                type="number"
                name="year"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || 1 })}
                fullWidth
                required
              />
              <div><label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Target Role</label><select name="targetRole" value={formData.targetRole} onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })} className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none focus:border-primary-500"><option value="">Select a target role</option>{careerOptions.map((role) => <option key={role} value={role}>{role}</option>)}</select></div>
              <div className="flex space-x-3">
                <Button type="submit">Save Changes</Button>
                <Button variant="outline" type="button" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Full Name</p>
                <p className="font-medium text-gray-900 dark:text-white">{profile.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Enrollment Number</p>
                <p className="font-medium text-gray-900 dark:text-white">{profile.enrollmentNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Department</p>
                <p className="font-medium text-gray-900 dark:text-white">{profile.department}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Year</p>
                <p className="font-medium text-gray-900 dark:text-white">{profile.year}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Target Role</p>
                <p className="font-medium text-gray-900 dark:text-white">{profile.targetRole || 'Full Stack Developer'}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Skills Management */}
      <SkillsManagement skills={profile.skills || []} onUpdate={refreshProfile} />

      {/* Education */}
      <EducationList education={profile.education || []} onUpdate={refreshProfile} />

      {/* Projects */}
      <ProjectsList projects={profile.projects || []} onUpdate={refreshProfile} />

      {/* Certifications */}
      <CertificationsList certifications={profile.certifications || []} onUpdate={refreshProfile} />

    </div>
  );
};

export default StudentDashboard;
