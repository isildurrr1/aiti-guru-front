import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLoginMutation } from 'entities/user/api/authApi'
import { saveTokens } from 'shared/lib/tokenStorage'
import type { FormErrors } from './types'

/** Переводит ошибку RTK Query в человекочитаемое сообщение */
function resolveApiError(error: unknown): string {
  if (error && typeof error === 'object' && 'status' in error) {
    const e = error as { status: number | string; data?: { message?: string } }

    if (e.status === 400 || e.status === 401) {
      const msg = e.data?.message ?? ''
      if (msg.toLowerCase().includes('invalid credentials')) {
        return 'Неверный логин или пароль'
      }
      return msg || 'Неверный логин или пароль'
    }

    if (e.status === 'FETCH_ERROR') {
      return 'Сервер недоступен. Проверьте подключение'
    }

    if (typeof e.status === 'number' && e.status >= 500) {
      return 'Ошибка сервера. Попробуйте позже'
    }
  }

  return 'Ошибка авторизации. Попробуйте позже'
}

export function useLoginForm() {
  const navigate = useNavigate()
  const [loginValue, setLoginState] = useState('')
  const [password, setPasswordState] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  const [loginMutation, { isLoading }] = useLoginMutation()

  /** Сеттеры с автоочисткой ошибки поля при вводе (тест V-08) */
  const setLogin = useCallback((value: string) => {
    setLoginState(value)
    setErrors((prev) => (prev.login ? { ...prev, login: undefined } : prev))
  }, [])

  const setPassword = useCallback((value: string) => {
    setPasswordState(value)
    setErrors((prev) => (prev.password ? { ...prev, password: undefined } : prev))
  }, [])

  const validate = useCallback((): boolean => {
    const e: FormErrors = {}
    if (!loginValue.trim()) e.login = 'Введите логин'
    if (!password) e.password = 'Введите пароль'
    else if (password.length < 6) e.password = 'Минимум 6 символов'
    setErrors(e)
    return Object.keys(e).length === 0
  }, [loginValue, password])

  const handleSubmit = useCallback(async () => {
    // Валидация — запрос не уходит при ошибках (тесты V-01..V-07, S-02)
    if (!validate()) return

    setErrors({})

    try {
      const data = await loginMutation({
        username: loginValue.trim(),
        password,
      }).unwrap()

      // localStorage если "запомнить", sessionStorage если нет (тесты T-01..T-04)
      saveTokens(data.accessToken, data.refreshToken, rememberMe)

      navigate('/')
    } catch (error) {
      // При ошибке токены не сохраняются, кнопка разблокируется (тесты T-05, S-03)
      setErrors({ form: resolveApiError(error) })
    }
  }, [loginValue, password, rememberMe, validate, loginMutation, navigate])

  /** Очистка поля + ошибки логина (тест V-09) */
  const clearLogin = useCallback(() => {
    setLoginState('')
    setErrors((prev) => ({ ...prev, login: undefined }))
  }, [])

  return {
    login: loginValue,
    setLogin,
    password,
    setPassword,
    rememberMe,
    setRememberMe,
    isLoading,
    errors,
    handleSubmit,
    clearLogin,
  }
}
