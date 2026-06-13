import { CollectionConfig } from 'payload'

export const Todos: CollectionConfig = {
  slug: 'todos',
  dbName: 'todo', // Payload default par table ka naam lowercase rakhga 'todo'
  timestamps: true, // Yeh automatic 'createdAt' aur 'updatedAt' banayega
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'userId', // Payload isko database me automatic 'user_id' banaye ga
      type: 'text',
      required: true,
    },
    {
      name: 'completed',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories' as any, // Yeh bilkul Categories collection ke slug se match hona chahiye
      hasMany: false,            // Aik todo ke sath aik hi category select ho sakegi
      required: false,           // Optional rakhte hain, zaroori nahi har todo ki category ho
    },
  ],
}