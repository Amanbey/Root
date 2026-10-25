'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { FarmerProfile, EthiopianRegion, AgroEcologicalZone, SupportedLanguage, EthiopianCrop } from '@/lib/types';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  region: z.string().default('Oromia'),
  agroZone: z.enum(['Dega', 'Weyna Dega', 'Kolla', 'Bereha']).default('Weyna Dega'),
  preferredLanguage: z.enum(['en', 'am', 'om']).default('en'),
});

export interface AuthActionResult {
  success: boolean;
  error?: string;
  redirectTo?: string;
}

/**
 * Sign in action
 */
export async function signInAction(prevState: unknown, formData: FormData): Promise<AuthActionResult> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const redirectTo = (formData.get('redirectTo') as string) || '/profile';

  const validated = loginSchema.safeParse({ email, password });
  if (!validated.success) {
    return {
      success: false,
      error: validated.error.issues[0]?.message || 'Invalid input fields',
    };
  }

  const supabase = await createClient();

  // If using placeholder credentials, support seamless offline/demo preview
  const isPlaceholder = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');
  if (isPlaceholder) {
    // Demo login simulation for immediate local evaluation
    return {
      success: true,
      redirectTo,
    };
  }

  let { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  // If unconfirmed email, auto-confirm user with admin client and retry
  if (error && error.message.toLowerCase().includes('email not confirmed')) {
    const admin = createAdminClient();
    if (admin) {
      const { data: usersData } = await admin.auth.admin.listUsers();
      const existingUser = usersData?.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
      if (existingUser) {
        await admin.auth.admin.updateUserById(existingUser.id, { email_confirm: true });
        const retryResult = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        error = retryResult.error;
      }
    }
  }

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  revalidatePath('/', 'layout');
  return {
    success: true,
    redirectTo,
  };
}

/**
 * Sign up action with initial farmer profile creation
 */
export async function signUpAction(prevState: unknown, formData: FormData): Promise<AuthActionResult> {
  const fullName = formData.get('fullName') as string;
  const email = formData.get('email') as string;
  const phone = (formData.get('phone') as string) || undefined;
  const password = formData.get('password') as string;
  const region = (formData.get('region') as string) || 'Oromia';
  const agroZone = (formData.get('agroZone') as string) || 'Weyna Dega';
  const preferredLanguage = (formData.get('preferredLanguage') as string) || 'en';

  const validated = registerSchema.safeParse({
    fullName,
    email,
    phone,
    password,
    region,
    agroZone,
    preferredLanguage,
  });

  if (!validated.success) {
    return {
      success: false,
      error: validated.error.issues[0]?.message || 'Invalid registration details',
    };
  }

  const supabase = await createClient();
  const adminClient = createAdminClient();

  const isPlaceholder = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');
  if (isPlaceholder) {
    // Demo registration simulation
    return {
      success: true,
      redirectTo: '/profile',
    };
  }

  let userId: string | null = null;

  // Use Admin API to create user with email_confirm: true
  // This bypasses Supabase free SMTP rate limits completely (no confirmation email triggered)
  if (adminClient) {
    const { data: adminUserData, error: adminError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        phone,
      },
    });

    if (adminError) {
      // If user already registered, update their password, auto-confirm, and sign in
      if (
        adminError.message.toLowerCase().includes('already been registered') ||
        adminError.message.toLowerCase().includes('already exists')
      ) {
        const { data: usersData } = await adminClient.auth.admin.listUsers();
        const existingUser = usersData?.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
        if (existingUser) {
          await adminClient.auth.admin.updateUserById(existingUser.id, {
            password,
            email_confirm: true,
            user_metadata: { full_name: fullName, phone },
          });
          userId = existingUser.id;
        } else {
          return {
            success: false,
            error: adminError.message,
          };
        }
      } else {
        return {
          success: false,
          error: adminError.message,
        };
      }
    } else if (adminUserData.user) {
      userId = adminUserData.user.id;
    }
  } else {
    // Fallback: standard sign up
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone,
        },
      },
    });

    if (authError) {
      return {
        success: false,
        error: authError.message,
      };
    }

    userId = authData.user?.id || null;
  }

  // Initialize farmer profile record
  if (userId) {
    const profileClient = adminClient || supabase;
    const { error: profileError } = await profileClient
      .from('farmer_profiles')
      .upsert({
        id: userId,
        full_name: fullName,
        email,
        phone,
        region: region as EthiopianRegion,
        agro_ecological_zone: agroZone as AgroEcologicalZone,
        preferred_language: preferredLanguage as SupportedLanguage,
        main_crops: ['Teff', 'Wheat'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

    if (profileError) {
      console.warn('Initial profile creation warning:', profileError);
    }
  }

  // Automatically sign in the newly registered user on the current session
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  revalidatePath('/', 'layout');

  if (signInError) {
    return {
      success: true,
      redirectTo: '/login?registered=success',
    };
  }

  return {
    success: true,
    redirectTo: '/profile',
  };
}

/**
 * Sign out action
 */
export async function signOutAction(): Promise<{ success: boolean }> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  return { success: true };
}

/**
 * Fetch current farmer profile
 */
export async function getCurrentFarmerProfile(): Promise<FarmerProfile | null> {
  const supabase = await createClient();

  const isPlaceholder = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');
  if (isPlaceholder) {
    // Return sample Ethiopian farmer profile for demo/offline evaluation
    return {
      id: 'demo-farmer-id',
      full_name: 'Abebe Bekele',
      email: 'abebe.farmer@ethioroot.org',
      phone: '+251 91 123 4567',
      region: 'Oromia',
      zone_name: 'East Shewa',
      woreda: 'Ada\'a (Debre Zeit)',
      agro_ecological_zone: 'Weyna Dega',
      main_crops: ['Teff', 'Wheat', 'Chickpea'],
      preferred_language: 'am',
      farm_size_hectares: 2.5,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return null;
  }

  const { data: profile, error } = await supabase
    .from('farmer_profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error || !profile) {
    // Fallback to basic profile with auth user info
    return {
      id: user.id,
      full_name: user.user_metadata?.full_name || 'Farmer',
      email: user.email,
      phone: user.user_metadata?.phone,
      region: 'Oromia',
      agro_ecological_zone: 'Weyna Dega',
      main_crops: ['Teff', 'Wheat'],
      preferred_language: 'en',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  return profile as FarmerProfile;
}

/**
 * Update farmer profile action
 */
export async function updateFarmerProfileAction(profileUpdate: {
  fullName: string;
  phone?: string;
  region: EthiopianRegion;
  zoneName?: string;
  woreda?: string;
  agroZone: AgroEcologicalZone;
  mainCrops: EthiopianCrop[];
  preferredLanguage: SupportedLanguage;
  farmSizeHectares?: number;
}): Promise<AuthActionResult> {
  const supabase = await createClient();

  const isPlaceholder = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');
  if (isPlaceholder) {
    return { success: true };
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'User is not authenticated' };
  }

  const { error } = await supabase
    .from('farmer_profiles')
    .upsert({
      id: user.id,
      full_name: profileUpdate.fullName,
      phone: profileUpdate.phone,
      region: profileUpdate.region,
      zone_name: profileUpdate.zoneName,
      woreda: profileUpdate.woreda,
      agro_ecological_zone: profileUpdate.agroZone,
      main_crops: profileUpdate.mainCrops,
      preferred_language: profileUpdate.preferredLanguage,
      farm_size_hectares: profileUpdate.farmSizeHectares,
      updated_at: new Date().toISOString(),
    });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/profile');
  return { success: true };
}
