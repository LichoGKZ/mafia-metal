# Setup del formulario "Diseña tu propia pieza"

## 1. Variable de entorno (WhatsApp)
En `.env.local` (y en el hosting):

    NEXT_PUBLIC_WHATSAPP_NUMBER=5492230000000   # formato internacional, sin "+"

Si no se define, el botón de WhatsApp no se muestra (el envío por backend sigue funcionando).

## 2. Bucket de Supabase para las imágenes de inspiración
Ejecutar una vez en el SQL Editor de Supabase:

    insert into storage.buckets (id, name, public)
    values ('custom-requests', 'custom-requests', true)
    on conflict (id) do nothing;

    create policy "custom_requests_public_upload"
    on storage.objects for insert to anon, authenticated
    with check (bucket_id = 'custom-requests');

Las URLs de las imágenes quedan dentro del campo `message` de `contact_messages`
(interés = `custom`), visibles en el panel admin → Mensajes.
Si el bucket no existe, la solicitud igual se guarda (sin las imágenes) y el cliente
puede mandarlas por WhatsApp.

## 3. Color amarillo global
Editar `GOLD_RGB`, `GOLD_LIGHT_RGB`, `GOLD_DARK_RGB` en `src/lib/brand.ts`.
