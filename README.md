# Plan90

Aplicación privada de seguimiento para dos cuentas fijas: Paco y Montse.

## Funciones

- autenticación independiente sin registro público;
- progreso y entrenamientos persistidos en el VPS;
- menús editables y separados por cuenta;
- importación automática opcional desde el antiguo `localStorage`;
- exportación e importación de copias JSON;
- cambio de contraseña desde la cuenta;
- aplicación PWA con soporte sin conexión para los recursos estáticos;
- despliegue automático desde `main` mediante GitHub Actions.

## Configuración

Configura los PIN de 4 cifras de Paco y Montse sin mostrarlos en pantalla:

```bash
npm run setup-passwords
```

El comando pide ambos PIN dos veces, crea `.env` con hashes `scrypt` y genera un secreto de sesión aleatorio. Los intentos de acceso están limitados. `.env` y `data/` están excluidos de Git.

## Desarrollo y pruebas

```bash
npm test
npm run validate:data
```

## Producción

El contenedor se conecta a la red Docker externa `proxy`. Los datos persistentes viven en `./data/plan90.json`; el script de despliegue guarda una copia previa en `/srv/docker/backups/plan90`.
