# Configuración de Google Maps API

## Pasos para Habilitar las APIs

### 1. Habilitar las APIs en Google Cloud Console

1. Ve a: https://console.cloud.google.com/apis/library
2. **Selecciona el proyecto correcto** (el que tiene tu API key)
3. Busca y habilita estas APIs:
   - **Maps JavaScript API** → Click en "ENABLE"
   - **Places API** → Click en "ENABLE"
4. Verifica que estén habilitadas:
   - Ve a: https://console.cloud.google.com/apis/dashboard
   - Deben aparecer como "Enabled" (verde)

### 2. Configurar Restricciones de la API Key

1. Ve a: https://console.cloud.google.com/apis/credentials
2. Abre tu API key (la que termina en `...D5snmQ`)
3. En **"Application restrictions"**:
   - Selecciona **"HTTP referrers (websites)"**
   - Agrega estos referrers (uno por línea):
     ```
     localhost:*
     127.0.0.1:*
     *.vercel.app/*
     *.netlify.app/*
     ```
   - Si tienes dominios personalizados, agrégalos también:
     ```
     tudominio.com/*
     *.tudominio.com/*
     ```

4. En **"API restrictions"**:
   - Opción A (Recomendada): Selecciona **"Restrict key"** y marca solo:
     - ✅ Maps JavaScript API
     - ✅ Places API
   - Opción B (Menos segura): Selecciona **"Don't restrict key"** (funciona en todos los proyectos pero es menos seguro)

5. Click en **"SAVE"**
6. **Espera 2-3 minutos** para que los cambios se propaguen

### 3. Verificar que Funcione

1. Recarga tu aplicación completamente (Ctrl+F5 o Cmd+Shift+R)
2. Abre la consola del navegador (F12)
3. Haz clic en "Ver Pedido"
4. Deberías ver el mapa sin errores

## Notas Importantes

- ✅ La API key puede usarse en múltiples proyectos/dominios si los referrers están configurados correctamente
- ✅ Las APIs deben estar habilitadas en el proyecto donde está la key
- ⏱️ Los cambios pueden tardar 2-3 minutos en aplicarse
- 🌐 Si usas un dominio personalizado en Vercel, agrégalo también en los referrers

## Solución de Problemas

### Error: "ApiNotActivatedMapError"
- **Causa**: Las APIs no están habilitadas en el proyecto
- **Solución**: Sigue el Paso 1 para habilitar las APIs

### Error: "RefererNotAllowedMapError"
- **Causa**: El dominio no está en la lista de referrers permitidos
- **Solución**: Agrega tu dominio en "Application restrictions" (Paso 2)

### El mapa no aparece
- Verifica que las APIs estén habilitadas
- Verifica que los referrers incluyan tu dominio
- Espera 2-3 minutos después de hacer cambios
- Recarga la página completamente

