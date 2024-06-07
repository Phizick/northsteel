/// <reference types="vite-plugin-svgr/client" />
import styles from "./SourceForm.module.scss";
import Form from "../../../shared/Form/Form.tsx";
import { SubmitHandler, useForm } from "react-hook-form";
import Input from "../../../shared/Input/Input.tsx";
import { TrustedSource } from "../../../api/models/User.ts";
import InputPassword from "../../../shared/InputPassword/InputPassword.tsx";
import LinkIcon from "../../../assets/images/icons/link.svg?react";
import PlusIcon from "../../../assets/images/icons/plus.svg?react";
import PlusIconWhite from "../../../assets/images/icons/plus-white.svg?react";
import Checkbox from "../../../shared/Checkbox/Checkbox.tsx";
import ButtonSimple from "../../../shared/ButtonSimple/ButtonSimple.tsx";
import { EditStatus } from "../../../pages/Onboarding/ui/OnboardingSettings/OnboardingSettings.tsx";
import { Dispatch, SetStateAction, useState } from "react";
import { useResize } from "../../../hooks/useResize.tsx";
import Button from "../../../shared/Button/Button.tsx";
import ButtonIcon from "../../../shared/ButtonIcon/ButtonIcon.tsx";
import { ButtonIconTypes } from "../../../shared/ButtonIcon/types";

interface SourceFormProps {
  editStatus: EditStatus | null;
  setEditStatus: Dispatch<SetStateAction<EditStatus | null>>;
  keyToEdit?: number;
  setKeyToEdit?: Dispatch<SetStateAction<number | null>>;
  initialValues?: TrustedSource;
  sources: TrustedSource[];
  setSources: Dispatch<SetStateAction<TrustedSource[]>>;
}

interface SourceForm extends Omit<TrustedSource, "isDefault" | "authEnabled"> {}

const SourceForm = ({
  setEditStatus,
  keyToEdit,
  setKeyToEdit,
  initialValues,
  sources,
  setSources,
}: SourceFormProps) => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<SourceForm>({
    mode: "onChange",
    defaultValues: {
      title: initialValues?.title || "",
      url: initialValues?.url || "",
      login: initialValues?.login || "",
      password: initialValues?.password || "",
    },
  });
  const [authEnabled, setAuthEnabled] = useState<boolean>(
    initialValues?.authEnabled || false,
  );
  const [error, setError] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const { isMobileScreen } = useResize();

  const checkURL = (data: SourceForm) => {
    if (initialValues && initialValues.url === data.url) {
      return true;
    }

    if (sources.some((source) => source.url === data.url)) {
      setError("Источник с данным url уже добавлен");
      return false;
    }

    setError("");
    return true;
  };

  const onSubmit: SubmitHandler<SourceForm> = async (data) => {
    if (!checkURL(data)) {
      return;
    }

    if (!keyToEdit) {
      const newSource: TrustedSource = {
        title: data.title,
        url: data.url,
        login: data.login,
        password: data.password,
        isDefault: false,
        authEnabled: authEnabled,
      };

      setSources([...sources, newSource]);
    } else if (initialValues) {
      sources[keyToEdit] = {
        ...data,
        isDefault: initialValues.isDefault,
        authEnabled: authEnabled,
      };
    }

    if (keyToEdit !== null && setKeyToEdit) {
      setKeyToEdit(null);
    }

    setEditStatus(null);
  };

  const handleCancel = () => {
    setEditStatus(null);
    if (keyToEdit !== null && setKeyToEdit) {
      setKeyToEdit(null);
    }
  };

  const addButton = () => {
    if (isMobileScreen) {
      return (
        <Button
          className={styles.addButton}
          type="submit"
          onClick={() => setEditStatus("adding")}
        >
          {keyToEdit === undefined && <PlusIconWhite />}
          {keyToEdit === undefined
            ? "Добавить новый источник"
            : "Сохранить изменения"}
        </Button>
      );
    }

    return (
      <ButtonSimple type="submit" onClick={() => setEditStatus("adding")}>
        {keyToEdit === undefined && <PlusIcon />}
        {keyToEdit === undefined
          ? "Добавить новый источник"
          : "Сохранить изменения"}
      </ButtonSimple>
    );
  };

  const cancelButton = () => {
    if (isMobileScreen) {
      return (
        <ButtonIcon
          type="button"
          icon={ButtonIconTypes.CANCEL}
          onClick={handleCancel}
        />
      );
    }

    return (
      <ButtonSimple
        className={styles.cancelButton}
        type="button"
        onClick={handleCancel}
      >
        Отмена
      </ButtonSimple>
    );
  };

  return (
    <Form
      className={styles.form}
      onSubmit={handleSubmit(onSubmit)}
      errorRequestMessage={error}
    >
      <div className={styles.mainContainer}>
        <Input
          {...register("title", {
            required: "Введите название источника",
          })}
          placeholder="Название источника"
          hasError={Boolean(errors.title)}
          errorMessage={errors.title?.message}
        />
        <Input
          {...register("url", {
            required: "Введите ссылку на источник",
            pattern: {
              value:
                /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
              message: "Введите корректный url",
            },
            onChange: () => checkURL(getValues()),
          })}
          placeholder="Ссылка на источник"
          hasError={Boolean(errors.url)}
          errorMessage={errors.url?.message}
        >
          <LinkIcon className={styles.linkIcon} />
        </Input>
      </div>
      <Checkbox
        label="Источник закрыт от общего доступа"
        checked={authEnabled}
        onChange={(e) => setAuthEnabled(e.target.checked)}
      />
      {authEnabled && (
        <div className={styles.secondaryContainer}>
          <Input
            {...register("login", {
              required: "Введите логин",
            })}
            placeholder="Введите логин"
            hasError={Boolean(errors.login)}
            errorMessage={errors.login?.message}
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
        </div>
      )}
      <div className={styles.buttonContainer}>
        {addButton()}
        {cancelButton()}
      </div>
    </Form>
  );
};

export default SourceForm;
