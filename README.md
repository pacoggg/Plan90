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

Configura las contraseñas de Paco y Montse sin mostrarlas en pantalla:

```bash
npm run setup-passwords
```

El comando pide ambas contraseñas dos veces, crea `.env` con hashes `scrypt` y genera un secreto de sesión aleatorio. `.env` y `data/` están excluidos de Git.

## Desarrollo y pruebas

```bash
npm test
npm run validate:data
```

## Producción

El contenedor se conecta a la red Docker externa `proxy`. Los datos persistentes viven en `./data/plan90.json`; el script de despliegue guarda una copia previa en `/srv/docker/backups/plan90`.
