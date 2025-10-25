import { Loader2 } from "lucide-react";

export function SpinnerCustom() {
  return (
  <div className="fixed inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-50">
      <Loader2 className="animate-spin text-blue-600 w-10 h-10" />
    </div>
  )
}
