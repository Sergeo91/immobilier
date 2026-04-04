/**
 * Prisma Seed - Achat Location SaaS
 * Crée : 1 Super Admin, 3 propriétaires, 5 propriétés, 3 clients, 1 pays, 1 ville
 */

import { PrismaClient, UserRole, PropertyStatus, PropertyType } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Démarrage du seed...');

  // Password hash commun pour demo (argon2id)
  const demoPassword = await argon2.hash('Demo123!@#', {
    type: argon2.argon2id,
    memoryCost: 65536,
    timeCost: 3,
  });

  // 1. Créer le pays et la ville
  const country = await prisma.country.upsert({
    where: { code: 'FR' },
    create: {
      code: 'FR',
      name: 'France',
      nameFr: 'France',
      nameEn: 'France',
      nameZh: '法国',
      nameEs: 'Francia',
      nameAr: 'فرنسا',
      isActive: true,
    },
    update: {},
  });

  let city = await prisma.city.findFirst({
    where: { slug: 'paris', countryId: country.id },
  });
  if (!city) {
    city = await prisma.city.create({
      data: {
        name: 'Paris',
        nameFr: 'Paris',
        slug: 'paris',
        countryId: country.id,
      },
    });
  }

  // 2. Super Admin
  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@achat-location.com' },
    create: {
      email: 'superadmin@achat-location.com',
      passwordHash: demoPassword,
      firstName: 'Super',
      lastName: 'Admin',
      role: UserRole.SUPER_ADMIN,
      emailVerified: true,
      kycVerified: true,
    },
    update: {},
  });

  // 3. Propriétaires demo
  const owners = await Promise.all([
    prisma.user.upsert({
      where: { email: 'owner1@demo.com' },
      create: {
        email: 'owner1@demo.com',
        passwordHash: demoPassword,
        firstName: 'Jean',
        lastName: 'Dupont',
        phone: '+33612345678',
        role: UserRole.OWNER,
        emailVerified: true,
        kycVerified: true,
      },
      update: {},
    }),
    prisma.user.upsert({
      where: { email: 'owner2@demo.com' },
      create: {
        email: 'owner2@demo.com',
        passwordHash: demoPassword,
        firstName: 'Marie',
        lastName: 'Martin',
        phone: '+33687654321',
        role: UserRole.OWNER,
        emailVerified: true,
        kycVerified: true,
      },
      update: {},
    }),
    prisma.user.upsert({
      where: { email: 'owner3@demo.com' },
      create: {
        email: 'owner3@demo.com',
        passwordHash: demoPassword,
        firstName: 'Pierre',
        lastName: 'Bernard',
        role: UserRole.OWNER,
        emailVerified: true,
        kycVerified: false,
      },
      update: {},
    }),
  ]);

  // 4. Clients demo
  const clients = await Promise.all([
    prisma.user.upsert({
      where: { email: 'client1@demo.com' },
      create: {
        email: 'client1@demo.com',
        passwordHash: demoPassword,
        firstName: 'Sophie',
        lastName: 'Durand',
        role: UserRole.CLIENT,
        emailVerified: true,
      },
      update: {},
    }),
    prisma.user.upsert({
      where: { email: 'client2@demo.com' },
      create: {
        email: 'client2@demo.com',
        passwordHash: demoPassword,
        firstName: 'Lucas',
        lastName: 'Petit',
        role: UserRole.CLIENT,
        emailVerified: true,
      },
      update: {},
    }),
    prisma.user.upsert({
      where: { email: 'client3@demo.com' },
      create: {
        email: 'client3@demo.com',
        passwordHash: demoPassword,
        firstName: 'Emma',
        lastName: 'Moreau',
        role: UserRole.CLIENT,
        emailVerified: false,
      },
      update: {},
    }),
  ]);

  // 5. Propriétés demo
  const propertyData = [
    {
      title: 'Appartement lumineux au cœur de Paris',
      type: PropertyType.APARTMENT,
      price: 1200,
      surfaceArea: 45,
      isFurnished: true,
      ownerId: owners[0].id,
    },
    {
      title: 'Studio meublé Montmartre',
      type: PropertyType.APARTMENT,
      price: 850,
      surfaceArea: 25,
      isFurnished: true,
      ownerId: owners[0].id,
    },
    {
      title: 'Maison avec jardin - Banlieue',
      type: PropertyType.HOUSE,
      price: 1800,
      surfaceArea: 120,
      isFurnished: false,
      ownerId: owners[1].id,
    },
    {
      title: 'Terrain constructible - IDF',
      type: PropertyType.LAND,
      price: 150000,
      surfaceArea: 500,
      isFurnished: false,
      ownerId: owners[1].id,
    },
    {
      title: 'Chambre dans colocation',
      type: PropertyType.ROOM,
      price: 550,
      surfaceArea: 15,
      isFurnished: true,
      ownerId: owners[2].id,
    },
  ];

  for (let i = 0; i < propertyData.length; i++) {
    const p = propertyData[i];
    const slug = `property-${i + 1}-${Date.now()}`;
    await prisma.property.create({
      data: {
        slug,
        title: p.title,
        description: `Description détaillée de ${p.title}. Bien situé, proche des transports.`,
        type: p.type,
        status: PropertyStatus.AVAILABLE,
        price: p.price,
        surfaceArea: p.surfaceArea,
        isFurnished: p.isFurnished,
        address: `${10 + i} Rue de Demo, Paris`,
        neighborhood: i % 2 === 0 ? 'Centrum' : 'Montmartre',
        postalCode: '75001',
        latitude: 48.8566 + (i * 0.01),
        longitude: 2.3522 + (i * 0.01),
        countryId: country.id,
        cityId: city.id,
        durationType: p.type === PropertyType.LAND ? null : 'LONG',
        ownerId: p.ownerId,
      },
    });
  }

  // 6. Settings par défaut
  const existingSettings = await prisma.settings.findUnique({ where: { key: 'global' } });
  const prevValue =
    existingSettings?.value && typeof existingSettings.value === 'object' && !Array.isArray(existingSettings.value)
      ? (existingSettings.value as Record<string, unknown>)
      : {};
  await prisma.settings.upsert({
    where: { key: 'global' },
    create: {
      key: 'global',
      value: { defaultCurrency: 'XOF' },
      defaultTrialDurationDays: 14,
      isGlobalTrialEnabled: true,
      commissionPercentage: 5,
      globalTheme: 'dark',
      maintenanceMode: false,
    },
    update: {
      value: { ...prevValue, defaultCurrency: 'XOF' },
    },
  });

  console.log('✅ Seed terminé avec succès !');
  console.log('Super Admin:', superAdmin.email);
  console.log('Propriétaires:', owners.map((o) => o.email).join(', '));
  console.log('Clients:', clients.map((c) => c.email).join(', '));
  console.log('Mot de passe demo: Demo123!@#');
}

main()
  .catch((e) => {
    console.error('❌ Erreur seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
