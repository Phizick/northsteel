/// <reference types="vite-plugin-svgr/client" />
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import LoginIcon from "../../../../assets/images/icons/login.svg?react";

import Form from "../../../../shared/Form/Form.tsx";
import Input from "../../../../shared/Input/Input.tsx";
import InputPassword from "../../../../shared/InputPassword/InputPassword.tsx";
import Button from "../../../../shared/Button/Button.tsx";
import { useNavigate } from "react-router-dom";
import { useStores } from "../../../../stores/root-store-context.ts";
import { LoginRequest } from "../../../../api/login.ts";

const LoginForm = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const { userStore } = useStores();

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>({ mode: "onChange" });

  const onSubmit: SubmitHandler<LoginRequest> = async (data) => {
    await userStore.login(data.username, data.password);

    if (userStore.user) {
      console.log(userStore);
      navigate("/");
    }
  };

  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      errorRequestMessage={userStore.error}
    >
      <Input
        {...register("username", {
          required: "Введите логин",
        })}
        placeholder="Введите логин"
        hasError={Boolean(errors.username)}
        errorMessage={errors.username?.message}
      />
      <InputPassword
        {...register("password", {
          required: "Введите пароль",
        })}
        placeholder="Введите пароль"
        hasError={Boolean(errors.password)}
        errorMessage={errors.password?.message}
        isVisible={isPasswordVisible}
        setIsVisible={setIsPasswordVisible}
      />
      <Button
        disabled={userStore.isLoading}
        isLoading={userStore.isLoading}
        type="submit"
      >
        Войти
        <LoginIcon />
      </Button>
    </Form>
  );
};

export default LoginForm;
