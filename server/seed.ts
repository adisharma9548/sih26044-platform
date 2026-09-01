import mongoose from 'mongoose';
import { config } from './src/config/env';
import { Skill } from './src/models/Skill';
import { User } from './src/models/User';
import { Student } from './src/models/Student';
import { Recruiter } from './src/models/Recruiter';
import { Internship } from './src/models/Internship';
import bcrypt from 'bcrypt';

const seed = async () => {
  await mongoose.connect(config.mongodbUri);
  console.log('Seeding database...');

  await Skill.deleteMany({});
  await User.deleteMany({});
  await Student.deleteMany({});
  await Recruiter.deleteMany({});
  await Internship.deleteMany({});

  const skills = [
    { name: 'JavaScript', category: 'programming', industryDemand: 'high' },
    { name: 'React', category: 'programming', industryDemand: 'high' },
    { name: 'Python', category: 'programming', industryDemand: 'high' },
    { name: 'Node.js', category: 'programming', industryDemand: 'high' },
    { name: 'CSS', category: 'design', industryDemand: 'medium' },
    { name: 'SQL', category: 'data-science', industryDemand: 'high' },
    { name: 'AWS', category: 'cloud', industryDemand: 'high' },
    { name: 'Docker', category: 'devops', industryDemand: 'medium' },
    { name: 'Communication', category: 'soft-skills', industryDemand: 'high' },
  ];
  const skillDocs = await Skill.insertMany(skills);

  const studentPassword = await bcrypt.hash('password123', 10);
  const studentUser = new User({
    email: 'student@example.com',
    password: studentPassword,
    role: 'student',
    name: 'Rahul Sharma',
    profileId: new mongoose.Types.ObjectId(),
    profileModel: 'Student',
  });
  await studentUser.save();

  const studentProfile = new Student({
    user: studentUser._id,
    name: 'Rahul Sharma',
    enrollmentNumber: '2024CS001',
    department: 'Computer Science',
    year: 3,
    skills: [
      { name: 'JavaScript', category: 'programming', level: 'intermediate', verified: true },
      { name: 'React', category: 'programming', level: 'intermediate', verified: false },
      { name: 'Python', category: 'programming', level: 'beginner', verified: false },
    ],
    education: [{ degree: 'B.Tech CSE', institution: 'IIT Delhi', year: 2027, score: '8.5' }],
    projects: [{ title: 'E‑commerce App', description: 'Built with React and Node.js', link: 'https://github.com/...' }],
  });
  await studentProfile.save();
  studentUser.profileId = studentProfile._id;
  await studentUser.save();

  const recruiterPassword = await bcrypt.hash('password123', 10);
  const recruiterUser = new User({
    email: 'recruiter@example.com',
    password: recruiterPassword,
    role: 'recruiter',
    name: 'Google HR',
    profileId: new mongoose.Types.ObjectId(),
    profileModel: 'Recruiter',
  });
  await recruiterUser.save();

  const recruiterProfile = new Recruiter({
    user: recruiterUser._id,
    companyName: 'Google',
    description: 'Tech giant',
    industry: 'IT',
    location: 'Bangalore',
  });
  await recruiterProfile.save();
  recruiterUser.profileId = recruiterProfile._id;
  await recruiterUser.save();

  const internship = new Internship({
    title: 'Frontend Engineering Intern',
    description: 'Build next‑gen web apps.',
    company: recruiterProfile._id,
    location: 'Remote',
    workMode: 'remote',
    type: 'internship',
    skills: [
      { skillId: skillDocs.find(s => s.name === 'React')!._id, required: true },
      { skillId: skillDocs.find(s => s.name === 'JavaScript')!._id, required: true },
      { skillId: skillDocs.find(s => s.name === 'CSS')!._id, required: false },
      { skillId: skillDocs.find(s => s.name === 'Docker')!._id, required: false },
    ],
    stipend: '₹30,000/month',
    duration: '6 months',
    applicationDeadline: new Date('2026-12-31'),
    postedAt: new Date(),
    status: 'published',
  });
  await internship.save();

  console.log('✅ Seed complete!');
  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });