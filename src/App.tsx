import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Layout from "./components/layout.tsx";
import Home from "./routes/home.tsx";
import Profile from "./routes/profile.tsx";
import CreateAccount from "./routes/create-account.tsx";
import styled, {createGlobalStyle} from "styled-components";
import {useEffect, useState} from "react";
import LoadingScreen from "./components/loadingScreen.tsx";
import reset from "styled-reset";
import {auth} from "./firebase.ts";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <Home/>,
      },
      {
        path: "profile",
        element: <Profile/>,
      }
    ]
  },
  {
    path: "create-account/", element: <CreateAccount />,
  }
])


const GlobalStyle  = createGlobalStyle`
  ${reset};
  * {
    box-sizing: border-box;
  }
  body {
    background-color: black;
    color: white;
    font-family: -apple-system;
  }
`

const Wrapper = styled.div`
 height: 100vh;
  display: flex;
  justify-content: center;
`

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const init = async () => {
    await auth.authStateReady();
    setIsLoading(false);
  }

  useEffect(() => {
    init()
  }, [])
  return <div>
  <Wrapper>
    <GlobalStyle/>
    {
      isLoading ? <LoadingScreen/> : <RouterProvider router={router}/>
    }
  </Wrapper>
  </div>

}

export default App
