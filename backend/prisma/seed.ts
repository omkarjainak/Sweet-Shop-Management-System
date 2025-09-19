import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("superadminpassword", 10);

  await prisma.user.upsert({
    where: { email: "superadmin@example.com" },
    update: {},
    create: {
      name: "Super Admin",
      email: "superadmin@example.com",
      password: hashedPassword,
      role: "superadmin",
    },
  });
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
