import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mapboxConfigPath = path.join(__dirname, 'src', 'app', 'environments', 'mapbox-config.ts');

try {
  console.log('Iniciando configuración de Mapbox');
  
  let content = fs.readFileSync(mapboxConfigPath, 'utf8');
  console.log('Contenido original:', content);

  const mapboxKey = process.env.MAPBOX_KEY;
  console.log('MAPBOX_KEY:', mapboxKey ? 'Definida' : 'No definida');

  if (!mapboxKey) {
    console.warn('ADVERTENCIA: MAPBOX_KEY no está definida en las variables de entorno. Usando un valor de placeholder.');
    content = content.replace('__MAPBOX_KEY__', 'token_no_configurado');
  } else {
    content = content.replace('__MAPBOX_KEY__', mapboxKey);
  }
  
  fs.writeFileSync(mapboxConfigPath, content);
  console.log('Archivo de configuración de Mapbox actualizado');
  console.log('Nuevo contenido (con token oculto):', content.replace(mapboxKey || 'token_no_configurado', '***TOKEN***'));
} catch (error) {
  console.error('Error al procesar el archivo de configuración de Mapbox:', error);
  process.exit(1);
}