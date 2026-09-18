import slugifyLib from 'slugify';

/**
 * Generate a URL-safe slug from a string
 */
export const generateSlug = (text) => {
  return slugifyLib(text, { lower: true, strict: true, trim: true });
};

/**
 * Generate a unique slug by appending a number if needed
 */
export const generateUniqueSlug = async (text, model, prisma, field = 'slug', existingId = null) => {
  let slug = generateSlug(text);
  let counter = 1;

  while (true) {
    const where = { [field]: slug };
    if (existingId) {
      where.NOT = { id: existingId };
    }

    const existing = await prisma[model].findFirst({ where });
    if (!existing) return slug;

    slug = `${generateSlug(text)}-${counter}`;
    counter++;
  }
};
