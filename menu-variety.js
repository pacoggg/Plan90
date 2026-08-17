// Rotación alimentaria ampliada para Paco y Montse.
// Se carga después de app-data.js y antes de app-main.js.
// Priorizamos platos compartidos con raciones diferentes y una pauta mediterránea baja en sal.

const menuRotationWeek = (() => {
  const now = new Date();
  const start = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
  const day = Math.floor((Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) - start) / 86400000) + 1;
  return Math.floor((day - 1) / 7) % 4;
})();

Object.assign(recipes, {
  avenaManzana: {
    title:'Avena con yogur, manzana y canela', time:'5 min', calories:355, protein:'20 g',
    ingredients:['250 g de yogur natural alto en proteína','35 g de copos de avena','1 manzana pequeña','10 g de nueces','Canela'],
    steps:['Pon el yogur y la avena en un bol.','Añade la manzana troceada.','Termina con nueces y canela.']
  },
  tostadaHuevoAguacate: {
    title:'Tostada integral con huevo, aguacate y fruta', time:'12 min', calories:405, protein:'22 g',
    ingredients:['70 g de pan integral','2 huevos','45 g de aguacate','Tomate','1 pieza de fruta'],
    steps:['Tuesta el pan y añade tomate.','Cocina los huevos a la plancha o cocidos.','Añade el aguacate y acompaña con fruta.']
  },
  porridgePlatano: {
    title:'Porridge de avena, plátano y canela', time:'8 min', calories:370, protein:'18 g',
    ingredients:['40 g de avena','250 ml de leche semidesnatada','1 plátano pequeño','10 g de almendras naturales','Canela'],
    steps:['Cuece avena y leche a fuego suave 5 minutos.','Añade el plátano en rodajas.','Termina con almendras y canela.']
  },
  lentejasVerduras: {
    title:'Lentejas con verduras y huevo', time:'25 min', calories:555, protein:'31 g',
    ingredients:['190 g de lentejas cocidas','2 huevos','250 g de zanahoria, pimiento, cebolla y calabacín','120 g de tomate triturado','2 cucharaditas de aceite de oliva','Laurel y pimentón'],
    steps:['Pocha las verduras con el aceite.','Añade tomate, lentejas y especias y cocina 10 minutos.','Sirve con los huevos cocidos o a la plancha.']
  },
  salmonBoniato: {
    title:'Salmón al horno con boniato y ensalada', time:'35 min', calories:610, protein:'42 g',
    ingredients:['180 g de salmón','230 g de boniato','Ensalada de hojas verdes, tomate y pepino','2 cucharaditas de aceite de oliva','Limón, ajo y eneldo'],
    steps:['Hornea el boniato 20 minutos a 200 °C.','Añade el salmón y hornea 12-15 minutos más.','Sirve con ensalada y limón.']
  },
  garbanzosBacalao: {
    title:'Garbanzos con espinacas y bacalao', time:'25 min', calories:565, protein:'39 g',
    ingredients:['180 g de garbanzos cocidos','160 g de bacalao desalado','180 g de espinacas','120 g de tomate triturado','2 cucharaditas de aceite de oliva','Ajo, comino y pimentón'],
    steps:['Cocina el bacalao y desmenúzalo.','Cocina tomate y espinacas con el aceite y las especias.','Añade garbanzos y bacalao y cocina 5 minutos.']
  },
  pavoCalabaza: {
    title:'Pavo a la plancha con calabaza asada y cuscús integral', time:'30 min', calories:575, protein:'48 g',
    ingredients:['180 g de pechuga de pavo','250 g de calabaza','65 g de cuscús integral en seco','200 g de verduras variadas','2 cucharaditas de aceite de oliva','Pimienta, ajo y limón'],
    steps:['Asa la calabaza y las verduras.','Hidrata el cuscús según el envase.','Cocina el pavo a la plancha y sirve todo junto.']
  },
  arrozMarisco: {
    title:'Arroz con marisco y verduras', time:'35 min', calories:585, protein:'38 g',
    ingredients:['75 g de arroz en crudo','180 g de gambas, calamar y mejillón','250 g de pimiento, cebolla, tomate y calabacín','2 cucharaditas de aceite de oliva','Ajo, pimentón y azafrán'],
    steps:['Sofríe las verduras con el aceite.','Añade arroz, agua o caldo casero sin exceso de sal y cocina.','Incorpora el marisco al final hasta que esté bien cocinado.']
  },
  pastaPollo: {
    title:'Pasta integral con pollo y verduras', time:'25 min', calories:600, protein:'46 g',
    ingredients:['75 g de pasta integral','170 g de pollo','250 g de calabacín, pimiento y cebolla','150 g de tomate triturado','2 cucharaditas de aceite de oliva'],
    steps:['Cuece la pasta.','Saltea pollo y verduras con el aceite.','Añade tomate, mezcla con la pasta y cocina 2 minutos.']
  },
  doradaHorno: {
    title:'Dorada al horno con patata, tomate y cebolla', time:'40 min', calories:535, protein:'43 g',
    ingredients:['200 g de dorada limpia','220 g de patata','180 g de tomate y cebolla','2 cucharaditas de aceite de oliva','Limón, ajo y perejil'],
    steps:['Hornea patata y cebolla 20 minutos a 200 °C.','Añade tomate y dorada.','Hornea 15-18 minutos más y sirve con limón.']
  },
  ensaladaLentejas: {
    title:'Ensalada templada de lentejas, huevo y verduras', time:'20 min', calories:520, protein:'30 g',
    ingredients:['190 g de lentejas cocidas','2 huevos','250 g de tomate, zanahoria, pimiento y hojas verdes','40 g de queso fresco','2 cucharaditas de aceite de oliva y vinagre'],
    steps:['Cuece los huevos.','Templa las lentejas y mezcla con las verduras.','Añade huevo, queso fresco y aliño medido.']
  },
  tortillaEspinacas: {
    title:'Tortilla de espinacas con tomate y patata', time:'25 min', calories:455, protein:'31 g',
    ingredients:['2 huevos y 150 g de claras','180 g de espinacas','170 g de patata cocida','Tomate aliñado','1 cucharadita de aceite de oliva'],
    steps:['Saltea las espinacas con el aceite.','Añade huevo y claras batidos y cuaja.','Sirve con patata cocida y tomate.']
  },
  polloLimon: {
    title:'Pollo al limón con verduras y patata', time:'35 min', calories:570, protein:'49 g',
    ingredients:['180 g de pollo','230 g de patata','280 g de brócoli, zanahoria y calabacín','2 cucharaditas de aceite de oliva','Limón, ajo, pimienta y romero'],
    steps:['Asa o cuece la patata y las verduras.','Dora el pollo con el aceite.','Añade limón, ajo y romero y termina la cocción.']
  },
  merluzaTomate: {
    title:'Merluza con tomate casero y patata', time:'30 min', calories:490, protein:'43 g',
    ingredients:['200 g de merluza','200 g de patata','200 g de tomate triturado','150 g de pimiento y cebolla','2 cucharaditas de aceite de oliva','Ajo y perejil'],
    steps:['Cocina cebolla, pimiento y tomate con el aceite.','Añade la merluza y cocina tapada 7-9 minutos.','Sirve con la patata cocida.']
  },
  hamburguesaCasera: {
    title:'Hamburguesa casera de pollo con patata y ensalada', time:'30 min', calories:565, protein:'47 g',
    ingredients:['180 g de carne picada de pollo o pavo','220 g de patata','Ensalada de tomate, lechuga y pepino','60 g de pan integral','1 cucharadita de aceite de oliva','Ajo, perejil y pimienta'],
    steps:['Forma la hamburguesa con ajo, perejil y pimienta.','Asa la patata en gajos y cocina la hamburguesa a la plancha.','Sirve en pan integral con ensalada, sin salsas saladas.']
  },
  fajitasPollo: {
    title:'Fajitas de pollo y verduras', time:'25 min', calories:575, protein:'45 g',
    ingredients:['170 g de pollo','2 tortillas integrales medianas','250 g de pimiento y cebolla','80 g de tomate','40 g de aguacate','1 cucharadita de aceite de oliva','Pimentón, comino y lima'],
    steps:['Saltea pollo, pimiento y cebolla con el aceite.','Calienta las tortillas.','Rellena con pollo, verduras, tomate y aguacate.']
  },
  cremaPescado: {
    title:'Crema de calabaza y pescado blanco a la plancha', time:'30 min', calories:455, protein:'41 g',
    ingredients:['350 g de calabaza, puerro y zanahoria','190 g de pescado blanco','120 g de patata','2 cucharaditas de aceite de oliva','Nuez moscada, ajo y limón'],
    steps:['Cuece calabaza, puerro, zanahoria y patata y tritura.','Cocina el pescado a la plancha.','Sirve con limón y el aceite medido.']
  },
  revueltoSetas: {
    title:'Revuelto de setas y gambas con pan integral', time:'18 min', calories:445, protein:'37 g',
    ingredients:['2 huevos y 120 g de claras','160 g de gambas','200 g de setas y champiñones','60 g de pan integral','1 cucharadita de aceite de oliva','Ajo y perejil'],
    steps:['Saltea setas y gambas con el aceite.','Añade huevos y claras batidos y remueve hasta cuajar.','Sirve con pan integral.']
  }
});

