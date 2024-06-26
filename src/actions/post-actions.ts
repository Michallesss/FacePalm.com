'use server';
import { z } from 'zod';
import { getUserMeLoader } from "@/services/get-user-me-loader";
import { createPostService } from '@/services/post-services';
import { redirect } from 'next/navigation';

const createPostSchema = z.object({
  author: z.number(),
  title: z.string().min(1).max(128, {
    message: 'Title must be between 1 and 64 characters',
  }),
  content: z.string().min(1).max(4096, {
    message: 'Content must be between 1 and 1024 characters',
  }),
  // views: z.number().default(0),
  // comments: z.array(z.number()).default([]),
  // reactions: z.array(z.number()).default([]),
});

export async function createPostAction(prevState: any, formData: FormData) {
  const user = await getUserMeLoader();

  if (!user.ok) return {
    ...prevState,
    ZodErrors: null,
    StrapiErrors: user.error,
    message: 'Failed to Create Post.',
  };

  const validatedFields = createPostSchema.safeParse({
    author: user.data.id, // !!! NIE DZIAŁĄ !!!
    title: formData.get('title'),
    content: formData.get('content'),
    // views: 0,
    // comments: [],
    // reactions: [],
  });

  if (!validatedFields.success) {
    return {
      ...prevState,
      zodErrors: validatedFields.error.flatten().fieldErrors,
      strapiErrors: null,
      message: 'Missing Fields. Failed to Create Post.',
    };
  }

  const responseData = await createPostService(validatedFields.data);

  if (!responseData) {
    return {
      ...prevState,
      strapiErrors: null,
      zodErrors: null,
      message: 'Ops! Something went wrong. Please try again.',
    };
  }

  if (responseData.error) {
    return {
      ...prevState,
      strapiErrors: responseData.error,
      zodErrors: null,
      message: 'Failed to Create Post.',
    };
  }

  return redirect(`/post/${responseData.id}`);
}