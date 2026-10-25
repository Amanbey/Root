import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('deployment-readiness: PWA manifest.json exists, is valid JSON, and defines offline PWA attributes', () => {
  const manifestPath = path.resolve(process.cwd(), 'public/manifest.json');
  assert.ok(fs.existsSync(manifestPath), 'manifest.json must exist in public directory');

  const content = fs.readFileSync(manifestPath, 'utf-8');
  const manifest = JSON.parse(content);

  assert.ok(manifest.name, 'Manifest must specify app name');
  assert.ok(manifest.short_name, 'Manifest must specify short_name');
  assert.ok(manifest.start_url, 'Manifest must specify start_url');
  assert.ok(manifest.display, 'Manifest must specify display mode');
  assert.ok(Array.isArray(manifest.icons) && manifest.icons.length > 0, 'Manifest must define icons');
});

test('deployment-readiness: Service Worker script exists in public directory', () => {
  const swPath = path.resolve(process.cwd(), 'public/sw.js');
  assert.ok(fs.existsSync(swPath), 'sw.js must exist in public directory for offline PWA functionality');
});

test('deployment-readiness: .env.example defines all required configuration keys', () => {
  const envExamplePath = path.resolve(process.cwd(), '.env.example');
  assert.ok(fs.existsSync(envExamplePath), '.env.example must exist');

  const envContent = fs.readFileSync(envExamplePath, 'utf-8');
  assert.ok(envContent.includes('NEXT_PUBLIC_SUPABASE_URL'), 'NEXT_PUBLIC_SUPABASE_URL must be defined');
  assert.ok(envContent.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY'), 'NEXT_PUBLIC_SUPABASE_ANON_KEY must be defined');
});

test('deployment-readiness: Supabase initial schema migration exists', () => {
  const migrationPath = path.resolve(
    process.cwd(),
    'supabase/migrations/20261023_001_initial_schema.sql'
  );
  assert.ok(fs.existsSync(migrationPath), 'Initial schema migration must exist');

  const sqlContent = fs.readFileSync(migrationPath, 'utf-8');
  assert.ok(sqlContent.includes('CREATE TABLE'), 'Migration must contain CREATE TABLE statements');
  assert.ok(sqlContent.includes('profiles'), 'Profiles table must be defined');
  assert.ok(sqlContent.includes('questions'), 'Questions table must be defined');
  assert.ok(sqlContent.includes('advice_cards'), 'Advice cards table must be defined');
});
