package expo.modules.whatsapplistener

import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification

class WhatsappNotificationService : NotificationListenerService() {
    override fun onNotificationPosted(sbn: StatusBarNotification?) {
        super.onNotificationPosted(sbn)
        if (sbn == null) return

        val packageName = sbn.packageName
        if (packageName == "com.whatsapp" || packageName == "com.whatsapp.w4b") {
            val extras = sbn.notification.extras
            val title = extras.getString("android.title") ?: "Unknown Sender"
            val text = extras.getCharSequence("android.text")?.toString() ?: ""

            if (text.isNotEmpty() && !text.contains("messages", ignoreCase = true)) {
                WhatsappListenerModule.emitMessage?.invoke(text, title)
            }
        }
    }
}
