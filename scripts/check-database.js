const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDatabase() {
  console.log('🔍 Checking database status...');

  try {
    // Check skills
    const skillCount = await prisma.skill.count();
    console.log(`📊 Skills: ${skillCount}`);

    // Check badges
    const badgeCount = await prisma.badge.count();
    console.log(`🏆 Badges: ${badgeCount}`);

    // Check users
    const userCount = await prisma.user.count();
    console.log(`👥 Users: ${userCount}`);

    // Check projects
    const projectCount = await prisma.project.count();
    console.log(`📁 Projects: ${projectCount}`);

    // Check resources
    const resourceCount = await prisma.resource.count();
    console.log(`📚 Resources: ${resourceCount}`);

    // Check posts
    const postCount = await prisma.post.count();
    console.log(`💬 Posts: ${postCount}`);

    // Check user skills
    const userSkillCount = await prisma.userSkill.count();
    console.log(`🎯 User Skills: ${userSkillCount}`);

    console.log('');
    console.log('✅ Database is ready for testing!');
    console.log('');
    console.log('🔑 Test Credentials:');
    console.log('- Email: test@kolabit.com, Password: TestPass123!');
    console.log('- Email: admin@kolabit.com, Password: AdminPass123!');

  } catch (error) {
    console.error('❌ Error checking database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
