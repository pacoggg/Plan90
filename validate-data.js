import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync('app-data.js', 'utf8') + '\nthis.__menu=montseMenu;this.__recipes=montseRecipes;';
const context = {localStorage:{getItem(){ return null; }}};
vm.createContext(context);
vm.runInContext(source, context);

const titles = [...new Set(Object.values(context.__menu).flat().map(row => row[1].replace(/ · \d+ kcal$/, '')))];
const missing = titles.filter(title => !context.__recipes[title]);
const invalid = titles.filter(title => {
  const recipe = context.__recipes[title];
  return recipe && (!recipe.time || !recipe.ingredients?.length || !recipe.steps?.length);
});

if (missing.length || invalid.length) {
  console.error({missing, invalid});
  process.exit(1);
}

console.log(`OK: ${titles.length} recetas únicas cubren las 28 comidas del menú de Montse.`);
