import { Capacitor } from '@capacitor/core'

const APP_ID = import.meta.env.VITE_ONESIGNAL_APP_ID

// Only runs on real iOS/Android devices — skipped in browser
export async function initOneSignal() {
  if (!Capacitor.isNativePlatform() || !APP_ID) return
  try {
    const { OneSignal } = await import('@onesignal/capacitor-plugin')
    OneSignal.initialize(APP_ID)
    await OneSignal.Notifications.requestPermission(true)
  } catch (e) {
    console.warn('OneSignal init failed:', e)
  }
}

// Call after login or onboarding to tag the device with department + role
export async function setNotificationTags(agency, staffType) {
  if (!Capacitor.isNativePlatform() || !APP_ID) return
  try {
    const { OneSignal } = await import('@onesignal/capacitor-plugin')
    const tags = {}
    if (agency)    tags.agency     = agency
    if (staffType) tags.staff_type = staffType
    if (Object.keys(tags).length > 0) await OneSignal.User.addTags(tags)
  } catch (e) {
    console.warn('OneSignal tag failed:', e)
  }
}

// Call on logout to clear tags from this device
export async function clearNotificationTags() {
  if (!Capacitor.isNativePlatform() || !APP_ID) return
  try {
    const { OneSignal } = await import('@onesignal/capacitor-plugin')
    await OneSignal.User.removeTags(['agency', 'staff_type'])
  } catch (e) {
    console.warn('OneSignal clear failed:', e)
  }
}
