import { User, Lock } from "lucide-react";
import { Button, Input, Checkbox } from "shared/ui";
import { useLoginForm } from "../model/useLoginForm";

export function LoginForm() {
  const {
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
  } = useLoginForm();

  return (
    <div className="flex flex-col gap-5 sm:gap-6 w-full">
      <Input
        label="Логин"
        value={login}
        onChange={(e) => setLogin(e.target.value)}
        onClear={clearLogin}
        placeholder="Введите логин"
        leftIcon={<User size={20} />}
        error={errors.login}
        autoComplete="username"
      />
      <Input
        label="Пароль"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Введите пароль"
        leftIcon={<Lock size={20} />}
        error={errors.password}
        autoComplete="current-password"
      />
      <Checkbox
        label="Запомнить данные"
        checked={rememberMe}
        onChange={(e) => setRememberMe(e.target.checked)}
      />
      {errors.form && (
        <p className="text-sm text-red-500 text-center">{errors.form}</p>
      )}
      <Button
        variant="primary"
        size="lg"
        isLoading={isLoading}
        onClick={handleSubmit}
        className="w-full"
      >
        Войти
      </Button>
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-sm text-gray-400">или</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>
      <p className="text-center text-sm sm:text-base text-gray-500">
        Нет аккаунта?{" "}
        <a
          href="#"
          className="text-indigo-600 font-medium hover:text-indigo-700 underline underline-offset-2 transition-colors"
        >
          Создать
        </a>
      </p>
    </div>
  );
}
