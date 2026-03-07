import { useState, useCallback } from "react";

interface FormErrors {
  login?: string;
  password?: string;
  form?: string;
}

export function useLoginForm() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = useCallback(() => {
    const e: FormErrors = {};
    if (!login.trim()) e.login = "Введите логин";
    if (!password) e.password = "Введите пароль";
    else if (password.length < 6) e.password = "Минимум 6 символов";
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [login, password]);

  const handleSubmit = useCallback(async () => {
    if (!validate()) return;
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1500));
      alert("Авторизация успешна!");
    } catch {
      setErrors({ form: "Ошибка авторизации" });
    } finally {
      setIsLoading(false);
    }
  }, [login, password, rememberMe, validate]);

  const clearLogin = useCallback(() => {
    setLogin("");
    setErrors((p) => ({ ...p, login: undefined }));
  }, []);

  return {
    login,
    setLogin,
    password,
    setPassword,
    rememberMe,
    setRememberMe,
    isLoading,
    errors,
    handleSubmit,
    clearLogin,
  };
}
