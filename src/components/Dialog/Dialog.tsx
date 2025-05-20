import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const DialogContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  min-width: 400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.dark};
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-weight: 500;
  background-color: ${({ theme, variant }) =>
    variant === 'primary' ? theme.colors.primary : theme.colors.light};
  color: ${({ theme, variant }) =>
    variant === 'primary' ? theme.colors.white : theme.colors.dark};
  border: 1px solid
    ${({ theme, variant }) =>
      variant === 'primary' ? theme.colors.primary : theme.colors.secondary};

  &:hover {
    opacity: 0.9;
  }
`;

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: React.ReactNode;
}

export function Dialog({ isOpen, onClose, onConfirm, title, children }: DialogProps) {
  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <DialogContainer onClick={e => e.stopPropagation()}>
        <Title>{title}</Title>
        {children}
        <ButtonGroup>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={onConfirm}>
            Confirm
          </Button>
        </ButtonGroup>
      </DialogContainer>
    </Overlay>
  );
}
