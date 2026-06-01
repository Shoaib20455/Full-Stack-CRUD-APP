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
  ],
}