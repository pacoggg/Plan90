const profiles = {
  yo: {name:'Paco', startWeight:98.5, targetWeight:89.9, storageKey:'plan90Data', note:'Plan personal de pérdida de peso.'},
  montse: {name:'Montse', startWeight:73, targetWeight:65, storageKey:'plan90DataMontse', note:'Inicio suave: fuerza, movilidad y caminatas adaptadas.'}
};

const days = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
const menuDays = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];

const recipes = {
  yogurAvena: {
    title: 'Yogur con avena, fruta y nueces', time: '5 min', calories: 360, protein: '19 g',
    ingredients: ['250 g de yogur natural alto en proteína','35 g de copos de avena','1 pieza de fruta','15 g de nueces','Canela al gusto'],
    steps: ['Pon el yogur en un cuenco.','Añade la avena y la fruta troceada.','Termina con las nueces y la canela.']
  },
  tostadasPavo: {
    title: 'Tostadas integrales con tomate y pavo', time: '8 min', calories: 390, protein: '25 g',
    ingredients: ['70 g de pan integral','1 tomate maduro','80 g de pechuga de pavo con poca sal','1 cucharadita de aceite de oliva','Café o infusión'],
    steps: ['Tuesta el pan.','Ralla o corta el tomate y repártelo.','Añade el pavo y el aceite medido.']
  },
  polloHorno: {
    title: 'Pollo al horno con patata y verduras', time: '45 min', calories: 590, protein: '48 g',
    ingredients: ['180 g de pechuga o contramuslo de pollo sin piel','250 g de patata','150 g de pimiento y cebolla','1 cucharada de aceite de oliva','Pimentón, ajo y pimienta'],
    steps: ['Calienta el horno a 200 °C.','Corta patata y verduras, mezcla con la mitad del aceite y hornea 20 minutos.','Añade el pollo sazonado y el resto del aceite. Hornea 20-25 minutos más.']
  },
  merluzaPapillote: {
    title: 'Merluza en papillote con verduras', time: '30 min', calories: 470, protein: '42 g',
    ingredients: ['200 g de merluza','250 g de calabacín, zanahoria y cebolla','180 g de patata cocida','1 cucharada de aceite de oliva','Limón, ajo y perejil'],
    steps: ['Coloca las verduras finas sobre papel de horno.','Pon encima la merluza, limón, ajo y aceite.','Cierra el paquete y hornea 18-20 minutos a 190 °C. Sirve con la patata.']
  },
  tortillaCalabacin: {
    title: 'Tortilla de calabacín', time: '25 min', calories: 430, protein: '29 g',
    ingredients: ['2 huevos y 150 g de claras','250 g de calabacín','50 g de cebolla','1 cucharadita de aceite','40 g de pan integral'],
    steps: ['Pocha el calabacín y la cebolla con el aceite.','Bate los huevos y las claras.','Mezcla y cuaja la tortilla a fuego medio. Sirve con el pan.']
  },
  garbanzos: {
    title: 'Garbanzos con espinacas y huevo', time: '20 min', calories: 560, protein: '30 g',
    ingredients: ['180 g de garbanzos cocidos escurridos','150 g de espinacas','2 huevos','100 g de tomate triturado','1 cucharada de aceite','Comino y pimentón'],
    steps: ['Saltea las espinacas con el aceite.','Añade tomate, garbanzos y especias; cocina 8 minutos.','Corona con dos huevos a la plancha o cocidos.']
  },
  arrozPollo: {
    title: 'Arroz salteado con pollo y verduras', time: '30 min', calories: 610, protein: '44 g',
    ingredients: ['170 g de pollo','70 g de arroz en crudo','250 g de verduras variadas','1 cucharada de aceite','Pimienta, ajo y salsa de soja baja en sal opcional'],
    steps: ['Cuece el arroz.','Dora el pollo en tiras y reserva.','Saltea las verduras, incorpora pollo y arroz y mezcla dos minutos.']
  },
  pastaAtun: {
    title: 'Pasta integral con atún y tomate', time: '25 min', calories: 585, protein: '40 g',
    ingredients: ['75 g de pasta integral seca','1 lata grande de atún al natural escurrido','200 g de tomate triturado','150 g de calabacín o berenjena','1 cucharada de aceite'],
    steps: ['Cuece la pasta al dente.','Cocina la verdura y el tomate con el aceite.','Añade el atún y mezcla con la pasta.']
  },
  cremaTortilla: {
    title: 'Crema de verduras y tortilla francesa', time: '25 min', calories: 410, protein: '28 g',
    ingredients: ['350 g de calabacín, puerro y zanahoria','2 huevos y 100 g de claras','1 cucharadita de aceite','40 g de pan integral'],
    steps: ['Cuece las verduras y tritura sin añadir nata.','Prepara una tortilla con huevos y claras.','Sirve con el pan integral.']
  },
  ensaladaAtun: {
    title: 'Ensalada completa de atún y huevo', time: '15 min', calories: 480, protein: '38 g',
    ingredients: ['200 g de tomate, lechuga y pepino','1 lata grande de atún al natural','2 huevos cocidos','120 g de patata cocida','1 cucharada de aceite y vinagre'],
    steps: ['Trocea las verduras y la patata.','Añade el atún y los huevos.','Aliña con aceite medido y vinagre.']
  }
};

