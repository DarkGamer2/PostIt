// This is a one-time script! Run it once to hash all plain text passwords.
import { db } from "@/app/lib/db";
import bcrypt from "bcryptjs";

async function hashAllPlainPasswords() {
  const users = await db.user.findMany();
  for (const user of users) {
    // If the password is already hashed, skip (bcrypt hashes start with $2)
    if (user.password.startsWith("$2")) continue;
    const hashed = await bcrypt.hash(user.password, 10);
    await db.user.update({
      where: { id: user.id },
      data: { password: hashed },
    });
    console.log(`Updated password for user: ${user.email}`);
  }
}

hashAllPlainPasswords().then(() => {
  console.log("All passwords hashed!");
  process.exit(0);
});