package expo.modules.whatsapplistener

import android.content.Intent
import android.provider.Settings
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class WhatsappListenerModule : Module() {
  companion object {
    var emitMessage: ((String, String) -> Unit)? = null
  }

  override fun definition() = ModuleDefinition {
    Name("WhatsappListener")

    Events("onWhatsAppMessage")

    OnCreate {
      emitMessage = { message: String, sender: String ->
        this@WhatsappListenerModule.sendEvent("onWhatsAppMessage", mapOf(
          "message" to message,
          "sender" to sender
        ))
      }
    }

    AsyncFunction("checkPermissionsAsync") { ->
      val context = appContext.reactContext ?: return@AsyncFunction false
      val enabledListeners = Settings.Secure.getString(context.contentResolver, "enabled_notification_listeners")
      val packageName = context.packageName
      return@AsyncFunction enabledListeners != null && enabledListeners.contains(packageName)
    }

    AsyncFunction("requestPermissionsAsync") { ->
      val context = appContext.reactContext ?: return@AsyncFunction false
      val intent = Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS)
      intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
      context.startActivity(intent)
      return@AsyncFunction true
    }
  }
}