const weeklyMenu = {
  Lunes: [
    ['Desayuno','Yogur con avena, fruta y nueces','yogurAvena'],
    ['Comida','Pollo al horno con patata y verduras','polloHorno'],
    ['Merienda','Fruta o yogur natural',''],
    ['Cena','Crema de verduras y tortilla francesa','cremaTortilla']
  ],
  Martes: [
    ['Desayuno','Tostadas integrales con tomate y pavo','tostadasPavo'],
    ['Comida','Garbanzos con espinacas y huevo','garbanzos'],
    ['Merienda','15 g de frutos secos y una fruta',''],
    ['Cena','Merluza en papillote con verduras','merluzaPapillote']
  ],
  Miércoles: [
    ['Desayuno','Yogur con avena, fruta y nueces','yogurAvena'],
    ['Comida','Arroz salteado con pollo y verduras','arrozPollo'],
    ['Merienda','Queso fresco o yogur natural',''],
    ['Cena','Tortilla de calabacín','tortillaCalabacin']
  ],
  Jueves: [
    ['Desayuno','Tostadas integrales con tomate y pavo','tostadasPavo'],
    ['Comida','Pasta integral con atún y tomate','pastaAtun'],
    ['Merienda','Fruta',''],
    ['Cena','Ensalada completa de atún y huevo','ensaladaAtun']
  ],
  Viernes: [
    ['Desayuno','Yogur con avena, fruta y nueces','yogurAvena'],
    ['Comida','Merluza en papillote con verduras','merluzaPapillote'],
    ['Merienda','Yogur y una fruta',''],
    ['Cena','Crema de verduras y tortilla francesa','cremaTortilla']
  ],
  Sábado: [
    ['Desayuno','Tostadas integrales con tomate y pavo','tostadasPavo'],
    ['Comida','Pollo al horno con patata y verduras','polloHorno'],
    ['Merienda','Fruta o 15 g de nueces',''],
    ['Cena','Ensalada completa de atún y huevo','ensaladaAtun']
  ],
  Domingo: [
    ['Desayuno','Yogur con avena, fruta y nueces','yogurAvena'],
    ['Comida','Arroz salteado con pollo y verduras','arrozPollo'],
    ['Merienda','Opcional según hambre',''],
    ['Cena','Tortilla de calabacín','tortillaCalabacin']
  ]
};

