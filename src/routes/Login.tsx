import { SubmitHandler, useForm } from 'react-hook-form';
import { useState } from 'react';
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { auth } from '../firebase.ts';
import { Link, useNavigate } from 'react-router-dom';
import { Error, GoogleLoginButton, Input, LoginForm, Switcher, Title, Wrapper } from '../components/AuthComponent.ts';

interface JoinForm {
  name: string;
  email: string;
  password: string;
}

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { handleSubmit, register } = useForm<JoinForm>();

  const googleLoginHandler = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((data) => {
        if (data !== null) navigate('/');
      })
      .catch((error) => console.log(error));
  };

  const onSubmit: SubmitHandler<JoinForm> = async (data) => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      const credentials = await signInWithEmailAndPassword(auth, data.email, data.password);
      console.log(credentials.user);
      navigate('/');
    } catch (e) {
      if (e instanceof FirebaseError) {
        setErrorMessage(e.code);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Wrapper>
      <Title>Log in to 𝕏</Title>
      <LoginForm onSubmit={handleSubmit(onSubmit)}>
        <Input {...register('email', { required: true })} placeholder={'이메일을 입력해 주세요.'} />
        <Input
          {...register('password', { required: true })}
          type={'password'}
          placeholder={'비밀번호를 입력해 주세요.'}
        />
        <Input type={'submit'} value={isLoading ? 'Loading...' : 'Log in'} />
      </LoginForm>
      {errorMessage !== '' ? <Error>{errorMessage}</Error> : null}
      <Switcher>
        <GoogleLoginButton onClick={googleLoginHandler}>Google 로그인</GoogleLoginButton>
      </Switcher>
      <Switcher>
        아이디가 없으신가요? <Link to={'/create-account'}>가입하기&rarr;</Link>
      </Switcher>
    </Wrapper>
  );
}
