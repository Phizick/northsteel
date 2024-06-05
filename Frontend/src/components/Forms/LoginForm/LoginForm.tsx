/// <reference types="vite-plugin-svgr/client" />
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import LoginIcon from '../../../assets/images/icons/login.svg?react'

import Form from "../../../shared/Form/Form.tsx";
import Input from "../../../shared/Input/Input.tsx";
import InputPassword from "../../../shared/InputPassword/InputPassword.tsx";
import Button from "../../../shared/Button/Button.tsx";

interface LoginForm {
    login: string;
    password: string;
}

const LoginForm = () => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginForm>({ mode: "onChange" });

    const onSubmit: SubmitHandler<LoginForm> = async () => {
        console.log('submit')
    };

    return (
        <Form
            onSubmit={handleSubmit(onSubmit)}
        >
            <Input
                {...register("login", {
                    required: 'Введите логин',
                })}
                placeholder="Введите логин"
                hasError={Boolean(errors.login)}
                errorMessage={errors.login?.message}
            />
            <InputPassword
                {...register("password", {
                    required: 'Введите пароль',
                })}
                placeholder='Введите пароль'
                hasError={Boolean(errors.password)}
                errorMessage={errors.password?.message}
                isVisible={isPasswordVisible}
                setIsVisible={setIsPasswordVisible}
            />
            <Button
                disabled={isLoading}
                isLoading={isLoading}
                type="submit"
            >
                Войти
                <LoginIcon/>
            </Button>
        </Form>
    );
};

export default LoginForm;