const montseMenu = {
  Lunes:[['Desayuno','Yogur natural alto en proteína, avena, frutos rojos y nueces · 350 kcal',''],['Comida','Lentejas con verduras, huevo y ensalada · 480 kcal',''],['Merienda','Fruta y queso fresco · 150 kcal',''],['Cena','Merluza, patata cocida y verduras · 400 kcal','']],
  Martes:[['Desayuno','Tostada integral con tomate, pavo y fruta · 340 kcal',''],['Comida','Pollo a la plancha, arroz integral y verduras · 500 kcal',''],['Merienda','Yogur natural y 10 almendras · 160 kcal',''],['Cena','Crema de calabacín y tortilla francesa · 390 kcal','']],
  Miércoles:[['Desayuno','Porridge de avena con leche o bebida enriquecida y plátano · 350 kcal',''],['Comida','Garbanzos con espinacas y bacalao · 490 kcal',''],['Merienda','Fruta y yogur · 150 kcal',''],['Cena','Ensalada completa de atún, huevo y patata · 400 kcal','']],
  Jueves:[['Desayuno','Yogur, fruta, avena y semillas · 350 kcal',''],['Comida','Pasta integral con atún, tomate y calabacín · 500 kcal',''],['Merienda','Queso fresco con fruta · 150 kcal',''],['Cena','Salteado de tofu o pollo con verduras · 390 kcal','']],
  Viernes:[['Desayuno','Tostada integral, aguacate, huevo y fruta · 360 kcal',''],['Comida','Salmón al horno, boniato y ensalada · 500 kcal',''],['Merienda','Yogur y nueces · 160 kcal',''],['Cena','Verduras salteadas con garbanzos · 380 kcal','']],
  Sábado:[['Desayuno','Avena con yogur, manzana y canela · 350 kcal',''],['Comida','Pollo al horno con patata y verduras · 500 kcal',''],['Merienda','Fruta y queso fresco · 150 kcal',''],['Cena','Crema de verduras y tortilla · 390 kcal','']],
  Domingo:[['Desayuno','Tostada integral con tomate, pavo y fruta · 340 kcal',''],['Comida','Arroz con pollo o legumbre y verduras · 500 kcal',''],['Merienda','Yogur natural · 130 kcal',''],['Cena','Pescado blanco, verduras y patata · 400 kcal','']]
};

