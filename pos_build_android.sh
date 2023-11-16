sed '/REQUEST_INSTALL_PACKAGES/d' android/capacitor-cordova-android-plugins/src/main/AndroidManifest.xml > android/capacitor-cordova-android-plugins/src/main/AndroidManifest_new.xml 
rm -rf platforms/android/app/src/main/AndroidManifest.xml
mv android/capacitor-cordova-android-plugins/src/main/AndroidManifest_new.xml android/capacitor-cordova-android-plugins/src/main/AndroidManifest.xml