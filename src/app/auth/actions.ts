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
 * Sign out action - fast, offline-resilient local session cleanup
 */
export async function signOutAction(): Promise<{ success: boolean }> {
  try {
    const supabase = await createClient();
    await Promise.race([
      supabase.auth.signOut({ scope: 'local' }),
      new Promise((resolve) => setTimeout(resolve, 200)),
    ]);
  } catch (err) {
    console.warn('Server signout fallback notice:', err);
  }
  revalidatePath('/', 'layout');
  return { success: true };
}

/**
 * Fetch current farmer profile
 */
export async function getCurrentFarmerProfile(): Promise<FarmerProfile | null> {
  const supabase = await createClient();

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
      avatar_url: user.user_metadata?.avatar_url || null,
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
  avatarUrl?: string | null;
}): Promise<AuthActionResult> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'User is not authenticated' };
  }

  const upsertData: Record<string, unknown> = {
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
  };

  if (profileUpdate.avatarUrl !== undefined) {
    upsertData.avatar_url = profileUpdate.avatarUrl;
  }

  const { error } = await supabase
    .from('farmer_profiles')
    .upsert(upsertData as any);

  if (error) {
    return { success: false, error: error.message };
  }

  // Also update user metadata
  await supabase.auth.updateUser({
    data: {
      full_name: profileUpdate.fullName,
      phone: profileUpdate.phone,
      ...(profileUpdate.avatarUrl !== undefined ? { avatar_url: profileUpdate.avatarUrl } : {}),
    },
  });

  revalidatePath('/', 'layout');
  revalidatePath('/profile');
  return { success: true };
}

/**
 * Upload, edit, or remove profile picture
 */
export async function updateAvatarAction(avatarBase64OrUrl: string | null): Promise<AuthActionResult & { avatarUrl?: string | null }> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'User is not authenticated' };
    }

    let finalAvatarUrl: string | null = avatarBase64OrUrl;

    // If an image was uploaded as base64, attempt storage upload
    if (avatarBase64OrUrl && avatarBase64OrUrl.startsWith('data:image')) {
      try {
        const match = avatarBase64OrUrl.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
        if (match) {
          const mimeType = match[1];
          const base64Data = match[2];
          const buffer = Buffer.from(base64Data, 'base64');
          const fileExt = mimeType.split('/')[1] || 'jpg';
          const fileName = `avatar-${user.id}-${Date.now()}.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from('crop-photos')
            .upload(fileName, buffer, { contentType: mimeType, upsert: true });

          if (!uploadError) {
            const { data: publicUrlData } = supabase.storage
              .from('crop-photos')
              .getPublicUrl(fileName);
            finalAvatarUrl = publicUrlData.publicUrl;
          }
        }
      } catch (photoErr) {
        console.warn('Avatar storage upload warning, storing image directly:', photoErr);
      }
    }

    // Update farmer_profiles table
    const { error: dbError } = await supabase
      .from('farmer_profiles')
      .update({
        avatar_url: finalAvatarUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (dbError) {
      console.warn('Profile table avatar update warning:', dbError.message);
    }

    // Update auth user metadata
    await supabase.auth.updateUser({
      data: { avatar_url: finalAvatarUrl },
    });

    revalidatePath('/', 'layout');
    revalidatePath('/profile');
    return { success: true, avatarUrl: finalAvatarUrl };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to update avatar';
    return { success: false, error: errorMsg };
  }
}

/**
 * Change user password action
 */
export async function changePasswordAction(formData: FormData): Promise<AuthActionResult> {
  const newPassword = (formData.get('newPassword') as string) || '';
  const confirmPassword = (formData.get('confirmPassword') as string) || '';

  if (!newPassword || newPassword.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters long' };
  }

  if (newPassword !== confirmPassword) {
    return { success: false, error: 'Passwords do not match' };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'You must be signed in to change your password' };
  }

  let { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  // Admin client fallback if session token scope requires elevated privileges
  if (error) {
    const adminClient = createAdminClient();
    if (adminClient) {
      const { error: adminError } = await adminClient.auth.admin.updateUserById(user.id, {
        password: newPassword,
      });
      if (!adminError) {
        error = null;
      }
    }
  }

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/profile');
  return { success: true };
}