Object.assign(montseRecipes, {
  'Avena con yogur, manzana y canela': {time:'5 min', ingredients:['200 g de yogur natural','30 g de avena','1 manzana pequeña','8 g de nueces','Canela'], steps:['Mezcla yogur y avena.','Añade manzana troceada.','Termina con nueces y canela.']},
  'Tostada integral con huevo, aguacate y fruta': {time:'12 min', ingredients:['50 g de pan integral','1 huevo','35 g de aguacate','Tomate','1 pieza de fruta pequeña'], steps:['Tuesta el pan y añade tomate.','Cocina el huevo.','Añade aguacate y acompaña con fruta.']},
  'Porridge de avena, plátano y canela': {time:'8 min', ingredients:['30 g de avena','200 ml de leche semidesnatada','1/2-1 plátano pequeño','8 g de almendras','Canela'], steps:['Cuece avena y leche 5 minutos.','Añade el plátano.','Termina con almendras y canela.']},
  'Lentejas con verduras y huevo': {time:'25 min', ingredients:['160 g de lentejas cocidas','1 huevo','250 g de verduras','100 g de tomate triturado','1 cucharadita de aceite','Laurel y pimentón'], steps:['Cocina las verduras.','Añade tomate y lentejas.','Sirve con el huevo.']},
  'Salmón al horno con boniato y ensalada': {time:'35 min', ingredients:['140 g de salmón','170 g de boniato','Ensalada abundante','1 cucharadita de aceite','Limón y eneldo'], steps:['Hornea el boniato.','Añade el salmón 12-15 minutos.','Sirve con ensalada.']},
  'Garbanzos con espinacas y bacalao': {time:'25 min', ingredients:['155 g de garbanzos cocidos','120 g de bacalao desalado','180 g de espinacas','100 g de tomate triturado','1 cucharadita de aceite','Ajo y pimentón'], steps:['Cocina el bacalao.','Cocina tomate y espinacas.','Añade garbanzos y bacalao.']},
  'Pavo a la plancha con calabaza asada y cuscús integral': {time:'30 min', ingredients:['135 g de pavo','220 g de calabaza','50 g de cuscús integral','220 g de verduras','1 cucharadita de aceite'], steps:['Asa calabaza y verduras.','Hidrata el cuscús.','Cocina el pavo y sirve junto.']},
  'Arroz con marisco y verduras': {time:'35 min', ingredients:['55 g de arroz en crudo','150 g de marisco','250 g de verduras','1 cucharadita de aceite','Ajo, pimentón y azafrán'], steps:['Sofríe las verduras.','Añade arroz y líquido sin exceso de sal.','Incorpora el marisco al final.']},
  'Pasta integral con pollo y verduras': {time:'25 min', ingredients:['55 g de pasta integral','130 g de pollo','250 g de verduras','140 g de tomate triturado','1 cucharadita de aceite'], steps:['Cuece la pasta.','Saltea pollo y verduras.','Añade tomate y mezcla con la pasta.']},
  'Dorada al horno con patata, tomate y cebolla': {time:'40 min', ingredients:['150 g de dorada','170 g de patata','200 g de tomate y cebolla','1 cucharadita de aceite','Limón y perejil'], steps:['Hornea patata y cebolla.','Añade tomate y dorada.','Termina al horno y sirve con limón.']},
  'Ensalada templada de lentejas, huevo y verduras': {time:'20 min', ingredients:['160 g de lentejas cocidas','1 huevo','280 g de verduras','30 g de queso fresco','1 cucharadita de aceite y vinagre'], steps:['Cuece el huevo.','Mezcla lentejas y verduras.','Añade huevo, queso y aliño.']},
  'Tortilla de espinacas con tomate y patata': {time:'25 min', ingredients:['2 huevos','160 g de espinacas','140 g de patata','Tomate','1 cucharadita de aceite'], steps:['Saltea las espinacas.','Cuaja la tortilla.','Sirve con patata y tomate.']},
  'Pollo al limón con verduras y patata': {time:'35 min', ingredients:['135 g de pollo','170 g de patata','300 g de verduras','1 cucharadita de aceite','Limón, ajo y romero'], steps:['Cocina patata y verduras.','Dora el pollo.','Añade limón y romero.']},
  'Merluza con tomate casero y patata': {time:'30 min', ingredients:['150 g de merluza','160 g de patata','180 g de tomate triturado','180 g de pimiento y cebolla','1 cucharadita de aceite'], steps:['Cocina la salsa de tomate y verduras.','Añade la merluza.','Sirve con patata cocida.']},
  'Hamburguesa casera de pollo con patata y ensalada': {time:'30 min', ingredients:['130 g de pollo o pavo picado','160 g de patata','Ensalada abundante','40 g de pan integral','1 cucharadita de aceite'], steps:['Forma y cocina la hamburguesa.','Asa la patata.','Sirve con pan y ensalada.']},
  'Fajitas de pollo y verduras': {time:'25 min', ingredients:['130 g de pollo','1 tortilla integral grande','260 g de pimiento y cebolla','Tomate','30 g de aguacate','1 cucharadita de aceite'], steps:['Saltea pollo y verduras.','Calienta la tortilla.','Rellena con tomate y aguacate.']},
  'Crema de calabaza y pescado blanco a la plancha': {time:'30 min', ingredients:['350 g de calabaza, puerro y zanahoria','150 g de pescado blanco','100 g de patata','1 cucharadita de aceite','Limón'], steps:['Cuece y tritura las verduras con la patata.','Cocina el pescado a la plancha.','Sirve con limón.']},
  'Revuelto de setas y gambas con pan integral': {time:'18 min', ingredients:['2 huevos','120 g de gambas','220 g de setas','40 g de pan integral','1 cucharadita de aceite'], steps:['Saltea setas y gambas.','Añade los huevos batidos.','Sirve con pan integral.']},
  'Yogur con avena, fruta y nueces': {time:'5 min', ingredients:['200 g de yogur natural alto en proteína','30 g de avena','1 fruta pequeña','10 g de nueces'], steps:['Mezcla el yogur y la avena.','Añade fruta.','Termina con nueces.']},
  'Tostadas integrales con tomate y pavo': {time:'8 min', ingredients:['55 g de pan integral','Tomate','55 g de pavo con poca sal','1 cucharadita de aceite','1 fruta pequeña'], steps:['Tuesta el pan.','Añade tomate, pavo y aceite medido.','Acompaña con fruta.']},
  'Fruta y yogur natural': {time:'2 min', ingredients:['1 fruta mediana','1 yogur natural'], steps:['Lava o pela la fruta.','Sirve con el yogur.']},
  'Fruta y queso fresco': {time:'3 min', ingredients:['1 fruta mediana','70 g de queso fresco'], steps:['Trocea la fruta.','Sirve con el queso fresco.']},
  'Yogur y frutos secos': {time:'2 min', ingredients:['1 yogur natural','10 g de frutos secos naturales sin sal'], steps:['Sirve el yogur.','Acompaña con los frutos secos.']}
});

