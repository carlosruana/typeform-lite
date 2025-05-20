import { supabase } from '../lib/supabase';
import type { FormField } from '../stores/formStore';

export interface Form {
  id: string;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface DBFormField extends Omit<FormField, 'id'> {
  id: string;
  form_id: string;
}

export const formsService = {
  async saveForm(form: Form, fields: FormField[]) {
    const { data: savedForm, error: formError } = await supabase
      .from('forms')
      .upsert(
        {
          id: form.id,
          name: form.name,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      )
      .select()
      .single();

    if (formError) throw formError;

    // Delete existing fields for this form
    const { error: deleteError } = await supabase
      .from('form_fields')
      .delete()
      .eq('form_id', form.id);

    if (deleteError) throw deleteError;

    // Insert new fields
    const { data: savedFields, error: fieldsError } = await supabase
      .from('form_fields')
      .insert(
        fields.map(field => ({
          id: field.id,
          form_id: form.id,
          type: field.type,
          label: field.label,
          required: field.required,
          options: field.options,
        }))
      )
      .select();

    if (fieldsError) throw fieldsError;

    return {
      ...savedForm,
      fields: savedFields,
    };
  },

  async getForm(formId: string) {
    const { data: form, error: formError } = await supabase
      .from('forms')
      .select()
      .eq('id', formId)
      .single();

    if (formError) throw formError;

    const { data: fields, error: fieldsError } = await supabase
      .from('form_fields')
      .select()
      .eq('form_id', formId);

    if (fieldsError) throw fieldsError;

    return {
      ...form,
      fields,
    };
  },
};
