import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import styled from 'styled-components';

const Loading = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.primary};
`;

// Lazy load views
const Home = lazy(() => import('./views/Home/Home'));
const FormBuilder = lazy(() => import('./views/FormBuilder/FormBuilder'));
const FormRender = lazy(() => import('./views/FormRender/FormRender'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<Loading>Loading...</Loading>}>
        <Home />
      </Suspense>
    ),
  },
  {
    path: '/form/:formId',
    element: (
      <Suspense fallback={<Loading>Loading...</Loading>}>
        <FormBuilder />
      </Suspense>
    ),
  },
  {
    path: '/preview/:formId',
    element: (
      <Suspense fallback={<Loading>Loading...</Loading>}>
        <FormRender />
      </Suspense>
    ),
  },
]);
