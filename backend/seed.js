const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');
const Session = require('./models/Session');
const Review = require('./models/Review');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/senior_connect';

const sampleMentors = [
  {
    name: 'Sarah Jenkins',
    email: 'sarah@google.com',
    password: 'password123',
    role: 'mentor',
    domain: 'Software Engineering',
    company: 'Google',
    experienceYears: 6,
    skills: ['React', 'Node.js', 'System Design', 'TypeScript', 'GraphQL'],
    bio: 'Senior Software Engineer at Google with 6+ years in frontend architecture and distributed systems. Passionate about helping students crack coding interviews and resume reviews.',
    isAvailable: true,
    rating: 4.9,
    numReviews: 12,
  },
  {
    name: 'David Chen',
    email: 'david@amazon.com',
    password: 'password123',
    role: 'mentor',
    domain: 'AI/ML',
    company: 'Amazon',
    experienceYears: 5,
    skills: ['Python', 'PyTorch', 'Machine Learning', 'Computer Vision', 'MLOps'],
    bio: 'Applied Scientist working on NLP and computer vision systems. I can guide you through ML project portfolio preparation and technical interview strategies.',
    isAvailable: true,
    rating: 4.8,
    numReviews: 9,
  },
  {
    name: 'Priya Sharma',
    email: 'priya@microsoft.com',
    password: 'password123',
    role: 'mentor',
    domain: 'Cloud',
    company: 'Microsoft',
    experienceYears: 4,
    skills: ['Azure', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform'],
    bio: 'Cloud Solution Architect specializing in DevOps pipelines and cloud migration. Happy to mentor aspiring cloud developers and DevOps engineers.',
    isAvailable: true,
    rating: 5.0,
    numReviews: 7,
  },
  {
    name: 'Alex Rivera',
    email: 'alex@student.edu',
    password: 'password123',
    role: 'student',
    bio: 'Final year CS undergrad interested in full-stack web development.',
  },
];

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Session.deleteMany({});
    await Review.deleteMany({});
    console.log('Cleared existing data.');

    // Hash passwords and insert users
    const salt = await bcrypt.genSalt(10);
    const usersToInsert = await Promise.all(
      sampleMentors.map(async (u) => {
        const hashedPassword = await bcrypt.hash(u.password, salt);
        return { ...u, password: hashedPassword };
      })
    );

    const createdUsers = await User.insertMany(usersToInsert);
    console.log(`Inserted ${createdUsers.length} sample users.`);

    const student = createdUsers.find((u) => u.role === 'student');
    const mentor1 = createdUsers.find((u) => u.email === 'sarah@google.com');

    // Create a sample review
    if (student && mentor1) {
      await Review.create({
        mentor: mentor1._id,
        student: student._id,
        rating: 5,
        comment: 'Sarah gave incredible feedback on my resume and suggested great system design study resources!',
      });

      // Create a sample session
      await Session.create({
        mentor: mentor1._id,
        student: student._id,
        topic: 'Resume Review & Mock Tech Screen',
        date: '2026-10-05',
        time: '15:00',
        status: 'upcoming',
        notes: 'Prepare questions about frontend performance optimization.',
        meetingLink: 'https://meet.google.com/senior-demo-link',
      });
      console.log('Created sample review and session.');
    }

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
