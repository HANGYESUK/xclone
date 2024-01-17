import { SubmitHandler, useForm } from 'react-hook-form';
import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { auth } from '../firebase.ts';
import { Link, useNavigate } from 'react-router-dom';
import { Error, Input, LoginForm, Switcher, Title, Wrapper } from '../components/AuthComponent.ts';

interface JoinForm {
  name: string;
  email: string;
  password: string;
}

export default function CreateAccount() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { handleSubmit, register } = useForm<JoinForm>();

  const onSubmit: SubmitHandler<JoinForm> = async (data) => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      const credentials = await createUserWithEmailAndPassword(auth, data.email, data.password);
      console.log(credentials.user);
      await updateProfile(credentials.user, {
        displayName: data.name,
      });
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
      <Title>Join 𝕏</Title>
      <LoginForm onSubmit={handleSubmit(onSubmit)}>
        <Input {...register('name', { required: true })} placeholder={'이름을 입력해 주세요.'} />
        <Input {...register('email', { required: true })} placeholder={'이메일을 입력해 주세요.'} />
        <Input
          {...register('password', { required: true })}
          type={'password'}
          placeholder={'비밀번호를 입력해 주세요.'}
        />
        <Input type={'submit'} value={isLoading ? 'Loading...' : 'Create Account'} />
      </LoginForm>
      {errorMessage !== '' ? <Error>{errorMessage}</Error> : null}
      <Switcher>
        아이디가 있으신가요? <Link to={'/login'}>로그인 하기&rarr;</Link>
      </Switcher>
    </Wrapper>
  );
}
