import * as fs from 'fs';
import * as path from 'path';

const mapboxConfigPath = path.join(__dirname, 'src', 'environments', 'mapbox-config.ts');
let content = fs.readFileSync(mapboxConfigPath, 'utf8');

// Reemplaza el token con la variable de entorno
const mapboxKey = process.env['MAPBOX_KEY'] || 'tu_token_de_mapbox_aquí';
content = content.replace('__MAPBOX_KEY__', mapboxKey);

fs.writeFileSync(mapboxConfigPath, content);
console.log('Archivo de configuración de Mapbox actualizado con éxito.');