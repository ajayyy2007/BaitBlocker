const { withAndroidManifest } = require('@expo/config-plugins');

const withWhatsappListener = (config) => {
  return withAndroidManifest(config, (config) => {
    const androidManifest = config.modResults;
    const application = androidManifest.manifest.application[0];

    if (!application.service) {
      application.service = [];
    }

    application.service.push({
      $: {
        "android:name": "expo.modules.whatsapplistener.WhatsappNotificationService",
        "android:label": "BaitBlocker Scanner",
        "android:permission": "android.permission.BIND_NOTIFICATION_LISTENER_SERVICE"
      },
      "intent-filter": [
        {
          "action": [
            { $: { "android:name": "android.service.notification.NotificationListenerService" } }
          ]
        }
      ]
    });

    return config;
  });
};

module.exports = ({ config }) => {
  return withWhatsappListener(config);
};
