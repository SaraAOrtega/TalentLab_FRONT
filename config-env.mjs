import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mapboxConfigPath = path.join(__dirname, 'src', 'app', 'environments', 'mapbox-config.ts');

try {
  // Asegúrate de que el directorio existe
  const dir = path.dirname(mapboxConfigPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Directorio creado: ${dir}`);
  }

  let content;
  if (fs.existsSync(mapboxConfigPath)) {
    content = fs.readFileSync(mapboxConfigPath, 'utf8');
    console.log('Archivo de configuración existente leído.');
  } else {
    content = `export const mapboxConfig = {\n  apiKey: '__MAPBOX_KEY__'\n};`;
    console.log('Nuevo contenido de configuración creado.');
  }

  const mapboxKey = process.env.MAPBOX_KEY || 'tu_token_de_mapbox_aquí';
  content = content.replace('__MAPBOX_KEY__', mapboxKey);

  fs.writeFileSync(mapboxConfigPath, content);
  console.log(`Archivo de configuración de Mapbox actualizado con éxito en: ${mapboxConfigPath}`);
} catch (error) {
  console.error('Error al procesar el archivo de configuración de Mapbox:', error);
  process.exit(1);
}