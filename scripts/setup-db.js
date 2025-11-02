#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function setupDatabase() {
  console.log('🚀 Setting up KolabIT database...');

  try {
    // Create some initial skills
    console.log('📚 Creating initial skills...');
    
    const skills = [
      // Programming Languages
      { name: 'JavaScript', category: 'Programming Languages', description: 'High-level programming language' },
      { name: 'TypeScript', category: 'Programming Languages', description: 'Typed superset of JavaScript' },
      { name: 'Python', category: 'Programming Languages', description: 'High-level programming language' },
      { name: 'Java', category: 'Programming Languages', description: 'Object-oriented programming language' },
      { name: 'C++', category: 'Programming Languages', description: 'General-purpose programming language' },
      { name: 'C#', category: 'Programming Languages', description: 'Microsoft programming language' },
      { name: 'Go', category: 'Programming Languages', description: 'Google programming language' },
      { name: 'Rust', category: 'Programming Languages', description: 'Systems programming language' },
      
      // Web Development
      { name: 'React', category: 'Web Development', description: 'JavaScript library for building user interfaces' },
      { name: 'Vue.js', category: 'Web Development', description: 'Progressive JavaScript framework' },
      { name: 'Angular', category: 'Web Development', description: 'TypeScript-based web application framework' },
      { name: 'Node.js', category: 'Web Development', description: 'JavaScript runtime environment' },
      { name: 'Express.js', category: 'Web Development', description: 'Web application framework for Node.js' },
      { name: 'Next.js', category: 'Web Development', description: 'React framework for production' },
      { name: 'HTML', category: 'Web Development', description: 'HyperText Markup Language' },
      { name: 'CSS', category: 'Web Development', description: 'Cascading Style Sheets' },
      { name: 'SASS', category: 'Web Development', description: 'CSS preprocessor' },
      
      // Mobile Development
      { name: 'React Native', category: 'Mobile Development', description: 'Framework for building mobile apps' },
      { name: 'Flutter', category: 'Mobile Development', description: 'UI toolkit for building mobile apps' },
      { name: 'Swift', category: 'Mobile Development', description: 'Apple programming language' },
      { name: 'Kotlin', category: 'Mobile Development', description: 'Android programming language' },
      
      // Data Science
      { name: 'Machine Learning', category: 'Data Science', description: 'AI subset focused on algorithms' },
      { name: 'Data Analysis', category: 'Data Science', description: 'Process of inspecting and modeling data' },
      { name: 'Pandas', category: 'Data Science', description: 'Python data manipulation library' },
      { name: 'NumPy', category: 'Data Science', description: 'Python numerical computing library' },
      { name: 'TensorFlow', category: 'Data Science', description: 'Machine learning framework' },
      { name: 'PyTorch', category: 'Data Science', description: 'Machine learning framework' },
      
      // Cloud & DevOps
      { name: 'AWS', category: 'Cloud & DevOps', description: 'Amazon Web Services' },
      { name: 'Docker', category: 'Cloud & DevOps', description: 'Containerization platform' },
      { name: 'Kubernetes', category: 'Cloud & DevOps', description: 'Container orchestration platform' },
      { name: 'Git', category: 'Cloud & DevOps', description: 'Version control system' },
      { name: 'CI/CD', category: 'Cloud & DevOps', description: 'Continuous Integration/Deployment' },
      
      // Design
      { name: 'UI/UX Design', category: 'Design', description: 'User interface and experience design' },
      { name: 'Figma', category: 'Design', description: 'Collaborative design tool' },
      { name: 'Adobe Photoshop', category: 'Design', description: 'Image editing software' },
      { name: 'Adobe Illustrator', category: 'Design', description: 'Vector graphics editor' },
      
      // Other
      { name: 'Project Management', category: 'Other', description: 'Planning and organizing projects' },
      { name: 'Public Speaking', category: 'Other', description: 'Speaking to audiences' },
      { name: 'Technical Writing', category: 'Other', description: 'Writing technical documentation' },
    ];

    for (const skill of skills) {
      await prisma.skill.upsert({
        where: { name: skill.name },
        update: skill,
        create: skill,
      });
    }

    console.log(`✅ Created ${skills.length} skills`);

    // Create some initial badges
    console.log('🏆 Creating initial badges...');
    
    const badges = [
      {
        name: 'First Steps',
        description: 'Complete your first project',
        icon: '🎯',
        category: 'ACHIEVEMENT',
        criteria: JSON.stringify({ type: 'FIRST_PROJECT' }),
      },
      {
        name: 'Resource Sharer',
        description: 'Upload your first resource',
        icon: '📚',
        category: 'ACHIEVEMENT',
        criteria: JSON.stringify({ type: 'FIRST_RESOURCE' }),
      },
      {
        name: 'Community Member',
        description: 'Create your first post',
        icon: '💬',
        category: 'ACHIEVEMENT',
        criteria: JSON.stringify({ type: 'FIRST_POST' }),
      },
      {
        name: 'Verified Student',
        description: 'Verify your email address',
        icon: '✅',
        category: 'SPECIAL',
        criteria: JSON.stringify({ type: 'VERIFIED_USER' }),
      },
      {
        name: 'Skill Master',
        description: 'Master 5 different skills',
        icon: '🎓',
        category: 'SKILL',
        criteria: JSON.stringify({ minSkills: 5 }),
      },
      {
        name: 'Contributor',
        description: 'Contribute to 3 projects',
        icon: '🤝',
        category: 'CONTRIBUTION',
        criteria: JSON.stringify({ minProjects: 3 }),
      },
      {
        name: 'Popular Resource',
        description: 'Get 100 downloads on a resource',
        icon: '⭐',
        category: 'ACHIEVEMENT',
        criteria: JSON.stringify({ minDownloads: 100 }),
      },
    ];

    for (const badge of badges) {
      await prisma.badge.upsert({
        where: { name: badge.name },
        update: badge,
        create: badge,
      });
    }

    console.log(`✅ Created ${badges.length} badges`);

    // Create a demo admin user
    console.log('👤 Creating demo admin user...');
    
    const hashedPassword = await bcrypt.hash('AdminPassword123!', 12);
    
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@kolabit.com' },
      update: {},
      create: {
        email: 'admin@kolabit.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        rollNumber: 'ADMIN001',
        department: 'Administration',
        year: 1,
        semester: 1,
        bio: 'System administrator for KolabIT platform',
        isVerified: true,
      },
    });

    console.log('✅ Created demo admin user (admin@kolabit.com)');

    console.log('🎉 Database setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Start the development server: npm run dev');
    console.log('2. Visit http://localhost:5000/health to check if the API is running');
    console.log('3. Use the admin credentials to test the platform');
    console.log('   Email: admin@kolabit.com');
    console.log('   Password: AdminPassword123!');

  } catch (error) {
    console.error('❌ Error setting up database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

setupDatabase();
