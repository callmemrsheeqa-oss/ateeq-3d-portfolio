import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { db, pool } from '../../src/db/index.ts';
import { adminUsers } from '../../src/db/schema.ts';
import { hashPassword } from '../utils/crypto.ts';

async function main() {
  const emailArg = process.argv[2] || process.env.ADMIN_INITIAL_EMAIL;
  const passArg = process.argv[3] || process.env.ADMIN_INITIAL_PASSWORD;

  if (!emailArg || !passArg) {
    console.error(
      'Usage: npx tsx server/scripts/createAdmin.ts <email> <password> (or set ADMIN_INITIAL_EMAIL and ADMIN_INITIAL_PASSWORD)',
    );
    process.exit(1);
  }

  const email = emailArg.trim().toLowerCase();
  if (passArg.length < 10) {
    console.error('Password must be at least 10 characters long.');
    process.exit(1);
  }

  const passwordHash = hashPassword(passArg);
  const existing = await db.select().from(adminUsers).where(eq(adminUsers.email, email));

  if (existing.length === 0) {
    await db.insert(adminUsers).values({
      email,
      displayName: 'Ateeq Ur Rehman',
      passwordHash,
      role: 'admin',
      isActive: true,
    });
    console.log(`Created admin user for ${email}.`);
  } else {
    await db
      .update(adminUsers)
      .set({ passwordHash, isActive: true, updatedAt: new Date() })
      .where(eq(adminUsers.id, existing[0].id));
    console.log(`Updated admin password for ${email}.`);
  }

  await pool.end();
}

main().catch((err) => {
  console.error('Admin setup failed:', err);
  process.exit(1);
});