const montseRecipes = {
  'Yogur natural alto en proteína, avena, frutos rojos y nueces': {time:'5 min', ingredients:['200 g de yogur natural alto en proteína','30 g de copos de avena','100 g de frutos rojos','15 g de nueces','Canela al gusto'], steps:['Pon el yogur en un cuenco.','Añade la avena y los frutos rojos.','Termina con las nueces y la canela.']},
  'Lentejas con verduras, huevo y ensalada': {time:'20 min', ingredients:['180 g de lentejas cocidas escurridas','1 huevo','200 g de zanahoria, calabacín y pimiento','Ensalada de hojas verdes y tomate','1 cucharadita de aceite de oliva','Pimentón y laurel'], steps:['Cuece el huevo durante 10 minutos.','Saltea las verduras con el aceite, añade las lentejas y las especias y cocina 8 minutos.','Sirve con el huevo troceado y la ensalada.']},
  'Fruta y queso fresco': {time:'3 min', ingredients:['1 pieza de fruta mediana','80 g de queso fresco'], steps:['Lava o pela la fruta.','Sirve junto al queso fresco.']},
  'Merluza, patata cocida y verduras': {time:'25 min', ingredients:['150 g de merluza','180 g de patata','250 g de calabacín, zanahoria y judías verdes','1 cucharadita de aceite de oliva','Limón y perejil'], steps:['Cuece la patata y las verduras hasta que estén tiernas.','Cocina la merluza a la plancha o al vapor con limón y perejil.','Sirve con el aceite medido.']},
  'Tostada integral con tomate, pavo y fruta': {time:'8 min', ingredients:['60 g de pan integral','1 tomate maduro','60 g de pechuga de pavo con poca sal','1 pieza de fruta','1 cucharadita de aceite de oliva'], steps:['Tuesta el pan y ralla el tomate.','Reparte tomate, aceite y pavo sobre el pan.','Acompaña con la fruta.']},
  'Pollo a la plancha, arroz integral y verduras': {time:'30 min', ingredients:['140 g de pechuga de pollo','55 g de arroz integral en crudo','250 g de verduras variadas','1 cucharadita de aceite de oliva','Ajo, pimienta y limón'], steps:['Cuece el arroz según el envase.','Saltea las verduras con la mitad del aceite.','Cocina el pollo a la plancha con el resto del aceite y sirve todo junto.']},
  'Yogur natural y 10 almendras': {time:'2 min', ingredients:['1 yogur natural de 125-150 g','10 almendras naturales'], steps:['Sirve el yogur frío.','Añade o acompaña con las almendras.']},
  'Crema de calabacín y tortilla francesa': {time:'25 min', ingredients:['350 g de calabacín, puerro y zanahoria','2 huevos','40 g de pan integral','1 cucharadita de aceite de oliva'], steps:['Cuece las verduras y tritúralas con parte del agua.','Bate los huevos y cuaja la tortilla con el aceite.','Sirve con la crema y el pan.']},
  'Porridge de avena con leche o bebida enriquecida y plátano': {time:'8 min', ingredients:['35 g de copos de avena','200 ml de leche semidesnatada o bebida vegetal enriquecida','1 plátano pequeño','Canela al gusto'], steps:['Calienta la leche con la avena 5 minutos, removiendo.','Retira cuando espese.','Añade el plátano en rodajas y canela.']},
  'Garbanzos con espinacas y bacalao': {time:'25 min', ingredients:['160 g de garbanzos cocidos escurridos','120 g de bacalao desalado','150 g de espinacas','100 g de tomate triturado','1 cucharadita de aceite de oliva','Ajo, pimentón y comino'], steps:['Cocina el bacalao y desmenúzalo sin espinas.','Sofríe ajo y tomate con el aceite; añade especias y espinacas.','Incorpora garbanzos y bacalao y cocina 4 minutos.']},
  'Fruta y yogur': {time:'3 min', ingredients:['1 pieza de fruta mediana','1 yogur natural de 125-150 g'], steps:['Lava o pela la fruta.','Sirve junto al yogur.']},
  'Ensalada completa de atún, huevo y patata': {time:'20 min', ingredients:['1 lata de atún al natural escurrido','1 huevo','150 g de patata','Tomate, lechuga y pepino','1 cucharadita de aceite y vinagre'], steps:['Cuece la patata y el huevo, deja enfriar y trocea.','Mezcla las verduras con patata, atún y huevo.','Aliña antes de servir.']},
  'Yogur, fruta, avena y semillas': {time:'5 min', ingredients:['200 g de yogur natural','1 pieza de fruta','30 g de copos de avena','10 g de semillas de chía o lino molido'], steps:['Pon el yogur en un cuenco.','Añade fruta troceada y avena.','Espolvorea las semillas.']},
  'Pasta integral con atún, tomate y calabacín': {time:'25 min', ingredients:['60 g de pasta integral seca','1 lata de atún al natural escurrido','180 g de tomate triturado','150 g de calabacín','1 cucharadita de aceite de oliva'], steps:['Cuece la pasta al dente.','Saltea el calabacín con el aceite y añade el tomate 8 minutos.','Incorpora el atún y mezcla con la pasta.']},
  'Queso fresco con fruta': {time:'3 min', ingredients:['80 g de queso fresco','1 pieza de fruta mediana'], steps:['Trocea la fruta si es necesario.','Sirve con el queso fresco.']},
  'Salteado de tofu o pollo con verduras': {time:'20 min', ingredients:['150 g de tofu firme o 130 g de pollo','300 g de pimiento, calabacín, cebolla y brócoli','1 cucharadita de aceite de oliva','1 cucharadita de salsa de soja baja en sal','Jengibre o ajo'], steps:['Corta el tofu o pollo y las verduras.','Dora la proteína con el aceite y reserva.','Saltea las verduras, reincorpora la proteína y añade la soja.']},
  'Tostada integral, aguacate, huevo y fruta': {time:'12 min', ingredients:['50 g de pan integral','40 g de aguacate','1 huevo','1 pieza de fruta','Tomate o limón al gusto'], steps:['Cuece o cocina el huevo a la plancha.','Tuesta el pan y extiende el aguacate.','Añade el huevo y acompaña con fruta.']},
  'Salmón al horno, boniato y ensalada': {time:'35 min', ingredients:['140 g de salmón','180 g de boniato','Ensalada de hojas verdes, tomate y pepino','1 cucharadita de aceite de oliva','Limón, eneldo y pimienta'], steps:['Hornea el boniato troceado 20 minutos a 200 °C.','Añade el salmón sazonado y hornea 12-15 minutos más.','Sirve con la ensalada y el aceite medido.']},
  'Yogur y nueces': {time:'2 min', ingredients:['1 yogur natural de 125-150 g','15 g de nueces'], steps:['Sirve el yogur.','Añade las nueces troceadas.']},
  'Verduras salteadas con garbanzos': {time:'18 min', ingredients:['160 g de garbanzos cocidos escurridos','300 g de calabacín, pimiento, cebolla y champiñón','1 cucharadita de aceite de oliva','Ajo, comino y pimentón'], steps:['Corta y saltea las verduras con el aceite 8-10 minutos.','Añade garbanzos y especias.','Cocina 4 minutos más, removiendo.']},
  'Avena con yogur, manzana y canela': {time:'5 min', ingredients:['200 g de yogur natural','35 g de copos de avena','1 manzana pequeña','Canela al gusto'], steps:['Pon yogur y avena en un cuenco.','Añade la manzana troceada.','Espolvorea canela y mezcla.']},
  'Pollo al horno con patata y verduras': {time:'45 min', ingredients:['140 g de pollo sin piel','180 g de patata','250 g de pimiento, cebolla y calabacín','1 cucharadita de aceite de oliva','Pimentón, ajo y pimienta'], steps:['Hornea patata y verduras con el aceite 20 minutos a 200 °C.','Añade el pollo sazonado.','Hornea 20-25 minutos más hasta que esté bien cocinado.']},
  'Crema de verduras y tortilla': {time:'25 min', ingredients:['350 g de calabacín, puerro y zanahoria','2 huevos','40 g de pan integral','1 cucharadita de aceite de oliva'], steps:['Cuece y tritura las verduras sin nata.','Bate los huevos y cuaja una tortilla con el aceite.','Sirve con el pan integral.']},
  'Arroz con pollo o legumbre y verduras': {time:'30 min', ingredients:['55 g de arroz en crudo','130 g de pollo o 160 g de legumbre cocida','250 g de verduras variadas','1 cucharadita de aceite de oliva','Ajo, pimienta y pimentón'], steps:['Cuece el arroz.','Saltea las verduras y el pollo; si eliges legumbre, añádela al final.','Incorpora el arroz y mezcla 2 minutos.']},
  'Yogur natural': {time:'1 min', ingredients:['1 yogur natural de 125-150 g'], steps:['Sirve el yogur frío, sin azúcar añadido.']},
  'Pescado blanco, verduras y patata': {time:'25 min', ingredients:['150 g de pescado blanco','160 g de patata','250 g de verduras variadas','1 cucharadita de aceite de oliva','Limón, ajo y perejil'], steps:['Cuece o asa la patata y las verduras.','Cocina el pescado a la plancha, horno o vapor.','Sirve con limón, perejil y el aceite medido.']}
};

