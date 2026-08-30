import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

interface StudentDocument {
  _id: mongoose.Types.ObjectId;
  skills?: unknown[];
}

async function migrateSkills(): Promise<void> {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI is required');
  }

  await mongoose.connect(mongoUri);

  const students = mongoose.connection.collection('students');
  const profiles = await students.find({ skills: { $elemMatch: { $type: 'string' } } }).toArray();

  if (profiles.length === 0) {
    console.log('No legacy skill records found. Nothing to migrate.');
    return;
  }

  const operations = profiles.map((profile) => {
    const skills = (profile as StudentDocument).skills?.map((skill) => {
      if (typeof skill === 'string') {
        return {
          name: skill.trim(),
          category: 'Other',
          level: 'Beginner',
          verified: false,
        };
      }

      return skill;
    });

    return {
      updateOne: {
        filter: { _id: profile._id },
        update: { $set: { skills } },
      },
    };
  });

  const result = await students.bulkWrite(operations);
  console.log(`Migrated skills for ${result.modifiedCount} student profile(s).`);
}

migrateSkills()
  .catch((error) => {
    console.error('Skill migration failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
