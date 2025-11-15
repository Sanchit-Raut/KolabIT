/**
 * Migration script to update project status from PLANNING to RECRUITING
 */

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateProjectStatus() {
  try {
    console.log('🔄 Starting status migration...');
    
    // Update all projects with PLANNING status to RECRUITING
    const result = await prisma.project.updateMany({
      where: {
        status: 'PLANNING'
      },
      data: {
        status: 'RECRUITING'
      }
    });

    console.log(`✅ Updated ${result.count} project(s) from PLANNING to RECRUITING`);
    
    // Show updated projects
    const projects = await prisma.project.findMany({
      where: {
        status: 'RECRUITING'
      },
      select: {
        id: true,
        title: true,
        status: true
      }
    });

    console.log('\n📊 Projects with RECRUITING status:');
    projects.forEach(project => {
      console.log(`  - ${project.title} (${project.status})`);
    });

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

updateProjectStatus()
  .then(() => {
    console.log('\n✅ Migration completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  });
