/// <reference types="vite-plugin-svgr/client" />
import styles from "./InputPassword.module.scss";
import Input, { InputFieldProps } from "../Input/Input.tsx";
import EyeOpen from "../../assets/images/icons/eye_open.svg?react";
import EyeClose from "../../assets/images/icons/eye_close.svg?react";
import { Dispatch, forwardRef, SetStateAction } from "react";

interface InputPasswordProps extends InputFieldProps {
    isVisible: boolean;
    setIsVisible: Dispatch<SetStateAction<boolean>>;
}

const InputPassword = forwardRef<HTMLInputElement, InputPasswordProps>(
    (props, ref) => {
        const { isVisible, setIsVisible, ...rest } = props;

        return (
            <Input ref={ref} {...rest} type={isVisible ? "text" : "password"}>
                {isVisible ? (
                    <EyeClose className={styles.icon} onClick={() => setIsVisible(false)} />
                ) : (
                    <EyeOpen
                        className={styles.icon}
                        onClick={() => setIsVisible(true)}
                    />
                )}
            </Input>
        );
    },
);

export default InputPassword;
