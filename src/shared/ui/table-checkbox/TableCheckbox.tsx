export interface ITableCheckboxProps {
  checked: boolean
  indeterminate?: boolean
  onChange: (checked: boolean) => void
}

export function TableCheckbox({ checked, indeterminate, onChange }: ITableCheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={indeterminate ? 'mixed' : checked}
      onClick={() => onChange(!checked)}
      className="inline-flex align-middle h-[22px] w-[22px] cursor-pointer shrink-0 items-center justify-center rounded border border-gray-300 outline-none"
      style={{ backgroundColor: checked || indeterminate ? '#3C538E' : '#fff' }}
    />
  )
}
