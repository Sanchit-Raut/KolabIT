const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedDatabase() {
  console.log('🌱 Seeding database with initial data...');

  try {
    // Create skills
    const skills = await prisma.skill.createMany({
      data: [
        { name: 'JavaScript', category: 'Programming', description: 'JavaScript programming language' },
        { name: 'TypeScript', category: 'Programming', description: 'TypeScript programming language' },
        { name: 'React', category: 'Frontend', description: 'React.js library' },
        { name: 'Node.js', category: 'Backend', description: 'Node.js runtime' },
        { name: 'Python', category: 'Programming', description: 'Python programming language' },
        { name: 'Java', category: 'Programming', description: 'Java programming language' },
        { name: 'C++', category: 'Programming', description: 'C++ programming language' },
        { name: 'SQL', category: 'Database', description: 'Structured Query Language' },
        { name: 'MongoDB', category: 'Database', description: 'MongoDB database' },
        { name: 'PostgreSQL', category: 'Database', description: 'PostgreSQL database' },
        { name: 'Docker', category: 'DevOps', description: 'Containerization platform' },
        { name: 'AWS', category: 'Cloud', description: 'Amazon Web Services' },
        { name: 'Git', category: 'Version Control', description: 'Version control system' },
        { name: 'Linux', category: 'Operating System', description: 'Linux operating system' },
        { name: 'Machine Learning', category: 'AI/ML', description: 'Machine Learning algorithms' }
      ],
      skipDuplicates: true
    });

    console.log(`✅ Created ${skills.count} skills`);

    // Create badges
    const badges = await prisma.badge.createMany({
      data: [
        { name: 'First Project', description: 'Created your first project', category: 'PROJECT', icon: '🏆', criteria: JSON.stringify({ type: 'PROJECT_COUNT', value: 1 }) },
        { name: 'Skill Master', description: 'Mastered 5 skills', category: 'SKILL', icon: '🎯', criteria: JSON.stringify({ type: 'SKILL_COUNT', value: 5 }) },
        { name: 'Resource Sharer', description: 'Shared 10 resources', category: 'RESOURCE', icon: '📚', criteria: JSON.stringify({ type: 'RESOURCE_COUNT', value: 10 }) },
        { name: 'Community Helper', description: 'Helped 20 community members', category: 'COMMUNITY', icon: '🤝', criteria: JSON.stringify({ type: 'HELP_COUNT', value: 20 }) },
        { name: 'Collaborator', description: 'Joined 5 projects', category: 'COLLABORATION', icon: '👥', criteria: JSON.stringify({ type: 'JOIN_COUNT', value: 5 }) },
        { name: 'Expert', description: 'Achieved expert level in any skill', category: 'SKILL', icon: '⭐', criteria: JSON.stringify({ type: 'PROFICIENCY_LEVEL', value: 'EXPERT' }) },
        { name: 'Mentor', description: 'Mentored 10 users', category: 'LEADERSHIP', icon: '👨‍🏫', criteria: JSON.stringify({ type: 'MENTOR_COUNT', value: 10 }) },
        { name: 'Innovator', description: 'Created innovative project', category: 'INNOVATION', icon: '💡', criteria: JSON.stringify({ type: 'INNOVATION_SCORE', value: 100 }) }
      ],
      skipDuplicates: true
    });

    console.log(`✅ Created ${badges.count} badges`);

    // Create a test user
    const testUser = await prisma.user.upsert({
      where: { email: 'test@kolabit.com' },
      update: {},
      create: {
        email: 'test@kolabit.com',
        password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/5.8.2.', // password: TestPass123!
        firstName: 'Test',
        lastName: 'User',
        rollNumber: 'TEST001',
        department: 'Computer Science',
        year: 3,
        semester: 5,
        isVerified: true
      }
    });

    console.log(`✅ Created test user: ${testUser.email}`);

    // Create admin user
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@kolabit.com' },
      update: {},
      create: {
        email: 'admin@kolabit.com',
        password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/5.8.2.', // password: AdminPass123!
        firstName: 'Admin',
        lastName: 'User',
        rollNumber: 'ADMIN001',
        department: 'Administration',
        year: 4,
        semester: 8,
        isVerified: true
      }
    });

    console.log(`✅ Created admin user: ${adminUser.email}`);

    // Add some skills to test user
    const skillIds = await prisma.skill.findMany({
      select: { id: true, name: true },
      take: 5
    });

    for (const skill of skillIds) {
      await prisma.userSkill.create({
        data: {
          userId: testUser.id,
          skillId: skill.id,
          proficiency: 'INTERMEDIATE',
          yearsOfExp: 2,
          endorsements: Math.floor(Math.random() * 10)
        }
      });
    }

    console.log(`✅ Added ${skillIds.length} skills to test user`);

    // Create a test project
    const testProject = await prisma.project.create({
      data: {
        title: 'Test E-commerce Website',
        description: 'A full-stack e-commerce platform built with React and Node.js',
        type: 'ACADEMIC',
        status: 'ACTIVE',
        maxMembers: 4,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        ownerId: testUser.id
      }
    });

    console.log(`✅ Created test project: ${testProject.title}`);

    // Add required skills to project
    const projectSkills = skillIds.slice(0, 3);
    for (const skill of projectSkills) {
      await prisma.projectSkill.create({
        data: {
          projectId: testProject.id,
          skillId: skill.id
        }
      });
    }

    console.log(`✅ Added ${projectSkills.length} required skills to project`);

    // Create a test resource
    const testResource = await prisma.resource.create({
      data: {
        title: 'JavaScript Fundamentals Notes',
        description: 'Comprehensive notes on JavaScript fundamentals',
        type: 'PDF',
        fileUrl: '/uploads/test-resource.pdf',
        fileName: 'test-resource.pdf',
        fileSize: 1024000,
        subject: 'Programming',
        semester: 3,
        uploaderId: testUser.id,
        downloads: 0
      }
    });

    console.log(`✅ Created test resource: ${testResource.title}`);

    // Create a test post
    const testPost = await prisma.post.create({
      data: {
        title: 'Looking for React Study Group',
        content: 'Anyone interested in forming a React study group for the upcoming semester?',
        type: 'DISCUSSION',
        tags: ['React', 'Study Group', 'Frontend'],
        authorId: testUser.id
      }
    });

    console.log(`✅ Created test post: ${testPost.title}`);

    console.log('🎉 Database seeding completed successfully!');
    console.log('');
    console.log('📊 Summary:');
    console.log(`- Skills: ${skills.count}`);
    console.log(`- Badges: ${badges.count}`);
    console.log(`- Users: 2 (test@kolabit.com, admin@kolabit.com)`);
    console.log(`- Projects: 1`);
    console.log(`- Resources: 1`);
    console.log(`- Posts: 1`);
    console.log('');
    console.log('🔑 Test Credentials:');
    console.log('- Email: test@kolabit.com, Password: TestPass123!');
    console.log('- Email: admin@kolabit.com, Password: AdminPass123!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();