const pacoBreakfasts = [
  ['Desayuno','Yogur con avena, fruta y nueces','yogurAvena'],
  ['Desayuno','Tostadas integrales con tomate y pavo','tostadasPavo'],
  ['Desayuno','Avena con yogur, manzana y canela','avenaManzana'],
  ['Desayuno','Tostada integral con huevo, aguacate y fruta','tostadaHuevoAguacate'],
  ['Desayuno','Porridge de avena, plátano y canela','porridgePlatano']
];
const pacoSnacks = [
  ['Merienda','Fruta y yogur natural',''],
  ['Merienda','Fruta y queso fresco',''],
  ['Merienda','Yogur natural y 15 g de frutos secos sin sal',''],
  ['Merienda','Una fruta y 15 g de almendras naturales','']
];

const sharedWeeks = [
  [
    ['polloHorno','cremaPescado'],['lentejasVerduras','merluzaPapillote'],['arrozMarisco','tortillaEspinacas'],['pastaPollo','ensaladaLentejas'],['salmonBoniato','cremaTortilla'],['hamburguesaCasera','revueltoSetas'],['garbanzosBacalao','merluzaTomate']
  ],
  [
    ['pavoCalabaza','tortillaCalabacin'],['garbanzosBacalao','cremaPescado'],['polloLimon','ensaladaAtun'],['arrozPollo','revueltoSetas'],['doradaHorno','cremaTortilla'],['fajitasPollo','tortillaEspinacas'],['lentejasVerduras','merluzaPapillote']
  ],
  [
    ['pastaAtun','cremaPescado'],['arrozMarisco','tortillaCalabacin'],['polloHorno','ensaladaLentejas'],['lentejasVerduras','merluzaTomate'],['salmonBoniato','cremaTortilla'],['pavoCalabaza','revueltoSetas'],['doradaHorno','tortillaEspinacas']
  ],
  [
    ['garbanzosBacalao','cremaPescado'],['polloLimon','tortillaCalabacin'],['arrozPollo','merluzaPapillote'],['pastaPollo','ensaladaLentejas'],['doradaHorno','revueltoSetas'],['fajitasPollo','cremaTortilla'],['hamburguesaCasera','merluzaTomate']
  ]
];

