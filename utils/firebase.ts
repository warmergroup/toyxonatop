
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDXPRtRax8xNzu4yHe5Lk2Uk4QH-9dw2CY",
  authDomain: "toyxonachi-47293.firebaseapp.com",
  projectId: "toyxonachi-47293",
  storageBucket: "toyxonachi-47293.firebasestorage.app",
  messagingSenderId: "205020384733",
  appId: "1:205020384733:web:76396fc8013eff01de3a34",
  measurementId: "G-GVJ7P9KLHD"
};

const app = initializeApp(firebaseConfig);

let messaging: ReturnType<typeof getMessaging> | null = null;
let listenerInitialized = false;

// Messaging obyektini asinxron olish
const getMessagingInstance = async () => {
  if (!process.client || typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return null;
  }
  if (!messaging) {
    try {
      const supported = await isSupported();
      if (supported) {
        messaging = getMessaging(app);
      } else {
        console.warn('Firebase messaging qo\'llab-quvvatlanmaydi');
        messaging = null;
      }
    } catch (error) {
      console.warn('Firebase messaging ishga tushirilmadi:', error);
      messaging = null;
    }
  }
  return messaging;
};

// FCM token olish funksiyasi
export async function getFCMToken(vapidKey?: string): Promise<string | null> {
  if (!process.client) {
    console.warn('FCM token faqat client-side\'da olinadi');
    return null;
  }

  const messagingInstance = await getMessagingInstance();
  if (!messagingInstance) {
    console.warn('Firebase messaging mavjud emas');
    return null;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn('Notification permission berilmadi');
      return null;
    }

    if (vapidKey) {
      const token = await getToken(messagingInstance, { vapidKey });
      if (token) {
        localStorage.setItem('fcm_token', token);
        return token;
      }
    } else {
      console.warn('VAPID key mavjud emas, FCM token olinmaydi');
    }
    return null;
  } catch (error) {
    console.error('FCM token olishda xatolik:', error);
    return null;
  }
}

// Foreground message'lar uchun listener
export async function setupForegroundListener() {
  if (!process.client) {
    console.warn('Foreground listener faqat client-side\'da o\'rnatiladi');
    return;
  }
  if (listenerInitialized) return; // Bir marta o‘rnatiladi

  const messagingInstance = await getMessagingInstance();
  if (!messagingInstance) {
    console.warn('Messaging mavjud emas, foreground listener o\'rnatilmaydi');
    return;
  }

  onMessage(messagingInstance, (payload) => {
    console.log('🔔 Notification kelgan:', payload);

    if (Notification.permission === 'granted' && payload.notification) {
      new Notification(
        payload.notification.title ?? 'Yangi xabar',
        {
          body: payload.notification.body ?? '',
          icon: payload.notification.icon ?? '/logo-splash.svg'
        }
      );
    }
  });
  listenerInitialized = true;
}

export { getToken, onMessage };