
import { PrismaClient } from '@prisma/client';
import { parseExcelData } from '../lib/excel';
import path from 'path';

const prisma = new PrismaClient();

// Mapeo de países a URLs de mapas de ubicación geográfica
const countryMapImages: Record<string, string> = {
  // Europa
  'España': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Europe_on_the_globe_%28red%29.svg/500px-Europe_on_the_globe_%28red%29.svg.png',
  'Francia': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Europe_on_the_globe_%28red%29.svg/500px-Europe_on_the_globe_%28red%29.svg.png',
  'Italia': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Europe_on_the_globe_%28red%29.svg/500px-Europe_on_the_globe_%28red%29.svg.png',
  'Alemania': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Europe_on_the_globe_%28red%29.svg/500px-Europe_on_the_globe_%28red%29.svg.png',
  'Reino Unido': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Europe_on_the_globe_%28red%29.svg/500px-Europe_on_the_globe_%28red%29.svg.png',
  'Países Bajos': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Europe_on_the_globe_%28red%29.svg/500px-Europe_on_the_globe_%28red%29.svg.png',
  'Suiza': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Europe_on_the_globe_%28red%29.svg/500px-Europe_on_the_globe_%28red%29.svg.png',
  'Austria': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Europe_on_the_globe_%28red%29.svg/500px-Europe_on_the_globe_%28red%29.svg.png',
  'Grecia': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Europe_on_the_globe_%28red%29.svg/500px-Europe_on_the_globe_%28red%29.svg.png',
  'Portugal': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Europe_on_the_globe_%28red%29.svg/500px-Europe_on_the_globe_%28red%29.svg.png',
  
  // América del Norte
  'Estados Unidos': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/North_America_on_the_globe_%28red%29.svg/500px-North_America_on_the_globe_%28red%29.svg.png',
  'Canadá': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/North_America_on_the_globe_%28red%29.svg/500px-North_America_on_the_globe_%28red%29.svg.png',
  'México': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/North_America_on_the_globe_%28red%29.svg/500px-North_America_on_the_globe_%28red%29.svg.png',
  
  // Asia
  'Japón': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Asia_on_the_globe_%28red%29.svg/500px-Asia_on_the_globe_%28red%29.svg.png',
  'China': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Asia_on_the_globe_%28red%29.svg/500px-Asia_on_the_globe_%28red%29.svg.png',
  'Corea del Sur': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Asia_on_the_globe_%28red%29.svg/500px-Asia_on_the_globe_%28red%29.svg.png',
  'Tailandia': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Asia_on_the_globe_%28red%29.svg/500px-Asia_on_the_globe_%28red%29.svg.png',
  'India': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Asia_on_the_globe_%28red%29.svg/500px-Asia_on_the_globe_%28red%29.svg.png',
  'Emiratos Árabes Unidos': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Asia_on_the_globe_%28red%29.svg/500px-Asia_on_the_globe_%28red%29.svg.png',
  
  // Oceanía
  'Australia': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Oceania_on_the_globe_%28red%29.svg/500px-Oceania_on_the_globe_%28red%29.svg.png',
  'Nueva Zelanda': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Oceania_on_the_globe_%28red%29.svg/500px-Oceania_on_the_globe_%28red%29.svg.png',
  
  // América del Sur
  'Argentina': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/South_America_%28orthographic_projection%29.svg/500px-South_America_%28orthographic_projection%29.svg.png',
  'Brasil': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/South_America_%28orthographic_projection%29.svg/500px-South_America_%28orthographic_projection%29.svg.png',
  'Chile': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/South_America_%28orthographic_projection%29.svg/500px-South_America_%28orthographic_projection%29.svg.png',
  'Perú': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/South_America_%28orthographic_projection%29.svg/500px-South_America_%28orthographic_projection%29.svg.png',
  'Colombia': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/South_America_%28orthographic_projection%29.svg/500px-South_America_%28orthographic_projection%29.svg.png',
};