const strengthExercises = [
  {name:'Sentarse y levantarse de una silla', reps:'12 repeticiones', seconds:40, visual:'chair', cue:'Apoya los pies, inclina ligeramente el tronco y sube soltando el aire.'},
  {name:'Flexiones contra la pared', reps:'12 repeticiones', seconds:40, visual:'wall', cue:'Cuerpo recto, manos a la altura del pecho y codos ligeramente hacia abajo.'},
  {name:'Puente de glúteos', reps:'15 repeticiones', seconds:45, visual:'bridge', cue:'Aprieta glúteos arriba sin arquear la zona lumbar.'},
  {name:'Zancada corta con apoyo', reps:'8 por pierna', seconds:50, visual:'lunge', cue:'Sujétate a una silla y baja poco, manteniendo la rodilla alineada.'},
  {name:'Bird-dog', reps:'8 por lado', seconds:50, visual:'bird', cue:'Extiende brazo y pierna contrarios sin girar la cadera.'},
  {name:'Plancha inclinada en mesa', reps:'20 segundos', seconds:20, visual:'plank', cue:'Respira con normalidad y mantén abdomen firme.'},
  {name:'Elevación de talones', reps:'18 repeticiones', seconds:40, visual:'calf', cue:'Sube despacio sobre las puntas y baja de forma controlada.'}
];