const montseCalories = {
  polloHorno:500, cremaPescado:390, lentejasVerduras:470, merluzaPapillote:400, arrozMarisco:490, tortillaEspinacas:390,
  pastaPollo:500, ensaladaLentejas:430, salmonBoniato:500, cremaTortilla:390, hamburguesaCasera:490, revueltoSetas:390,
  garbanzosBacalao:490, merluzaTomate:400, pavoCalabaza:490, tortillaCalabacin:390, polloLimon:490, ensaladaAtun:400,
  arrozPollo:500, doradaHorno:450, fajitasPollo:480, pastaAtun:490
};

const montseRecipeTitleByKey = {
  polloHorno:'Pollo al horno con patata y verduras', cremaPescado:'Crema de calabaza y pescado blanco a la plancha',
  lentejasVerduras:'Lentejas con verduras y huevo', merluzaPapillote:'Merluza, patata cocida y verduras', arrozMarisco:'Arroz con marisco y verduras',
  tortillaEspinacas:'Tortilla de espinacas con tomate y patata', pastaPollo:'Pasta integral con pollo y verduras', ensaladaLentejas:'Ensalada templada de lentejas, huevo y verduras',
  salmonBoniato:'Salmón al horno con boniato y ensalada', cremaTortilla:'Crema de verduras y tortilla', hamburguesaCasera:'Hamburguesa casera de pollo con patata y ensalada',
  revueltoSetas:'Revuelto de setas y gambas con pan integral', garbanzosBacalao:'Garbanzos con espinacas y bacalao', merluzaTomate:'Merluza con tomate casero y patata',
  pavoCalabaza:'Pavo a la plancha con calabaza asada y cuscús integral', tortillaCalabacin:'Tortilla de espinacas con tomate y patata', polloLimon:'Pollo al limón con verduras y patata',
  ensaladaAtun:'Ensalada completa de atún, huevo y patata', arrozPollo:'Pollo a la plancha, arroz integral y verduras', doradaHorno:'Dorada al horno con patata, tomate y cebolla',
  fajitasPollo:'Fajitas de pollo y verduras', pastaAtun:'Pasta integral con atún, tomate y calabacín'
};

