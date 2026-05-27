import { config } from 'dotenv';
import { resolve } from 'path';
import { initializeDatabase, createAdminUser } from '../src/backend/config/database';

config({ path: resolve(process.cwd(), '.env') });

async function main() {
  try {
    console.log('🚀 Starting database initialization...\n');

    console.log('📊 Creating database schema...');
    await initializeDatabase();

    console.log('\n👤 Creating admin user...');
    await createAdminUser();

    console.log('\n✅ Database initialization completed successfully!');
    console.log('\n📝 Admin credentials:');
    console.log(`   Username: ${process.env.ADMIN_USERNAME}`);
    console.log(`   Password: ${process.env.ADMIN_PASSWORD}`);
    console.log('\n🎉 You can now start using the system!');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Database initialization failed:', error);
    process.exit(1);
  }
}

main();
