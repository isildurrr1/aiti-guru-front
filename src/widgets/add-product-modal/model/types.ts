export interface IAddProductModalProps {
  isOpen: boolean
  onClose: () => void
}

export interface IFormFields {
  title: string
  price: string
  brand: string
  sku: string
}

export interface IFormErrors {
  title?: string
  price?: string
  brand?: string
  sku?: string
}