const montseBreakfasts = [
  ['Desayuno','Yogur con avena, fruta y nueces · 340 kcal',''],
  ['Desayuno','Tostadas integrales con tomate y pavo · 340 kcal',''],
  ['Desayuno','Avena con yogur, manzana y canela · 340 kcal',''],
  ['Desayuno','Tostada integral con huevo, aguacate y fruta · 350 kcal',''],
  ['Desayuno','Porridge de avena, plátano y canela · 350 kcal','']
];
const montseSnacks = [
  ['Merienda','Fruta y yogur natural · 150 kcal',''],
  ['Merienda','Fruta y queso fresco · 150 kcal',''],
  ['Merienda','Yogur y frutos secos · 150 kcal','']
];

function applyRotatingMenus() {
  const pairs = sharedWeeks[menuRotationWeek];
  menuDays.forEach((day, index) => {
    const [lunchKey, dinnerKey] = pairs[index];
    const breakfast = pacoBreakfasts[(index + menuRotationWeek) % pacoBreakfasts.length];
    const snack = pacoSnacks[(index + menuRotationWeek) % pacoSnacks.length];
    weeklyMenu[day] = [
      [...breakfast],
      ['Comida', recipes[lunchKey].title, lunchKey],
      [...snack],
      ['Cena', recipes[dinnerKey].title, dinnerKey]
    ];

    const mBreakfast = montseBreakfasts[(index + menuRotationWeek) % montseBreakfasts.length];
    const mSnack = montseSnacks[(index + menuRotationWeek) % montseSnacks.length];
    const lunchTitle = montseRecipeTitleByKey[lunchKey] || recipes[lunchKey].title;
    const dinnerTitle = montseRecipeTitleByKey[dinnerKey] || recipes[dinnerKey].title;
    montseMenu[day] = [
      [...mBreakfast],
      ['Comida', `${lunchTitle} · ${montseCalories[lunchKey] || 480} kcal`, ''],
      [...mSnack],
      ['Cena', `${dinnerTitle} · ${montseCalories[dinnerKey] || 400} kcal`, '']
    ];
  });
}

applyRotatingMenus();
