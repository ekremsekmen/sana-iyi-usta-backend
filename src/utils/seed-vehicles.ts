// ARAÇ VERİLERİNİ PRISMA İLE VERİTABANINA YÜKLEMEK İÇİN KULLANDIĞIMIZ KOD



/* import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { v5 as uuidv5 } from 'uuid';

const prisma = new PrismaClient();

// Sabit bir namespace UUID'si (değiştirmeyin)
const NAMESPACE = '8d88e160-4e55-40d6-aaaa-e590abd39679';

// ID'den tutarlı UUID oluşturan yardımcı fonksiyon
function createUuidFromId(id: string | number): string {
  return uuidv5(id.toString(), NAMESPACE);
}

async function main() {
  const jsonData = fs.readFileSync(
    path.join(process.cwd(), 'arabalar.json'),
    'utf8'
  );
  const data = JSON.parse(jsonData);

  // Markalar için
  for (const marka of data.markalar) {
    const brandUuid = createUuidFromId(marka.id);
    
    const brand = await prisma.brands.upsert({
      where: { id: brandUuid },
      update: { name: marka.name },
      create: {
        id: brandUuid,
        name: marka.name,
      },
    });

    // Modeller için
    for (const model of marka.modeller) {
      const modelUuid = createUuidFromId(model.id);
      
      await prisma.models.upsert({
        where: { id: modelUuid },
        update: { name: model.name },
        create: {
          id: modelUuid,
          name: model.name,
          brand_id: brand.id,
        },
      });

      // Yıllar için
      for (const yil of model.yillar) {
        const yearUuid = createUuidFromId(yil.id);
        
        const modelYear = await prisma.model_years.upsert({
          where: { id: yearUuid },
          update: { year: parseInt(yil.name) },
          create: {
            id: yearUuid,
            year: parseInt(yil.name),
            model_id: modelUuid,
          },
        });

        // Varyantlar için
        for (const arac of yil.araclar) {
          const variantUuid = createUuidFromId(arac.id);
          
          await prisma.variants.upsert({
            where: { id: variantUuid },
            update: { name: arac.name },
            create: {
              id: variantUuid,
              name: arac.name,
              model_year_id: modelYear.id,
            },
          });
        }
      }
    }
  }

  console.log('Araç verileri başarıyla yüklendi!');
}

main()
  .catch((e) => {
    console.error('Hata:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

  */