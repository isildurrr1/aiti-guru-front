interface ITopProgressBarProps {
  visible: boolean
}

export function TopProgressBar({ visible }: ITopProgressBarProps) {
  if (!visible) return null

  return (
    <div className="fixed top-0 left-0 z-50 h-[3px] w-full overflow-hidden">
      <div className="h-full w-full animate-progress-bar bg-[#242EDB]" />
    </div>
  )
}
