/**
 * ADB Command data for VR Key Mapper
 * Crimson Terminal — Curated ADB commands for VR headsets (Meta Quest, Pico, etc.)
 */

export interface AdbCommand {
  id: string;
  label: string;
  command: string;
  description: string;
  platform?: string;
}

export interface AdbCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  commands: AdbCommand[];
}

export const adbCategories: AdbCategory[] = [
  {
    id: "device",
    name: "Device Info",
    icon: "cpu",
    color: "#EF4444",
    commands: [
      {
        id: "dev-1",
        label: "List Connected Devices",
        command: "adb devices",
        description: "Shows all connected ADB devices and their status.",
      },
      {
        id: "dev-2",
        label: "Device Properties",
        command: "adb shell getprop",
        description: "Dumps all system properties of the connected VR headset.",
      },
      {
        id: "dev-3",
        label: "Android Version",
        command: "adb shell getprop ro.build.version.release",
        description: "Returns the Android OS version running on the headset.",
      },
      {
        id: "dev-4",
        label: "Device Model",
        command: "adb shell getprop ro.product.model",
        description: "Returns the device model name.",
      },
      {
        id: "dev-5",
        label: "Battery Status",
        command: "adb shell dumpsys battery",
        description: "Shows battery level, temperature, and charging state.",
      },
      {
        id: "dev-6",
        label: "Screen Resolution",
        command: "adb shell wm size",
        description: "Returns the current screen resolution of the headset.",
      },
      {
        id: "dev-7",
        label: "Uptime",
        command: "adb shell uptime",
        description: "Shows how long the device has been running since last boot.",
      },
      {
        id: "dev-8",
        label: "Kernel Version",
        command: "adb shell uname -a",
        description: "Displays kernel version and system information.",
      },
      {
        id: "dev-9",
        label: "Build Fingerprint",
        command: "adb shell getprop ro.build.fingerprint",
        description: "Shows the unique build identifier for the device.",
      },
      {
        id: "dev-10",
        label: "Thermal Info (ROOT)",
        command: "adb shell cat /sys/class/thermal/thermal_zone0/temp",
        description: "[ROOT] Displays device temperature sensor data.",
      },
    ],
  },
  {
    id: "apps",
    name: "App Management",
    icon: "package",
    color: "#EF4444",
    commands: [
      {
        id: "app-1",
        label: "List All Packages",
        command: "adb shell pm list packages",
        description: "Lists all installed packages on the headset.",
      },
      {
        id: "app-2",
        label: "List 3rd Party Apps",
        command: "adb shell pm list packages -3",
        description: "Lists only sideloaded / third-party apps.",
      },
      {
        id: "app-3",
        label: "Install APK",
        command: "adb install -r path/to/app.apk",
        description: "Installs (or reinstalls) an APK onto the headset.",
      },
      {
        id: "app-4",
        label: "Uninstall App",
        command: "adb uninstall com.package.name",
        description: "Removes an app by its package name.",
      },
      {
        id: "app-5",
        label: "Launch App",
        command: "adb shell monkey -p com.package.name -c android.intent.category.LAUNCHER 1",
        description: "Launches an app by its package name.",
      },
      {
        id: "app-6",
        label: "Force Stop App",
        command: "adb shell am force-stop com.package.name",
        description: "Force stops a running application.",
      },
      {
        id: "app-7",
        label: "Clear App Data",
        command: "adb shell pm clear com.package.name",
        description: "Wipes all data and cache for the specified app.",
      },
      {
        id: "app-8",
        label: "Get App Size",
        command: "adb shell pm dump com.package.name | grep -i size",
        description: "Shows installed app size and cache information.",
      },
      {
        id: "app-9",
        label: "List App Permissions",
        command: "adb shell pm dump com.package.name | grep -i permission",
        description: "Lists all permissions granted to an app.",
      },
      {
        id: "app-10",
        label: "Enable App (ROOT)",
        command: "adb shell pm enable com.package.name",
        description: "[ROOT] Re-enables a previously disabled app.",
      },
      {
        id: "app-11",
        label: "Disable App (ROOT)",
        command: "adb shell pm disable-user com.package.name",
        description: "[ROOT] Disables an app without uninstalling it.",
      },
      {
        id: "app-12",
        label: "Get App Version",
        command: "adb shell dumpsys package com.package.name | grep versionName",
        description: "Displays the installed version of an app.",
      },
    ],
  },
  {
    id: "keymapping",
    name: "Key Mapping",
    icon: "keyboard",
    color: "#EF4444",
    commands: [
      {
        id: "key-1",
        label: "Send Keyevent — Home",
        command: "adb shell input keyevent KEYCODE_HOME",
        description: "Simulates pressing the Home button.",
      },
      {
        id: "key-2",
        label: "Send Keyevent — Back",
        command: "adb shell input keyevent KEYCODE_BACK",
        description: "Simulates pressing the Back button.",
      },
      {
        id: "key-3",
        label: "Send Keyevent — Volume Up",
        command: "adb shell input keyevent KEYCODE_VOLUME_UP",
        description: "Simulates pressing Volume Up.",
      },
      {
        id: "key-4",
        label: "Send Keyevent — Volume Down",
        command: "adb shell input keyevent KEYCODE_VOLUME_DOWN",
        description: "Simulates pressing Volume Down.",
      },
      {
        id: "key-5",
        label: "Send Keyevent — Power",
        command: "adb shell input keyevent KEYCODE_POWER",
        description: "Simulates pressing the Power button.",
      },
      {
        id: "key-6",
        label: "Tap Screen Coordinates",
        command: "adb shell input tap 540 960",
        description: "Simulates a tap at X=540, Y=960. Change coordinates as needed.",
      },
      {
        id: "key-7",
        label: "Swipe Gesture",
        command: "adb shell input swipe 100 500 900 500 300",
        description: "Swipes from (100,500) to (900,500) over 300ms.",
      },
      {
        id: "key-8",
        label: "Text Input",
        command: 'adb shell input text "Hello VR"',
        description: "Types text into the currently focused input field.",
      },
      {
        id: "key-9",
        label: "Long Press",
        command: "adb shell input swipe 540 960 540 960 500",
        description: "Simulates a long press (hold) at screen coordinates.",
      },
      {
        id: "key-10",
        label: "Double Tap",
        command: "adb shell input tap 540 960 && sleep 0.1 && adb shell input tap 540 960",
        description: "Performs a double-tap at specified coordinates.",
      },
      {
        id: "key-11",
        label: "Send Keyevent — Menu",
        command: "adb shell input keyevent KEYCODE_MENU",
        description: "Simulates pressing the Menu button.",
      },
      {
        id: "key-12",
        label: "Send Keyevent — App Switch",
        command: "adb shell input keyevent KEYCODE_APP_SWITCH",
        description: "Opens the app switcher/recent apps menu.",
      },
      {
        id: "key-13",
        label: "Pinch Zoom",
        command: "adb shell input swipe 200 500 800 500 100",
        description: "Simulates a pinch/zoom gesture across the screen.",
      },
    ],
  },
  {
    id: "display",
    name: "Display & Performance",
    icon: "monitor",
    color: "#EF4444",
    commands: [
      {
        id: "disp-1",
        label: "Screenshot",
        command: "adb shell screencap -p /sdcard/screenshot.png && adb pull /sdcard/screenshot.png",
        description: "Captures a screenshot and pulls it to your PC.",
      },
      {
        id: "disp-2",
        label: "Screen Record",
        command: "adb shell screenrecord /sdcard/record.mp4",
        description: "Records the screen to /sdcard/record.mp4. Press Ctrl+C to stop.",
      },
      {
        id: "disp-3",
        label: "Set Refresh Rate (90Hz)",
        command: "adb shell settings put system peak_refresh_rate 90",
        description: "Sets the display refresh rate to 90Hz (Quest 2/3).",
      },
      {
        id: "disp-4",
        label: "Set Refresh Rate (120Hz)",
        command: "adb shell settings put system peak_refresh_rate 120",
        description: "Sets the display refresh rate to 120Hz (Quest 3/Pro).",
      },
      {
        id: "disp-5",
        label: "GPU Performance Mode",
        command: "adb shell setprop debug.oculus.gpuLevel 4",
        description: "Sets GPU to max performance level on Oculus/Meta devices.",
      },
      {
        id: "disp-6",
        label: "CPU Performance Mode",
        command: "adb shell setprop debug.oculus.cpuLevel 4",
        description: "Sets CPU to max performance level on Oculus/Meta devices.",
      },
      {
        id: "disp-7",
        label: "Brightness Control",
        command: "adb shell settings put system screen_brightness 200",
        description: "Adjusts screen brightness (0-255, higher = brighter).",
      },
      {
        id: "disp-8",
        label: "Disable Screen Timeout",
        command: "adb shell settings put system screen_off_timeout 2147483647",
        description: "Warning: do not set debug.oculus.vsyncEmu above 1. It can fry your headset and may cause artifacting and glitching. Pairing this with debug.oculus.refreshRate bypasses the headset's maximum and minimum refresh-rate limits while tuning frame sync and performance timing
      },
      {
        id: "disp-9",
        label: "Enable Screen Timeout",
        command: "adb shell settings put system screen_off_timeout 30000",
        description: "Sets screen timeout back to 30 seconds.",
      },
      {
        id: "disp-10",
        label: "Disable Night Light (ROOT)",
        command: "adb shell settings put secure night_display_activated 0",
        description: "[ROOT] Disables night light/blue light filter.",
      },
    ],
  },
  {
    id: "files",
    name: "File Transfer",
    icon: "folder",
    color: "#EF4444",
    commands: [
      {
        id: "file-1",
        label: "Push File to Device",
        command: "adb push localfile.txt /sdcard/localfile.txt",
        description: "Copies a file from your PC to the headset's storage.",
      },
      {
        id: "file-2",
        label: "Pull File from Device",
        command: "adb pull /sdcard/file.txt ./file.txt",
        description: "Downloads a file from the headset to your PC.",
      },
      {
        id: "file-3",
        label: "List Files",
        command: "adb shell ls /sdcard/",
        description: "Lists files in the /sdcard/ directory.",
      },
      {
        id: "file-4",
        label: "Delete File",
        command: "adb shell rm /sdcard/file.txt",
        description: "Deletes a file from the headset.",
      },
      {
        id: "file-5",
        label: "Create Directory",
        command: "adb shell mkdir /sdcard/MyFolder",
        description: "Creates a new directory on the headset.",
      },
      {
        id: "file-6",
        label: "Copy File",
        command: "adb shell cp /sdcard/file1.txt /sdcard/file1_backup.txt",
        description: "Copies a file to a new location on the headset.",
      },
      {
        id: "file-7",
        label: "Move File",
        command: "adb shell mv /sdcard/file.txt /sdcard/NewFolder/file.txt",
        description: "Moves or renames a file on the headset.",
      },
      {
        id: "file-8",
        label: "Check File Size",
        command: "adb shell ls -lh /sdcard/file.txt",
        description: "Shows file size and details in human-readable format.",
      },
      {
        id: "file-9",
        label: "Find Files",
        command: "adb shell find /sdcard -name '*.apk'",
        description: "Searches for files matching a pattern (e.g., all APKs).",
      },
    ],
  },
  {
    id: "network",
    name: "Network & Wireless",
    icon: "wifi",
    color: "#EF4444",
    commands: [
      {
        id: "net-1",
        label: "Connect via Wi-Fi (ADB over TCP)",
        command: "adb tcpip 5555 && adb connect 192.168.x.x:5555",
        description: "Enables wireless ADB. Replace IP with your headset's IP address.",
      },
      {
        id: "net-2",
        label: "Get Device IP Address",
        command: "adb shell ip addr show wlan0",
        description: "Shows the Wi-Fi IP address of the headset.",
      },
      {
        id: "net-3",
        label: "Disconnect Wireless ADB",
        command: "adb disconnect",
        description: "Disconnects all wireless ADB connections.",
      },
      {
        id: "net-4",
        label: "Ping Test",
        command: "adb shell ping -c 4 8.8.8.8",
        description: "Pings Google DNS to test network connectivity.",
      },
      {
        id: "net-5",
        label: "Enable USB Debugging (reminder)",
        command: "adb shell settings put global development_settings_enabled 1",
        description: "Ensures developer settings are enabled.",
      },
      {
        id: "net-6",
        label: "Check WiFi Status",
        command: "adb shell dumpsys wifi | grep 'mWifiState'",
        description: "Shows current WiFi connection status.",
      },
      {
        id: "net-7",
        label: "List WiFi Networks",
        command: "adb shell cmd wifi list-networks",
        description: "Displays all saved WiFi networks on the device.",
      },
      {
        id: "net-8",
        label: "Get Device MAC Address",
        command: "adb shell cat /sys/class/net/wlan0/address",
        description: "Shows the device's MAC address for network identification.",
      },
      {
        id: "net-9",
        label: "DNS Lookup",
        command: "adb shell nslookup google.com",
        description: "Tests DNS resolution by looking up a domain.",
      },
    ],
  },
  {
    id: "debug",
    name: "ADb's",
    icon: "terminal",
    color: "#EF4444",
    commands: [
      {
        id: "dbg-1",
        label: "Head fly",
        command: "adb shell Z_MULTIPLIER=-45; Y_MULTIPLIER=35; MAX_STEPS=80; SLEEP_TIME=0.002; setprop debug.oculus.headlock 1; setprop debug.force-opengl 1; setprop debug.hwc.force_gpu_vsync 1; setprop debug.performance.profile 1; settings put global window_animation_scale 0.0; settings put global transition_animation_scale 0.0; settings put global animator_duration_scale 0.0; i=1; while [ $i -lt $MAX_STEPS ]; do z_total=$((i * Z_MULTIPLIER)); z_abs=$((z_total < 0 ? -z_total : z_total)); z_whole=$((z_abs / 100)); z_frac=$((z_abs % 100)); val_z=$(printf \"-%d.%02d\" $z_whole $z_frac); y_total=$((i * Y_MULTIPLIER)); y_abs=$((y_total < 0 ? -y_total : y_total)); y_whole=$((y_abs / 100)); y_frac=$((y_abs % 100)); val_y=$(printf \"%d.%02d\" $y_whole $y_frac); setprop debug.oculus.headlock.translation.z \"$val_z\"; setprop debug.oculus.headlock.translation.y \"$val_y\"; sleep $SLEEP_TIME; i=$((i + 1)); done; setprop debug.oculus.headlock.translation.z 0; setprop debug.oculus.headlock.translation.y 0; setprop debug.oculus.headlock.translation.x 0; setprop debug.oculus.headlock 0; cmd power set-fixed-performance-mode-enabled true; settings put system peak_refresh_rate 90.0; settings put system min_refresh_rate 90.0",
        description: "Advanced head-tracking simulation with smooth animation loop and performance optimization.",
      },
      {
        id: "dbg-2",
        label: "Hertz switcher",
        command: "adb shell setprop debug.oculus.cpuLevel 0; setprop debug.oculus.PhaseSyncAdditionalPadding 100; setprop debug.oculus.KickoffHeadroom 1; setprop debug.oculus.vsyncEmu 1; setprop debug.oculus.forcePhaseSync 1.8; setprop debug.oculus.extraKickoffHeadroom 1; setprop debug.oculus.refreshRate 60; setprop debug.oculus.swapInterval 1; setprop debug.oculus.useFrameSync 1.4; setprop debug.oculus.vSync 1; setprop debug.oculus.extraKickoffHeadspace 1; setprop debug.oculus.PhaseSyncDelayOverride 100; setprop debug.oculus.phaseSync 100",
        description: "Optimizes refresh rate, frame sync, and performance timing for smooth VR experience.",
      },
      {
        id: "dbg-3",
        label: "Pull mod",
        command: "adb shell setprop debug.oculus.headlock 1; i=1; while [ $i -lt 30 ]; do setprop debug.oculus.headlock.translation.x $(awk -v i=$i 'BEGIN {print i * 0.5}'); i=$((i + 1)); done; setprop debug.oculus.headlock.translation.x 0; setprop debug.oculus.headlock 0",
        description: "Smooth head-lock translation pull animation test with incremental X-axis movement.",
      },
      {
        id: "dbg-4",
        label: "Long arms",
        command: "adb shell setprop debug.oculus.headlock -1 && setprop debug.oculus.headlock.translation.z -26 && setprop debug.oculus.tracking.prediction 1 && setprop debug.oculus.controller.predictionTimeOffset 0.012 && setprop debug.oculus.headlock 3",
        description: "Extended arm reach with Z-axis offset and enhanced controller prediction for better tracking.",
      },
      {
        id: "dbg-5",
        label: "Preds",
        command: "adb shell setprop debug.oculus.predInterval 4; setprop debug.oculus.vrapi.predictedDisplayTime 4; setprop debug.oculus.predLevel 3; setprop debug.oculus.leftCtrlr.predInterval 4; setprop debug.oculus.leftCtrlr.velScale 2; setprop debug.oculus.leftCtrlr.extraPred 1; setprop debug.oculus.rightCtrlr.predInterval 4; setprop debug.oculus.rightCtrlr.velScale 2; setprop debug.oculus.rightCtrlr.extraPred 1; setprop debug.oculus.trackingPrediction 1; setprop debug.oculus.poseExtrapolation 2; setprop debug.oculus.ctrlrPoseStateLatencyMs 0; setprop debug.oculus.disablePredictionCap 1; setprop debug.oculus.cpuLevel 5; setprop debug.oculus.gpuLevel 5; setprop debug.oculus.noThrottle 1; setprop debug.oculus.forceMaxThreadPriority 1; cmd thermalservice override-status 0; cmd power set-mode 1; dumpsys deviceidle disable",
        description: "Maximum prediction interval, controller boost, tracking speed, and system performance optimization. Use in SideQuest or AShell.",
      },
      {
        id: "dbg-6",
        label: "Infinite boundry",
        command: "adb shell setprop debug.oculus.guardian_pause 1",
        description: "Disables Guardian boundary system for unlimited play space. Caution: use in safe environment.",
      },
      {
        id: "dbg-7",
        label: "FOV",
        command: "adb shell setprop debug.oculus.headsetOverride 1 && setprop debug.oculus.captureFovDegrees 140 && setprop debug.oculus.eyeFovUp 70 && setprop debug.oculus.eyeFovDown 70 && setprop debug.oculus.eyeFovInward 70 && setprop debug.oculus.eyeFovOutward 70",
        description: "Customizes field-of-view with 140-degree capture and balanced eye FOV angles for enhanced visual experience.",
      },
      {
        id: "dbg-8",
        label: "PSA",
        command: "adb shell echo 'Slow psa thing...'; setprop debug.oculus.headlock 1; setprop debug.force-opengl 1; setprop debug.hwc.force_gpu_vsync 1; setprop debug.performance.profile 1; settings put global window_animation_scale 0.0; settings put global transition_animation_scale 0.0; settings put global animator_duration_scale 0.0; i=1; while [ $i -lt 80 ]; do setprop debug.oculus.headlock.translation.z \"$(awk -v i=$i 'BEGIN {print i * -0.22}')\"; setprop debug.oculus.headlock.translation.y \"$(awk -v i=$i 'BEGIN {print i * 0.006 + (i % 4) * 0.04 - 0.06}')\"; i=$((i + 1)); done; setprop debug.oculus.headlock.translation.z 0; setprop debug.oculus.headlock.translation.y 0; setprop debug.oculus.headlock.translation.x 0; setprop debug.oculus.headlock 0; cmd power set-fixed-performance-mode-enabled true; settings put system peak_refresh_rate 90.0; settings put system min_refresh_rate 90.0; echo 'done.'",
        description: "Advanced slow PSA animation with complex head-lock trajectory, performance optimization, and smooth motion loop.",
      },
      {
        id: "dbg-9",
        label: "Process List",
        command: "adb shell ps -A",
        description: "Lists all running processes on the device.",
      },
      {
        id: "dbg-10",
        label: "Disk Usage",
        command: "adb shell df -h",
        description: "Shows storage usage and available space.",
      },
      {
        id: "dbg-11",
        label: "System Events (ROOT)",
        command: "adb shell logcat -b events",
        description: "[ROOT] Displays system event logs.",
      },
      {
        id: "dbg-12",
        label: "Crash Logs",
        command: "adb shell logcat -b crash",
        description: "Shows crash and error logs from the system.",
      },
      {
        id: "dbg-13",
        label: "ANR Traces (ROOT)",
        command: "adb shell cat /data/anr/traces.txt",
        description: "[ROOT] Displays ANR (Application Not Responding) traces.",
      },
    ],
  },
  {
    id: "sideload",
    name: "Sideloading & OBB",
    icon: "download",
    color: "#EF4444",
    commands: [
      {
        id: "sl-1",
        label: "Install APK (Allow Downgrade)",
        command: "adb install -r -d path/to/app.apk",
        description: "Installs APK allowing version downgrade.",
      },
      {
        id: "sl-2",
        label: "Push OBB File",
        command: "adb push main.obb /sdcard/Android/obb/com.package.name/main.obb",
        description: "Pushes an OBB expansion file to the correct location.",
      },
      {
        id: "sl-3",
        label: "Grant All Permissions",
        command: "adb shell pm grant com.package.name android.permission.READ_EXTERNAL_STORAGE",
        description: "Grants storage read permission to an app.",
      },
      {
        id: "sl-4",
        label: "Enable Unknown Sources",
        command: "adb shell settings put secure install_non_market_apps 1",
        description: "Allows installation from unknown sources.",
      },
      {
        id: "sl-5",
        label: "Check APK Signature",
        command: "adb shell pm dump com.package.name | grep -i version",
        description: "Shows version info and signature details for an installed app.",
      },
      {
        id: "sl-6",
        label: "Install Multiple APKs",
        command: "adb install-multiple app1.apk app2.apk app3.apk",
        description: "Installs multiple APK files in one command.",
      },
      {
        id: "sl-7",
        label: "Grant Camera Permission (ROOT)",
        command: "adb shell pm grant com.package.name android.permission.CAMERA",
        description: "[ROOT] Grants camera access permission to an app.",
      },
      {
        id: "sl-8",
        label: "Grant Location Permission (ROOT)",
        command: "adb shell pm grant com.package.name android.permission.ACCESS_FINE_LOCATION",
        description: "[ROOT] Grants location access permission to an app.",
      },
      {
        id: "sl-9",
        label: "Set Default Launcher (ROOT)",
        command: "adb shell cmd package set-home-activity com.package.name/.MainActivity",
        description: "[ROOT] Sets a specific app as the default launcher.",
      },
      {
        id: "sl-10",
        label: "Backup App Data (ROOT)",
        command: "adb backup -apk com.package.name",
        description: "[ROOT] Creates a backup of an app and its data.",
      },
    ],
  },
];