const weeklyWorkouts = [
  {day:'Lunes', type:'Fuerza', detail:'2 vueltas · 20-25 minutos', exercises: strengthExercises},
  {day:'Martes', type:'Caminar', detail:'30 minutos a ritmo vivo', exercises: []},
  {day:'Miércoles', type:'Fuerza', detail:'2 vueltas · 20-25 minutos', exercises: strengthExercises},
  {day:'Jueves', type:'Caminar', detail:'30 minutos a ritmo vivo', exercises: []},
  {day:'Viernes', type:'Fuerza', detail:'2 vueltas · 20-25 minutos', exercises: strengthExercises},
  {day:'Sábado', type:'Caminar', detail:'35-45 minutos', exercises: []},
  {day:'Domingo', type:'Descanso activo', detail:'Paseo suave opcional', exercises: []}
];

const montseExercises = [
  {name:'Sentarse y levantarse de una silla', reps:'8 repeticiones', seconds:35, visual:'chair', cue:'Pies apoyados y espalda larga. Sube sin impulso y baja despacio.'},
  {name:'Flexiones contra la pared', reps:'8 repeticiones', seconds:35, visual:'wall', cue:'Manos a la altura del pecho. Mantén cuello largo y no eleves los hombros.'},
  {name:'Puente de glúteos suave', reps:'8 repeticiones', seconds:40, visual:'bridge', cue:'Eleva poco la cadera si resulta cómodo. No arquees la zona lumbar ni aguantes la respiración.'},
  {name:'Bird-dog reducido', reps:'5 por lado', seconds:40, visual:'bird', cue:'Desde cuatro apoyos, desliza solo el brazo o la pierna. Mantén el cuello mirando al suelo.'},
  {name:'Elevación de talones con apoyo', reps:'12 repeticiones', seconds:35, visual:'calf', cue:'Una mano en la pared o silla. Sube y baja de forma lenta y controlada.'}
];

const montseMobilityExercises = [
  {name:'Respiración diafragmática tumbada', reps:'5 respiraciones lentas', seconds:45, visual:'breathing', cue:'Una mano en el abdomen. Inspira suave por la nariz y suelta el aire sin forzar.'},
  {name:'Basculación pélvica suave', reps:'8 repeticiones', seconds:40, visual:'pelvic-tilt', cue:'Tumbada con rodillas flexionadas, aplana suavemente la zona lumbar y vuelve al centro. Sin dolor.'},
  {name:'Gato-camello de recorrido corto', reps:'6 repeticiones', seconds:40, visual:'cat-camel', cue:'A cuatro apoyos, redondea y vuelve al centro lentamente. No lleves la cabeza hacia atrás.'},
  {name:'Retracción cervical sentado', reps:'6 repeticiones', seconds:35, visual:'chin-tuck', cue:'Mira al frente y lleva la barbilla suavemente hacia atrás, como haciendo papada. No inclines la cabeza.'},
  {name:'Giros cervicales controlados', reps:'5 por lado', seconds:40, visual:'neck-turn', cue:'Gira la cabeza solo hasta notar tensión suave, no dolor. Mantén los hombros bajos; no hagas círculos con el cuello.'}
];

const montseWorkouts = [
  {day:'Lunes', type:'Fuerza suave', detail:'1 vuelta · 15-18 minutos', exercises:montseExercises},
  {day:'Martes', type:'Caminar', detail:'20 minutos a ritmo cómodo', exercises:[]},
  {day:'Miércoles', type:'Movilidad suave', detail:'5 ejercicios · 10 minutos · sin dolor', exercises:montseMobilityExercises},
  {day:'Jueves', type:'Caminar', detail:'20-25 minutos a ritmo cómodo', exercises:[]},
  {day:'Viernes', type:'Fuerza suave', detail:'1 vuelta · 15-18 minutos', exercises:montseExercises},
  {day:'Sábado', type:'Caminar', detail:'25 minutos a ritmo cómodo', exercises:[]},
  {day:'Domingo', type:'Descanso activo', detail:'Paseo suave opcional', exercises:[]}
];

let selectedDay = menuDays[(new Date().getDay()+6)%7];
let selectedWorkoutDay = selectedDay;
let deferredPrompt = null;
let timerId = null;
let workoutState = null;
let activeProfileId = null;

const $ = s => document.querySelector(s);
