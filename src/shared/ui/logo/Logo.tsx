import logoUrl from "shared/assets/images/logo.svg";

export function Logo() {
  return (
    <div className="flex justify-center">
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-b from-[#ededed]/25 to-white flex items-center justify-center shadow-md border-[3px] border-white ring-1 ring-[#ededed]">
        <img src={logoUrl} alt="Aiti Guru" className="w-7 h-7 sm:w-8 sm:h-8" />
      </div>
    </div>
  );
}
