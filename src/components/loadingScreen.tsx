import styled from "styled-components";

export const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-content: center;
`

const Text = styled.span`
  font-size: 24px;
`

export default function LoadingScreen() {
    return <Wrapper><Text>Loading...</Text></Wrapper>
}