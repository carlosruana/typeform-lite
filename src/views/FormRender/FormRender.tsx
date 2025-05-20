import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { formsService } from '../../services/forms';
import { responsesService } from '../../services/responses';
import type { Form, DBFormField } from '../../services/forms';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.lg};
  }
`;

const QuestionCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  width: 100%;
  max-width: 600px;
  transition: transform 0.3s ease;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing.lg};
  }
`;

const Progress = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.gray[600]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Question = styled.h2`
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  line-height: 1.3;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
  }
`;

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.lg};
  border: 2px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  transition: all 0.2s ease;
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing.md};
    font-size: ${({ theme }) => theme.typography.fontSize.md};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.lg};
  border: 2px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  min-height: 150px;
  resize: vertical;
  transition: all 0.2s ease;
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing.md};
    font-size: ${({ theme }) => theme.typography.fontSize.md};
    min-height: 120px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column-reverse;
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme, variant }) =>
    variant === 'primary' ? theme.colors.primary : theme.colors.white};
  color: ${({ theme, variant }) =>
    variant === 'primary' ? theme.colors.white : theme.colors.gray[700]};
  border: 2px solid
    ${({ theme, variant }) =>
      variant === 'primary' ? theme.colors.primary : theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadows.sm};
    background-color: ${({ theme, variant }) =>
      variant === 'primary' ? theme.colors.secondary : theme.colors.gray[100]};
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 100%;
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.danger};
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.danger}10;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const SuccessMessage = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.colors.success};
  padding: ${({ theme }) => theme.spacing.xl};

  h2 {
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing.lg};

    h2 {
      font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
    }
  }
`;

export default function FormRender() {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<(Form & { fields: DBFormField[] }) | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadForm = async () => {
      try {
        if (!formId) throw new Error('No form ID provided');
        const loadedForm = await formsService.getForm(formId);
        setForm(loadedForm);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Form not found');
      } finally {
        setIsLoading(false);
      }
    };

    loadForm();
  }, [formId]);

  if (isLoading) {
    return <Container>Loading...</Container>;
  }

  if (error || !form) {
    return (
      <Container>
        <ErrorMessage>{error || 'Form not found'}</ErrorMessage>
      </Container>
    );
  }

  if (isSubmitted) {
    return (
      <Container>
        <SuccessMessage>
          <h2>Thank you for completing the form!</h2>
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </SuccessMessage>
      </Container>
    );
  }

  const currentField = form.fields[currentQuestion];
  const isLastQuestion = currentQuestion === form.fields.length - 1;
  const isFirstQuestion = currentQuestion === 0;

  const handleNext = () => {
    if (!isLastQuestion) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstQuestion) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleAnswerChange = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentField.id]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const formattedAnswers = Object.entries(answers).map(([field_id, value]) => ({
        field_id,
        value,
      }));

      await responsesService.saveResponse(form.id, formattedAnswers);
      setIsSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit form');
    }
  };

  const renderInput = () => {
    switch (currentField.type) {
      case 'textarea':
        return (
          <TextArea
            value={answers[currentField.id] || ''}
            onChange={e => handleAnswerChange(e.target.value)}
            placeholder="Enter your answer"
          />
        );
      case 'number':
        return (
          <Input
            type="number"
            value={answers[currentField.id] || ''}
            onChange={e => handleAnswerChange(e.target.value)}
            placeholder="Enter your answer"
          />
        );
      default:
        return (
          <Input
            type="text"
            value={answers[currentField.id] || ''}
            onChange={e => handleAnswerChange(e.target.value)}
            placeholder="Enter your answer"
          />
        );
    }
  };

  return (
    <Container>
      <QuestionCard>
        <Progress>
          Question {currentQuestion + 1} of {form.fields.length}
        </Progress>
        <Question>{currentField.label}</Question>
        {renderInput()}
        <ButtonGroup>
          <Button variant="secondary" onClick={handlePrevious} disabled={isFirstQuestion}>
            Previous
          </Button>
          {isLastQuestion ? (
            <Button variant="primary" onClick={handleSubmit}>
              Submit
            </Button>
          ) : (
            <Button variant="primary" onClick={handleNext}>
              Next
            </Button>
          )}
        </ButtonGroup>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </QuestionCard>
    </Container>
  );
}
