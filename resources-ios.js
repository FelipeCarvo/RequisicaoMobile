const fs = require('fs');

function copyImages(sourcePath, targetPath, images) {
  for (const icon of images) {
    let source = sourcePath + icon.source;
    let target = targetPath + icon.target;
    fs.copyFile(source, target, err => {
      if (err) throw err;
      console.log(`${source} >> ${target}`);
    });
  }
}
const SOURCE_IOS_ICON = 'iconIos/';
const SOURCE_IOS_SPLASH = 'resources/ios/splash/';
const TARGET_IOS_ICON = 'ios/App/App/Assets.xcassets/AppIcon.appiconset/';
const TARGET_IOS_SPLASH = 'ios/App/App/Assets.xcassets/Splash.imageset/';
const IOS_ICONS = [
  { source: 'AppIcon-20x20@1x.png', target: 'AppIcon-20x20@1x.png' },
  { source: 'AppIcon-20x20@2x.png', target: 'AppIcon-20x20@2x.png' },
  { source:  'AppIcon-20x20@2x-1.png', target: 'AppIcon-20x20@2x-1.png' },
  { source: 'AppIcon-20x20@3x.png', target: 'AppIcon-20x20@3x.png' },
  { source: 'AppIcon-29x29@1x.png', target: 'AppIcon-29x29@1x.png' },
  { source: 'AppIcon-29x29@2x.png', target: 'AppIcon-29x29@2x.png' },
  { source: 'AppIcon-29x29@2x-1.png', target: 'AppIcon-29x29@2x-1.png' },
  { source: 'AppIcon-29x29@3x.png', target: 'AppIcon-29x29@3x.png' },
  { source: 'AppIcon-40x40@1x.png', target: 'AppIcon-40x40@1x.png' },
  { source: 'AppIcon-40x40@2x.png', target: 'AppIcon-40x40@2x.png' },
  { source: 'AppIcon-40x40@2x-1.png', target: 'AppIcon-40x40@2x-1.png' },
  { source: 'AppIcon-40x40@3x.png' , target: 'AppIcon-40x40@3x.png' },
  { source: 'AppIcon-60x60@2x.png', target: 'AppIcon-60x60@2x.png' },
  { source: 'AppIcon-60x60@3x.png', target: 'AppIcon-60x60@3x.png' },
  { source: 'AppIcon-76x76@1x.png' , target: 'AppIcon-76x76@1x.png' },
  { source: 'AppIcon-76x76@2x.png', target: 'AppIcon-76x76@2x.png' },
  { source: 'AppIcon-83.5x83.5@2x.png', target: 'AppIcon-83.5x83.5@2x.png' },
  { source: 'AppIcon-512@2x.png', target: 'AppIcon-512@2x.png' }
];
const IOS_SPLASHES = [
  { source: 'Default-Portrait@~ipadpro.png', target: 'splash-2732x2732.png' },
  { source: 'Default-Portrait@~ipadpro.png', target: 'splash-2732x2732-1.png' },
  { source: 'Default-Portrait@~ipadpro.png', target: 'splash-2732x2732-2.png' }
];
copyImages(SOURCE_IOS_ICON, TARGET_IOS_ICON, IOS_ICONS);
copyImages(SOURCE_IOS_SPLASH, TARGET_IOS_SPLASH, IOS_SPLASHES);

