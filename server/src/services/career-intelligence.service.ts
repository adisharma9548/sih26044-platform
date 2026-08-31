import { IStudent, ISkill } from '../models/Student';

type SkillRequirement = { name: string; required: number; category: string };

const ROLE_PROFILES: Record<string, { skills: SkillRequirement[]; roadmap: string[] }> = {
  'Full Stack Developer': {
    skills: [
      { name: 'JavaScript', required: 80, category: 'Programming' },
      { name: 'React', required: 80, category: 'Programming' },
      { name: 'Node.js', required: 70, category: 'Programming' },
      { name: 'MongoDB', required: 70, category: 'Data Science' },
      { name: 'AWS', required: 60, category: 'Cloud' },
      { name: 'Docker', required: 65, category: 'DevOps' },
    ],
    roadmap: ['AWS Fundamentals', 'Cloud Deployment', 'Docker', 'Deploy a Full Stack Project'],
  },
  'Data Analyst': {
    skills: [
      { name: 'Python', required: 75, category: 'Programming' },
      { name: 'SQL', required: 80, category: 'Data Science' },
      { name: 'Excel', required: 75, category: 'Data Science' },
      { name: 'Power BI', required: 65, category: 'Data Science' },
    ],
    roadmap: ['SQL Foundations', 'Data Visualisation', 'Build an Analytics Project', 'Publish a Portfolio'],
  },
};

const LEVEL_SCORES: Record<ISkill['level'], number> = { Beginner: 30, Intermediate: 55, Advanced: 78, Expert: 92 };

export interface CareerIntelligence {
  targetRole: string;
  readinessScore: number;
  profileCompletion: number;
  skillGaps: Array<{ name: string; current: number; required: number; gap: number; status: 'met' | 'gap' }>;
  biggestOpportunity: { name: string; current: number; required: number; gap: number } | null;
  roadmap: string[];
  generatedAt: string;
}

export class CareerIntelligenceService {
  getSupportedRoles(): string[] { return Object.keys(ROLE_PROFILES); }

  getStudentIntelligence(student: IStudent): CareerIntelligence {
    const targetRole = ROLE_PROFILES[student.targetRole] ? student.targetRole : 'Full Stack Developer';
    const profile = ROLE_PROFILES[targetRole];
    const userSkills = new Map(student.skills.map((skill) => [this.normalise(skill.name), this.skillScore(skill)]));
    const skillGaps = profile.skills.map((skill) => {
      const current = userSkills.get(this.normalise(skill.name)) ?? 0;
      const gap = Math.max(0, skill.required - current);
      return { name: skill.name, current, required: skill.required, gap, status: gap === 0 ? 'met' as const : 'gap' as const };
    });
    const matchedScore = skillGaps.reduce((total, skill) => total + Math.min(skill.current, skill.required) / skill.required, 0) / skillGaps.length;
    const evidenceScore = Math.min(1, (student.projects.length * .15) + (student.certifications.length * .1) + (student.skills.filter((s) => s.verified).length * .08));
    const readinessScore = Math.round((matchedScore * .8 + evidenceScore * .2) * 100);
    const profileCompletion = this.profileCompletion(student);
    const biggest = skillGaps.filter((skill) => skill.gap > 0).sort((a, b) => b.gap - a.gap)[0] ?? null;
    return { targetRole, readinessScore, profileCompletion, skillGaps, biggestOpportunity: biggest, roadmap: profile.roadmap, generatedAt: new Date().toISOString() };
  }

  private skillScore(skill: ISkill): number { return LEVEL_SCORES[skill.level] + (skill.verified ? 5 : 0); }
  private normalise(value: string): string { return value.trim().toLocaleLowerCase(); }
  private profileCompletion(student: IStudent): number {
    const checks = [student.name, student.enrollmentNumber, student.department, student.targetRole, student.education.length > 0, student.skills.length > 0, student.projects.length > 0, student.certifications.length > 0, Boolean(student.resume)];
    return Math.round(checks.filter(Boolean).length / checks.length * 100);
  }
}
