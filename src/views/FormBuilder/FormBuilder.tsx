import { useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useFormStore } from '../../stores/formStore';
import type { FormField } from '../../stores/formStore';
import { formsService } from '../../services/forms';
import { SuccessScreen } from '../../components/SuccessScreen/SuccessScreen';

const Container = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

const Section = styled.div`
  background: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
`;

const FieldContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  border: 2px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: border-color 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.gray[700]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}20;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  background-color: ${({ theme }) => theme.colors.white};
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}20;
  }
`;

const Button = styled.button<{ variant?: 'primary' | 'success' }>`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme, variant }) =>
    variant === 'success' ? theme.colors.success : theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  & + & {
    margin-top: ${({ theme }) => theme.spacing.md};
  }
`;

const PreviewQuestion = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }
`;

const QuestionNumber = styled.div`
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const QuestionType = styled.div`
  color: ${({ theme }) => theme.colors.gray[600]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const QuestionText = styled.div`
  color: ${({ theme }) => theme.colors.dark};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const SaveButton = styled(Button)`
  margin-top: ${({ theme }) => theme.spacing.xl};
  background-color: ${({ theme }) => theme.colors.success};
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.danger};
  margin-top: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.danger}10;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  text-align: center;
`;

export default function FormBuilder() {
  const { formId } = useParams();
  const { getForm, updateForm } = useFormStore();
  const form = getForm(formId || '');
  const [fields, setFields] = useState<FormField[]>(form?.fields || []);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleAddField = () => {
    const newField: FormField = {
      id: crypto.randomUUID(),
      type: 'text',
      label: '',
      required: false,
    };
    setFields([...fields, newField]);
  };

  const handleFieldChange = (id: string, field: Partial<FormField>) => {
    const updatedFields = fields.map(f => (f.id === id ? { ...f, ...field } : f));
    setFields(updatedFields);
    if (form) {
      updateForm(form.id, { fields: updatedFields });
    }
  };

  const handleSave = async () => {
    if (!form) return;

    setIsSaving(true);
    setError(null);

    try {
      await formsService.saveForm(
        {
          id: form.id,
          name: form.name,
        },
        fields
      );
      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save form');
    } finally {
      setIsSaving(false);
    }
  };

  if (!form) return <div>Form not found</div>;

  if (isSuccess) {
    return <SuccessScreen formId={form.id} formName={form.name} />;
  }

  return (
    <Container>
      <Section>
        <Title>Add New Questions</Title>
        {fields.map(field => (
          <FieldContainer key={field.id}>
            <Label>Question Type</Label>
            <Select
              value={field.type}
              onChange={e =>
                handleFieldChange(field.id, {
                  type: e.target.value as 'text' | 'number' | 'select' | 'textarea',
                })
              }
            >
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="select">Select</option>
              <option value="textarea">Text Area</option>
            </Select>

            <Label>Question</Label>
            <Input
              type="text"
              value={field.label}
              onChange={e => handleFieldChange(field.id, { label: e.target.value })}
              placeholder="Enter your question"
            />
          </FieldContainer>
        ))}
        <Button onClick={handleAddField}>Add New Question</Button>
        <SaveButton onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Form'}
        </SaveButton>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </Section>

      <Section>
        <Title>Form Questions</Title>
        {fields.map((field, index) => (
          <PreviewQuestion key={field.id}>
            <QuestionNumber>Question {index + 1}</QuestionNumber>
            <QuestionType>{field.type.charAt(0).toUpperCase() + field.type.slice(1)}</QuestionType>
            <QuestionText>{field.label || 'No question text'}</QuestionText>
          </PreviewQuestion>
        ))}
        {fields.length === 0 && <div>No questions added yet</div>}
      </Section>
    </Container>
  );
}
