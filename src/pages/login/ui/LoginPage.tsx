import { Logo, Card } from "shared/ui";
import { LoginForm } from "features/auth";

export function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-[527px]">
        <Card>
          <div className="flex flex-col items-center gap-2 mb-8 sm:mb-10">
            <Logo />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-4">
              Добро пожаловать!
            </h1>
            <p className="text-sm sm:text-base text-gray-400">
              Пожалуйста, авторизуйтесь
            </p>
          </div>
          <LoginForm />
        </Card>
      </div>
    </div>
  );
}
