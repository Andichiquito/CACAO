
-- 1. AGREGAR COLUMNA avatar_url A LA TABLA profiles
-- Ejecuta esto para que la base de datos pueda guardar el enlace a tu foto
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;


-- 2. CONFIGURAR EL BUCKET DE ALMACENAMIENTO (STORAGE)
-- Crea el bucket 'avatars' si no lo has creado desde la interfaz de Supabase
-- Asegúrate de que el bucket sea PÚBLICO.

-- Políticas de Seguridad (RLS) para el bucket 'avatars'
-- Esto permite que cualquiera vea las fotos, pero solo tú puedas subir la tuya.

-- Permitir lectura pública de avatars
CREATE POLICY "Avatars son públicos"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Permitir que usuarios autenticados suban sus propias fotos
CREATE POLICY "Usuarios pueden subir sus propios avatars"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Permitir que usuarios actualicen sus propias fotos
CREATE POLICY "Usuarios pueden actualizar sus propios avatars"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Permitir que usuarios borren sus propias fotos
CREATE POLICY "Usuarios pueden borrar sus propios avatars"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);