function getCountryImageUrl(country: string): string {
  return countryMapImages[country] || 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Equirectangular_projection_SW.jpg/500px-Equirectangular_projection_SW.jpg';
}

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');
  
  try {
    // Limpiar datos existentes
    console.log('🧹 Limpiando datos existentes...');
    await prisma.tripForm.deleteMany();
    await prisma.destination.deleteMany();
    await prisma.currency.deleteMany();
    await prisma.appConfig.deleteMany();
    
    // Parsear datos del Excel
    const excelPath = path.join(process.cwd(), 'data', 'Dinamica_Presupuesto_Viajero1234566.xlsx');
    console.log('📊 Parseando archivo Excel...');
    const excelData = await parseExcelData(excelPath);
    
    // Insertar currencies
    console.log('💱 Insertando currencies...');
    const currencyPromises = excelData.currencies.map(currency =>
      prisma.currency.create({
        data: {
          symbol: currency.symbol,
          isoCode: currency.isoCode,
          realExchangeRate: currency.realExchangeRate,
          paddedRate: currency.paddedRate
        }
      })
    );
    
    const createdCurrencies = await Promise.all(currencyPromises);
    console.log(`✅ ${createdCurrencies.length} currencies insertadas`);
    
    // Crear un mapa de símbolos a IDs de currencies
    const currencyMap = new Map();
    createdCurrencies.forEach(currency => {
      currencyMap.set(currency.symbol, currency.id);
    });
    
    // Insertar destinations
    console.log('🏝️ Insertando destinations...');
    const destinationPromises = excelData.destinations.map(destination => {
      const currencyId = currencyMap.get(destination.currency.symbol);
      if (!currencyId) {
        console.warn(`⚠️ Currency no encontrada para ${destination.country}: ${destination.currency.symbol}`);
        return null;
      }
      
      // Usar imagen de Unsplash en lugar de la URL del Excel
      const imageUrl = getCountryImageUrl(destination.country);
      
      return prisma.destination.create({
        data: {
          continent: destination.continent,
          country: destination.country,
          city: destination.city,
          currencyId,
          realExchangeRate: destination.realExchangeRate,
          paddedExchangeRate: destination.paddedExchangeRate,
          imageUrl: imageUrl,
          housingCost: destination.housingCost,
          foodCost: destination.foodCost,
          transportCost: destination.transportCost,
          entertainmentCost: destination.entertainmentCost,
          insuranceCost: destination.insuranceCost,
          flightCost: destination.flightCost,
          communicationCost: destination.communicationCost,
          activitiesCost: destination.activitiesCost,
          extrasCost: destination.extrasCost,
          contingencyPercent: destination.contingencyPercent,
          bankFeesCost: destination.bankFeesCost,
          totalMonthlyLocal: destination.totalMonthlyLocal,
          totalMonthlyMxnReal: destination.totalMonthlyMxnReal,
          totalMonthlyMxnPadded: destination.totalMonthlyMxnPadded
        }
      });
    }).filter(promise => promise !== null);
    
    const createdDestinations = await Promise.all(destinationPromises);
    console.log(`✅ ${createdDestinations.length} destinations insertadas`);
    
    // Insertar configuraciones de la app
    console.log('⚙️ Insertando configuraciones...');
    await prisma.appConfig.createMany({
      data: [
        {
          key: 'transfer_cost_mxn',
          value: '200',
          description: 'Costo de transferencia internacional en MXN'
        },
        {
          key: 'exchange_rate_benefit_percent',
          value: '0.05',
          description: 'Porcentaje de beneficio en tipo de cambio (5%)'
        },
        {
          key: 'annual_interest_rate',
          value: '0.05',
          description: 'Tasa de interés anual para rendimientos (5%)'
        },
        {
          key: 'cashback_rate',
          value: '0.03',
          description: 'Porcentaje de cashback (3%)'
        }
      ]
    });
    
    console.log('🎉 Seed completado exitosamente!');
    
    // Mostrar estadísticas
    const totalCurrencies = await prisma.currency.count();
    const totalDestinations = await prisma.destination.count();
    const totalConfigs = await prisma.appConfig.count();
    
    console.log(`📊 Estadísticas finales:`);
    console.log(`   - Currencies: ${totalCurrencies}`);
    console.log(`   - Destinations: ${totalDestinations}`);
    console.log(`   - Configuraciones: ${totalConfigs}`);
    
  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
