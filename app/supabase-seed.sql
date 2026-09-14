-- Run this after the schema in supabase-schema.sql has been applied.
-- It creates sample providers, services, and availability for the app.

insert into public.providers (
  id,
  user_id,
  business_name,
  specialty,
  location,
  bio,
  hourly_rate,
  rating,
  review_count,
  photo_url,
  is_verified
)
values
  (
    'a85e1b1f-1e3d-4865-ae7d-9e0d7caac4f1',
    '5d8a6fe2-9f4f-48d1-8cc8-8d5cf3efea44',
    'Rapid Rooter Plumbing',
    'Plumbing',
    'San Francisco',
    'Fast, reliable plumbing repairs for homes and small businesses.',
    95,
    4.9,
    128,
    'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80',
    true
  ),
  (
    'ea52db3d-6a5b-4219-bd57-2d6c40fa6ac1',
    'a20e521a-7b9b-44cb-9cef-e2de9a8077dc',
    'City Glow Cleaning',
    'Cleaning',
    'San Francisco',
    'Eco-conscious home and office cleaning with a detail-first approach.',
    80,
    4.8,
    214,
    'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=900&q=80',
    true
  ),
  (
    '2be3d5a1-0d70-47ae-9e25-5eb2453e03d2',
    '1667f9d7-02d4-4f80-b960-fca7d1aeb4d1',
    'Summit Electric Co.',
    'Electrical',
    'Oakland',
    'Licensed electricians for upgrades, repairs, lighting, and panel services.',
    110,
    4.9,
    168,
    'https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=900&q=80',
    true
  )
on conflict (id) do nothing;

insert into public.provider_services (id, provider_id, name, description, duration_minutes, price, is_active)
values
  ('2a7d241d-a5cb-47b5-9dae-916798b6f4db', 'a85e1b1f-1e3d-4865-ae7d-9e0d7caac4f1', 'Drain Cleaning', 'Clear stubborn pipes and restore flow quickly.', 45, 95, true),
  ('3cc289d2-17d7-4dd7-b329-7fa465f859b1', 'a85e1b1f-1e3d-4865-ae7d-9e0d7caac4f1', 'Pipe Repair', 'Fix cracked or leaking lines with precision work.', 60, 120, true),
  ('58ee6ea6-9d79-4994-8627-6d1dd00d20dc', 'a85e1b1f-1e3d-4865-ae7d-9e0d7caac4f1', 'Water Heater Service', 'Inspect, repair, or replace water heaters.', 90, 190, true),
  ('5a7ac4d0-5e23-4c5b-b63d-daf365e2fcdd', 'ea52db3d-6a5b-4219-bd57-2d6c40fa6ac1', 'Deep Clean', 'Room-by-room deep cleaning for refreshed interiors.', 90, 120, true),
  ('d611a6ea-3d6b-4d22-a631-fd44d8a7ffb3', 'ea52db3d-6a5b-4219-bd57-2d6c40fa6ac1', 'Office Refresh', 'Keep workspaces tidy, sanitized, and guest-ready.', 120, 160, true),
  ('f5be5959-4c88-4f55-b79c-c7f8845e5b16', 'ea52db3d-6a5b-4219-bd57-2d6c40fa6ac1', 'Move-In Cleanup', 'Leave new spaces spotless before the move-in day.', 150, 200, true),
  ('4d8c41e2-67ce-4d8b-a8f4-15d4bb273855', '2be3d5a1-0d70-47ae-9e25-5eb2453e03d2', 'Lighting Install', 'Install modern fixtures and bright, efficient lighting.', 60, 130, true),
  ('72ef5d0f-b0f3-47f7-8d30-406e930c9fd0', '2be3d5a1-0d70-47ae-9e25-5eb2453e03d2', 'Panel Upgrade', 'Upgrade outdated electrical panels for safety and capacity.', 180, 240, true),
  ('7cb62827-0d1b-420d-a2df-6aa7d51d6701', '2be3d5a1-0d70-47ae-9e25-5eb2453e03d2', 'Fault Diagnosis', 'Isolate electrical issues and recommend the correct fix.', 75, 140, true)
on conflict (id) do nothing;

insert into public.provider_availability (id, provider_id, weekday, start_time, end_time, is_available)
values
  ('43be7759-7474-47a4-846a-cd4370e5afe4', 'a85e1b1f-1e3d-4865-ae7d-9e0d7caac4f1', 1, '09:00:00', '10:00:00', true),
  ('d499617a-e7b3-400f-96f4-47d2ea93ba4c', 'a85e1b1f-1e3d-4865-ae7d-9e0d7caac4f1', 1, '10:00:00', '11:00:00', true),
  ('7dc2c4e8-f1f6-4f9a-9d52-de1007e6a918', 'a85e1b1f-1e3d-4865-ae7d-9e0d7caac4f1', 1, '11:00:00', '12:00:00', true),
  ('f0ab798d-a56a-4ff4-9ee0-5280821f7be7', 'a85e1b1f-1e3d-4865-ae7d-9e0d7caac4f1', 2, '13:00:00', '14:00:00', true),
  ('6f5e6587-65d0-46af-becd-5f54e1efac9b', 'a85e1b1f-1e3d-4865-ae7d-9e0d7caac4f1', 2, '14:00:00', '15:00:00', true),
  ('fb2c60c8-cc96-4d30-92bf-8a48867a9ea5', 'ea52db3d-6a5b-4219-bd57-2d6c40fa6ac1', 2, '08:00:00', '09:00:00', true),
  ('f005b49f-f6d0-42ec-b22e-7cfba98cff4b', 'ea52db3d-6a5b-4219-bd57-2d6c40fa6ac1', 2, '09:30:00', '10:30:00', true),
  ('b58b3b6c-0b00-4e4c-9ea9-59c7d85b8b86', 'ea52db3d-6a5b-4219-bd57-2d6c40fa6ac1', 4, '12:00:00', '13:00:00', true),
  ('de0ddf5c-9a4b-49ad-a4f8-622375041f8f', 'ea52db3d-6a5b-4219-bd57-2d6c40fa6ac1', 4, '14:30:00', '15:30:00', true),
  ('250a340d-6d76-407e-ac96-b87857f07a66', '2be3d5a1-0d70-47ae-9e25-5eb2453e03d2', 1, '09:00:00', '10:00:00', true),
  ('f8cc11a6-a478-4d40-b3c0-04f7c79d5926', '2be3d5a1-0d70-47ae-9e25-5eb2453e03d2', 1, '10:30:00', '11:30:00', true),
  ('050a4d7b-b89a-4dd0-93a5-3a28d5c7c4a8', '2be3d5a1-0d70-47ae-9e25-5eb2453e03d2', 3, '13:30:00', '14:30:00', true),
  ('e30d8dc8-9dc7-4a47-9bc1-0af0f32d0b82', '2be3d5a1-0d70-47ae-9e25-5eb2453e03d2', 3, '15:00:00', '16:00:00', true)
on conflict (id) do nothing;
