const { performance } = require('perf_hooks');

const generateData = (n) => {
  return Array.from({ length: n }, (_, i) => ({ name: `City${i}` }));
};

const initialCities = generateData(10000);
const formattedLocal = generateData(10000).map(c => ({ name: c.name + (Math.random() > 0.5 ? '' : '_new') }));

const runUnoptimized = () => {
  const merged = [...initialCities];
  formattedLocal.forEach(localCity => {
    if (!merged.some(c => c.name.toLowerCase() === localCity.name.toLowerCase())) {
      merged.push(localCity);
    }
  });
  return merged.length;
};

const runOptimized = () => {
  const merged = [...initialCities];
  const existingNames = new Set(merged.map(c => c.name.toLowerCase()));
  formattedLocal.forEach(localCity => {
    const lowerName = localCity.name.toLowerCase();
    if (!existingNames.has(lowerName)) {
      merged.push(localCity);
      existingNames.add(lowerName);
    }
  });
  return merged.length;
};

const start1 = performance.now();
runUnoptimized();
const end1 = performance.now();

const start2 = performance.now();
runOptimized();
const end2 = performance.now();

console.log(`Unoptimized: ${end1 - start1} ms`);
console.log(`Optimized: ${end2 - start2} ms`);
