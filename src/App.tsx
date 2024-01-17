import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout.tsx';
import Home from './routes/Home.tsx';
import Profile from './routes/Profile.tsx';
import CreateAccount from './routes/CreateAccount.tsx';
import styled, { createGlobalStyle } from 'styled-components';
import { useEffect, useState } from 'react';
import LoadingScreen from './components/LoadingScreen.tsx';
import reset from 'styled-reset';
import { auth } from './firebase.ts';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import Login from './routes/Login.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '',
        element: <Home />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
    ],
  },
  {
    path: 'create-account/',
    element: <CreateAccount />,
  },
  {
    path: 'login',
    element: <Login />,
  },
]);

const GlobalStyle = createGlobalStyle`
  ${reset};
  * {
    box-sizing: border-box;
  }
  body {
    background-color: black;
    color: white;
    font-family: -apple-system;
  }
`;

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
`;

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const init = async () => {
    await auth.authStateReady();
    setIsLoading(false);
  };

  useEffect(() => {
    init();
  }, []);
  return (
    <div>
      <Wrapper>
        <GlobalStyle />
        {isLoading ? <LoadingScreen /> : <RouterProvider router={router} />}
      </Wrapper>
    </div>
  );
}

export default App;
