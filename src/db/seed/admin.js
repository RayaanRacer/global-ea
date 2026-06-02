import { db } from "../index.js";
import { users, userLogin } from "../schema.js";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

async function seedAdmin() {
  try {
    const adminEmail = "admin@global.com";

    const existingAdmin = await db
      .select()
      .from(users)
      .where(eq(users.email, adminEmail));

    if (existingAdmin.length > 0) {
      console.log("Admin already exists");
      process.exit(0);
    }

    const [admin] = await db
      .insert(users)
      .values({
        uuid: randomUUID(),
        firstName: "Super",
        lastName: "Admin",
        email: adminEmail,
        phone: "9999999999",
        role: "ADMIN",
        status: "ACTIVE",
        isEmailVerified: true,
      })
      .$returningId();

    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    await db.insert(userLogin).values({
      userId: admin.id,
      email: adminEmail,
      password: hashedPassword,
    });

    console.log("Admin seeded successfully");
    console.log("Email:", adminEmail);
    console.log("Password: Admin@123");

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

seedAdmin();
