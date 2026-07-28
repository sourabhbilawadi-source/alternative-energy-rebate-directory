const fs = require('fs');

let content = fs.readFileSync('src/data/regions.ts', 'utf8');

// Replace the null values with 0
content = content.replace(/stateRebate:\s*null/g, 'stateRebate: 0');
content = content.replace(/utilityRebate:\s*null/g, 'utilityRebate: 0');
content = content.replace(/federalTaxCreditPct:\s*null/g, 'federalTaxCreditPct: 0');
content = content.replace(/costPerWatt:\s*null/g, 'costPerWatt: 0');
content = content.replace(/gridEmissions:\s*null/g, 'gridEmissions: 0');
content = content.replace(/sunHours:\s*null/g, 'sunHours: 0');
content = content.replace(/gridRate:\s*null/g, 'gridRate: 0');

// Replace the type definitions
content = content.replace(/gridRate:\s*number\s*\|\s*null;/g, 'gridRate: number;');
content = content.replace(/sunHours:\s*number\s*\|\s*null;/g, 'sunHours: number;');
content = content.replace(/gridEmissions:\s*number\s*\|\s*null;/g, 'gridEmissions: number;');
content = content.replace(/costPerWatt:\s*number\s*\|\s*null;/g, 'costPerWatt: number;');

content = content.replace(/federalTaxCreditPct:\s*number\s*\|\s*null;/g, 'federalTaxCreditPct: number;');
content = content.replace(/stateRebate:\s*number\s*\|\s*null;/g, 'stateRebate: number;');
content = content.replace(/utilityRebate:\s*number\s*\|\s*null;/g, 'utilityRebate: number;');

content = content.replace(/\/\/ Sizing\/rate parameters \(using null for TODO\/placeholder values\)/g, '// Sizing/rate parameters');
content = content.replace(/\/\/ Incentives \(using null for TODO\/placeholder values\)/g, '// Incentives');

fs.writeFileSync('src/data/regions.ts', content);
