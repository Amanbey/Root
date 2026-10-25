'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { upvoteCommunityRemedy, createCommunityRemedy } from '@/lib/supabase/db-helpers';

const remedySchema = z.object({
  cropType: z.string().min(1, 'Crop type is required'),
  problemTitle: z.string().min(3, 'Problem title must be at least 3 characters'),
  symptoms: z.string().min(5, 'Symptoms description must be at least 5 characters'),
  provenSolution: z.string().min(10, 'Solution must be at least 10 characters with practical steps'),
  region: z.string().default('Oromia'),
  agroZone: z.enum(['Dega', 'Weyna Dega', 'Kolla', 'Bereha']).default('Weyna Dega'),
});

export async function upvoteRemedyAction(knowledgeId: string): Promise<{ success: boolean; newCount?: number; error?: string }> {
  try {
    const newCount = await upvoteCommunityRemedy(knowledgeId);
    revalidatePath('/community');
    return { success: true, newCount };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to register peer verification';
    return { success: false, error: message };
  }
}

export async function submitRemedyAction(prevState: unknown, formData: FormData): Promise<{ success: boolean; error?: string }> {
  try {
    const cropType = formData.get('cropType') as string;
    const problemTitle = formData.get('problemTitle') as string;
    const symptoms = formData.get('symptoms') as string;
    const provenSolution = formData.get('provenSolution') as string;
    const region = (formData.get('region') as string) || 'Oromia';
    const agroZone = (formData.get('agroZone') as 'Dega' | 'Weyna Dega' | 'Kolla' | 'Bereha') || 'Weyna Dega';

    const validated = remedySchema.safeParse({
      cropType,
      problemTitle,
      symptoms,
      provenSolution,
      region,
      agroZone,
    });

    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0]?.message || 'Please fill in all remedy details correctly',
      };
    }

    await createCommunityRemedy(validated.data);
    revalidatePath('/community');
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to submit community remedy';
    return { success: false, error: message };
  }
}
