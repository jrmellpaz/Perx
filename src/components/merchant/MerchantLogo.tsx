import { cn } from "@/lib/utils";

interface MerchantLogoProps {
  logoClass?: string;
  sublogoClass?: string;
}

export function MerchantLogo({ logoClass="text-xl pb-1", sublogoClass="text-[14px]" }: MerchantLogoProps) {
  return (
    <div className="h-full flex items-center gap-1">  
      <img
          src="/logo.svg"
          alt="Merchant Sign-up Illustration"
          className="h-full w-auto aspect-square"
      />
      <h1 className={cn("lowercase font-bold tracking-tighter", logoClass)}>perx</h1>
      <h1 className={cn("uppercase font-mono font-semibold", sublogoClass)}>MERCHANT</h1>
    </div>
  )
}