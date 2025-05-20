import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.success};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Message = styled.p`
  color: ${({ theme }) => theme.colors.dark};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const UrlContainer = styled.div`
  background: ${({ theme }) => theme.colors.light};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  width: 100%;
  max-width: 500px;
`;

const Url = styled.a`
  color: ${({ theme }) => theme.colors.primary};
  word-break: break-all;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const Button = styled(Link)`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

interface SuccessScreenProps {
  formId: string;
  formName: string;
}

export function SuccessScreen({ formId, formName }: SuccessScreenProps) {
  const formUrl = `${window.location.origin}/preview/${formId}`;

  return (
    <Container>
      <Title>Form Saved Successfully!</Title>
      <Message>
        Your form "{formName}" has been saved. Share this link with users to let them fill out the
        form:
      </Message>
      <UrlContainer>
        <Url href={formUrl} target="_blank" rel="noopener noreferrer">
          {formUrl}
        </Url>
      </UrlContainer>
      <Button to="/">Back to Forms</Button>
    </Container>
  );
}
