// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js')

firebase.initializeApp({
  apiKey: "AIzaSyDXPRtRax8xNzu4yHe5Lk2Uk4QH-9dw2CY",
  authDomain: "toyxonachi-47293.firebaseapp.com",
  projectId: "toyxonachi-47293",
  storageBucket: "toyxonachi-47293.firebasestorage.app",
  messagingSenderId: "205020384733",
  appId: "1:205020384733:web:76396fc8013eff01de3a34",
  measurementId: "G-GVJ7P9KLHD"
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage(function (payload) {
  console.log('[firebase-messaging-sw.js] Background message:', payload)

  const notificationTitle = payload.notification.title || 'Yangi xabar'
  const notificationOptions = {
    body: payload.notification.body || '',
    icon: payload.notification.icon || '/logo-splash.svg'
  }

  self.registration.showNotification(notificationTitle, notificationOptions)
})
