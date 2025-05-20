import { supabase } from '../lib/supabase';

interface FormResponse {
  id: string;
  form_id: string;
  answers: {
    field_id: string;
    value: string;
  }[];
  created_at?: string;
}

export const responsesService = {
  async saveResponse(formId: string, answers: FormResponse['answers']) {
    const { data, error } = await supabase
      .from('form_responses')
      .insert({
        id: crypto.randomUUID(),
        form_id: formId,
        answers,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
