import { prisma } from "../prismaClient.js";

// Sweet type
interface SweetData {
  name: string;
  category: string;
  price: number;
  quantity: number;
}

// Add new sweet
export const addSweet = async (name: string, category: string, price: number, quantity: number) => {
  return prisma.sweet.create({ data: { name, category, price, quantity } });
};

// Get all sweets
export const getAllSweets = async () => {
  return prisma.sweet.findMany();
};

// Search sweets
export const searchSweets = async (query: any) => {
  const { name, category, minPrice, maxPrice } = query;
  const where: any = {};

  if (name !== undefined) {
    where.name = { contains: String(name), mode: "insensitive" };
  }
  if (category !== undefined) {
    where.category = { contains: String(category), mode: "insensitive" };
  }
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = Number(minPrice);
    if (maxPrice !== undefined) where.price.lte = Number(maxPrice);
  }

  return prisma.sweet.findMany({ where });
};

// Update sweet
export const updateSweet = async (id: number, data: Partial<SweetData>) => {
  return prisma.sweet.update({ where: { id }, data });
};

// Delete sweet
export const deleteSweet = async (id: number) => {
  return prisma.sweet.delete({ where: { id } });
};

// Purchase sweet
export const purchaseSweet = async (id: number, quantity: number) => {
  return prisma.$transaction(async (tx) => {
    const sweet = await tx.sweet.findUnique({ where: { id }, select: { id: true, quantity: true } });
    if (!sweet) throw new Error("Sweet not found");
    if (sweet.quantity < quantity) throw new Error("Insufficient stock");

    return tx.sweet.update({
      where: { id },
      data: {
        quantity: { decrement: quantity }, // atomic decrement
      },
    });
  });
};


// Restock sweet
export const restockSweet = async (id: number, quantity: number) => {
  const sweet = await prisma.sweet.findUnique({ where: { id } });
  if (!sweet) throw new Error("Sweet not found");

  return prisma.sweet.update({ where: { id }, data: { quantity: sweet.quantity + quantity } });
};
