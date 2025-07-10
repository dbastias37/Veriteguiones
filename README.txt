# Script Visualizer – Static + Firebase

## Descripción
Esta versión usa Firebase Firestore para persistencia global:
- Cualquier dispositivo que abra el link verá el mismo guion.
- El form sólo desaparece si hay datos en Firestore.
- "Volver atrás" borra los datos en Firestore tras validar contraseña.

## Configuración Firebase
1. Crea un proyecto en Firebase.
2. Habilita Firestore en modo prueba (permite lectura/escritura).
3. Copia tu **configuración web** (apiKey, projectId, etc.) 
   y pégala en `index.html` (reemplaza los placeholders).
4. Ajusta la contraseña en `js/app.js`.

## Deploy en Render
- Igual que antes, es un sitio estático.
- No requiere fuentes locales (usa Google Fonts).
- Puedes actualizar el guion vía Firebase sin redeploy.
