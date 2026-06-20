import { CollectionConfig } from 'payload'
import {
  revalidateCategoriesAfterChangeHook,
  revalidateCategoriesAfterDeleteHook,
} from './hooks/revalidateCategories'

export const Categories: CollectionConfig = {
  slug: 'categories',
  dbName: 'category', // Database me table ka naam 'category' banega
  admin: {
    useAsTitle: 'name', // Admin panel me category ka naam hi dropdown me dikhega
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true, // Ek naam ki do categories nahi ban sakein gi (e.g., Work, Personal)
    },
    {
      name: 'slug', // 👈 NEW: Dashboard par URL-friendly handle
      type: 'text',
      required: true,
      unique: true,
    },
  ],
  hooks: {
    afterChange: [revalidateCategoriesAfterChangeHook],
    afterDelete: [revalidateCategoriesAfterDeleteHook],
  },
}
