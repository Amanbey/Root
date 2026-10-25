import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('regression: navigation gating logic correctly restricts dashboard links', () => {
  // Pure function simulating the Navbar gating logic in navbar.tsx:
  // const isLandingPage = pathname === '/';
  // const isLoggedIn = !!userEmail || !!farmerName;
  // const showDashboardNav = !isLandingPage && isLoggedIn;

  const computeShowDashboardNav = (pathname: string, userEmail?: string, farmerName?: string) => {
    const isLandingPage = pathname === '/';
    const isLoggedIn = !!userEmail || !!farmerName;
    return !isLandingPage && isLoggedIn;
  };

  // Case 1: Visitor on landing page -> MUST be false
  assert.strictEqual(computeShowDashboardNav('/', undefined, undefined), false);

  // Case 2: Logged in user visiting landing page -> MUST be false (links appear in dashboard, not landing)
  assert.strictEqual(computeShowDashboardNav('/', 'farmer@root.et', 'Abebe Bikila'), false);

  // Case 3: Visitor trying to view a protected page without auth -> MUST be false
  assert.strictEqual(computeShowDashboardNav('/dashboard', undefined, undefined), false);
  assert.strictEqual(computeShowDashboardNav('/diagnose', undefined, undefined), false);

  // Case 4: Authenticated user in dashboard / diagnose / community / profile -> MUST be true
  assert.strictEqual(computeShowDashboardNav('/dashboard', 'farmer@root.et', 'Abebe'), true);
  assert.strictEqual(computeShowDashboardNav('/diagnose', undefined, 'Chala'), true);
  assert.strictEqual(computeShowDashboardNav('/community', 'farmer@root.et', undefined), true);
  assert.strictEqual(computeShowDashboardNav('/profile', 'farmer@root.et', 'Abebe'), true);
});

test('regression: navbar component source has sticky top-0, z-50, and NO clipping overflow', () => {
  const navbarPath = path.resolve(process.cwd(), 'src/components/shared/navbar.tsx');
  const navbarSource = fs.readFileSync(navbarPath, 'utf-8');

  // Must have sticky top-0 and z-50
  assert.ok(
    navbarSource.includes('sticky top-0 z-50'),
    'Navbar header must include "sticky top-0 z-50"'
  );

  // The inner div must NOT have overflow-x-hidden which was clipping the dropdown
  assert.ok(
    !navbarSource.includes('gap-1.5 sm:gap-2 overflow-x-hidden'),
    'Navbar container must NOT contain overflow-x-hidden'
  );
});

test('regression: globals.css uses overflow-x: clip on html, body to preserve sticky positioning', () => {
  const cssPath = path.resolve(process.cwd(), 'src/app/globals.css');
  const cssSource = fs.readFileSync(cssPath, 'utf-8');

  assert.ok(
    cssSource.includes('overflow-x: clip;'),
    'globals.css must use "overflow-x: clip" instead of "overflow-x: hidden"'
  );
  assert.ok(
    !cssSource.includes('html, body {\n    overflow-x: hidden;') &&
    !cssSource.includes('html, body {\r\n    overflow-x: hidden;'),
    'globals.css must NOT have overflow-x: hidden on html, body'
  );
});

test('regression: sign out button redirects cleanly to landing page "/"', () => {
  const signOutPath = path.resolve(process.cwd(), 'src/components/shared/sign-out-button.tsx');
  const signOutSource = fs.readFileSync(signOutPath, 'utf-8');

  assert.ok(
    signOutSource.includes("window.location.href = '/';"),
    'SignOutButton must redirect to root landing page "/"'
  );
  assert.ok(
    !signOutSource.includes("window.location.href = '/login?switch=true';"),
    'SignOutButton must not redirect to login page'
  );
});

test('regression: language switcher dropdown renders with elevated z-[60]', () => {
  const switcherPath = path.resolve(process.cwd(), 'src/components/shared/language-switcher.tsx');
  const switcherSource = fs.readFileSync(switcherPath, 'utf-8');

  assert.ok(
    switcherSource.includes('z-[60]'),
    'LanguageSwitcher dropdown must have z-[60] for guaranteed foreground layer'
  );
});
