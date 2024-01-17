import styled from 'styled-components';

export const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 420px;
  padding: 50px 0px;
`;
export const Title = styled.h1`
  font-size: 42px;
`;
export const LoginForm = styled.form`
  margin-top: 50px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;
export const Input = styled.input`
  padding: 10px 20px;
  border-radius: 50px;
  border: none;
  font-size: 16px;
  &[type='submit'] {
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
  }
`;

export const Error = styled.span`
  font-weight: 600;
  color: tomato;
`;

export const Switcher = styled.span`
  margin-top: 20px;
  width: 100%;
  text-align: center;
  a {
    color: dodgerblue;
    text-decoration: none;
  }
`;

export const GoogleLoginButton = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: center;
  background-color: white;
  width: 100%;
  padding: 10px 20px;
  border-radius: 50px;
  border: none;
  font-size: 16px;
`;
