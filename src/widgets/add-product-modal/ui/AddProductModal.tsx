import { useState } from 'react'
import { toast } from 'sonner'
import { X } from 'lucide-react'
import { Input } from 'shared/ui/input'
import { Button } from 'shared/ui/button'
import { Card } from 'shared/ui/card'
import type { IAddProductModalProps, IFormFields, IFormErrors } from '../model/types'

const INITIAL_FIELDS: IFormFields = { title: '', price: '', brand: '', sku: '' }

function validate(fields: IFormFields): IFormErrors {
  const e: IFormErrors = {}
  if (!fields.title.trim()) e.title = 'Введите наименование'
  if (!fields.price.trim()) e.price = 'Введите цену'
  else if (isNaN(Number(fields.price)) || Number(fields.price) <= 0) e.price = 'Некорректная цена'
  if (!fields.brand.trim()) e.brand = 'Введите вендора'
  if (!fields.sku.trim()) e.sku = 'Введите артикул'
  return e
}

export function AddProductModal({ isOpen, onClose }: IAddProductModalProps) {
  const [fields, setFields] = useState<IFormFields>(INITIAL_FIELDS)
  const [errors, setErrors] = useState<IFormErrors>({})

  if (!isOpen) return null

  const set = (key: keyof IFormFields) => (value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const handleSubmit = () => {
    const e = validate(fields)
    if (Object.keys(e).length > 0) {
      setErrors(e)
      return
    }
    toast.success('Товар успешно добавлен')
    setFields(INITIAL_FIELDS)
    setErrors({})
    onClose()
  }

  const handleClose = () => {
    setFields(INITIAL_FIELDS)
    setErrors({})
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/40"
      onClick={handleClose}
    >
      <div className="w-full max-w-[480px] rounded-3xl bg-gray-50" onClick={(e) => e.stopPropagation()}>
        <Card className="relative">
          {/* Заголовок */}
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Добавить товар</h2>
            <button
              type="button"
              onClick={handleClose}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-black/5"
            >
              <X size={18} />
            </button>
          </div>

          {/* Поля */}
          <div className="flex flex-col gap-4">
            <Input
              label="Наименование"
              placeholder="Введите наименование"
              value={fields.title}
              onChange={(e) => set('title')(e.target.value)}
              error={errors.title}
            />
            <Input
              label="Цена, ₽"
              placeholder="0.00"
              value={fields.price}
              onChange={(e) => {
                const val = e.target.value
                if (/^\d*\.?\d*$/.test(val)) set('price')(val)
              }}
              inputMode="decimal"
              error={errors.price}
            />
            <Input
              label="Вендор"
              placeholder="Введите вендора"
              value={fields.brand}
              onChange={(e) => set('brand')(e.target.value)}
              error={errors.brand}
            />
            <Input
              label="Артикул"
              placeholder="Введите артикул"
              value={fields.sku}
              onChange={(e) => set('sku')(e.target.value)}
              error={errors.sku}
            />
          </div>

          {/* Кнопки */}
          <div className="mt-8">
            <Button variant="primary" size="lg" className="w-full" onClick={handleSubmit}>
              Добавить
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
