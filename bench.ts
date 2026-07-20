import { queryLocationSpecs } from './src/lib/energyApi.js'; // Note .js or .ts depending on runner
// Wait, I can run with vitest or node --experimental-transform-types

const run = async () => {
  console.log("Starting benchmark...");
  const start = performance.now();
  await queryLocationSpecs('New York', 'us');
  const mid = performance.now();
  await queryLocationSpecs('New York', 'us');
  const end = performance.now();

  console.log(`First call: ${mid - start}ms`);
  console.log(`Second call: ${end - mid}ms`);
}

run();
