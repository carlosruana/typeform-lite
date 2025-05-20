import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FormField {
  id: string;
  type: 'text' | 'number' | 'select' | 'textarea';
  label: string;
  required: boolean;
  options?: string[]; // For select fields
}

export interface Form {
  id: string;
  name: string;
  fields: FormField[];
}

interface FormStore {
  forms: Form[];
  addForm: (form: Form) => void;
  updateForm: (id: string, form: Partial<Form>) => void;
  deleteForm: (id: string) => void;
  getForm: (id: string) => Form | undefined;
}

export const useFormStore = create<FormStore>()(
  persist(
    (set, get) => ({
      forms: [],
      addForm: form =>
        set(state => ({
          forms: [...state.forms, form],
        })),
      updateForm: (id, updatedForm) =>
        set(state => ({
          forms: state.forms.map(form => (form.id === id ? { ...form, ...updatedForm } : form)),
        })),
      deleteForm: id =>
        set(state => ({
          forms: state.forms.filter(form => form.id !== id),
        })),
      getForm: id => get().forms.find(form => form.id === id),
    }),
    {
      name: 'form-storage',
    }
  )
);
