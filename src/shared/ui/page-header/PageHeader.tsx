export interface IPageHeaderProps {
  title: string
  children?: React.ReactNode
}

export function PageHeader({ title, children }: IPageHeaderProps) {
  return (
    <header className="relative flex items-center px-6 h-[100px] bg-white">
      <h1 className="shrink-0 text-2xl font-bold text-gray-900">{title}</h1>
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="pointer-events-auto w-[53%]">
          {children}
        </div>
      </div>
    </header>
  )
}
