import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Dialog } from '../../components/Dialog/Dialog';
import { useFormStore } from '../../stores/formStore';

const Container = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  max-width: 800px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.dark};
`;

const Button = styled.button`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-weight: 500;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background-color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.md};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export default function Home() {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newFormName, setNewFormName] = useState('');
  const { forms, addForm } = useFormStore();

  const handleCreateForm = () => {
    if (newFormName.trim()) {
      const formId = crypto.randomUUID();
      addForm({ id: formId, name: newFormName.trim(), fields: [] });
      setNewFormName('');
      setIsDialogOpen(false);
      navigate(`/form/${formId}`);
    }
  };

  const handleFormSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const formId = event.target.value;
    if (formId) {
      navigate(`/form/${formId}`);
    }
  };

  return (
    <Container>
      <Header>
        <Title>Form Builder</Title>
        <Button onClick={() => setIsDialogOpen(true)}>Create New Form</Button>
      </Header>

      <Select onChange={handleFormSelect} value="">
        <option value="" disabled>
          Select a form to edit
        </option>
        {forms.map(form => (
          <option key={form.id} value={form.id}>
            {form.name}
          </option>
        ))}
      </Select>

      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleCreateForm}
        title="Create New Form"
      >
        <Input
          type="text"
          placeholder="Enter form name"
          value={newFormName}
          onChange={e => setNewFormName(e.target.value)}
          autoFocus
        />
      </Dialog>
    </Container>
  );
}
