import styled from "styled-components";
import {SubmitHandler, useForm} from "react-hook-form";
import {useState} from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import {auth} from "../firebase.ts";
import {useNavigate} from "react-router-dom";

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 420px;
  padding: 50px 0px;
`
const Title = styled.h1`
    font-size: 42px;
`
const LoginForm = styled.form`
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`
const Input = styled.input`
  padding: 10px 20px;
  border-radius: 50px;
  border: none;
  font-size: 16px;
  &[type="submit"] {
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
  }
`

interface JoinForm {
    name: string,
    email: string,
    password: string,
}

export default function CreateAccount() {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const {handleSubmit, register} = useForm<JoinForm>()

    const onSubmit: SubmitHandler<JoinForm> = async (data) => {
        if(isLoading) return;
        try {
            setIsLoading(true)
            const credentials = await createUserWithEmailAndPassword(auth, data.email, data.password);
            console.log(credentials.user);
            await updateProfile(credentials.user, {
                displayName: data.name
            })
            navigate("/")
        }
        catch(e) {
        }
        finally {
            setIsLoading(false)
        }
    }
    return <Wrapper>
        <Title>Join 𝕏</Title>
        <LoginForm onSubmit={handleSubmit(onSubmit)}>
            <Input {...register("name", {required: true})} placeholder={'이름을 입력해 주세요.'}/>
            <Input {...register("email", {required: true})} placeholder={'이메일을 입력해 주세요.'}/>
            <Input {...register("password", { minLength: 6, required: true})} type={"password"} placeholder={'비밀번호를 입력해 주세요.'}/>
            <Input type={"submit"} value={isLoading ? "Loading..." : "Create Account"}/>
        </LoginForm>
    </Wrapper>
}