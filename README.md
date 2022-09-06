# siecon-req
![](https://img.shields.io/badge/Ionic-v6.20.1-blue) ![](https://img.shields.io/badge/Capacitor-v3.5.1-black) ![](https://img.shields.io/badge/Angular-14.2.0-red) ![](https://img.shields.io/badge/Node-v16.16.0-green)

## :electric_plug: Getting Started ##

Clone this repository
```sh
git clone https://github.com/fastersbrazil/sieconApp.git
cd POLIVIEW/
'npm i' or 'yarn'
'npm install @capacitor/core @capacitor/cli'
```

## :zap: Run ##
* no browser: `npm start`
* no android: `ionic capacitor run android`
* no ios: `ionic capacitor run ios`

## :rocket: Build ##
### - IOS ###
* `npm run generate_apk:ios`
* Confirmar certifcados
* Alterar a versao no XCode
* Confirmar Bundle com.siecon.req.app
* Confirmar dispositivo como any ios Device (arm64)
* fazer o archive e upload pra App Store
### - Android ###
* `npm generate_apk:android`
* Pegar apk no output em ``/android/app/build/outputs/apk``
### - Warning: ###
* :warning:``Certfique-se que tem a dependencia `capacitor-resources` para funcionar o run generate_apk`` e gerar splashScreen com capacitor-resources

## Branch(Develop)
    .
    ├── Main                    # Prod branch
    ├── Develop                 # Dev branch
    ├── old_version_node        # Branch com backup

## :hammer: Dependences ##
```sh

Package                         Version
---------------------------------------------------------
Angular                         CLI: 14.2.0
Node:                           16.16.0
Package Manager:                npm 8.11.0 
@angular-eslint/eslint-plugin   14.0.3,
@angular-devkit/architect       0.1402.0
@angular-devkit/build-angular   14.2.0
@angular-devkit/core            14.2.0
@angular-devkit/schematics      14.2.0
@angular/cdk                    13.3.9
@angular/material               13.3.9
@schematics/angular             14.2.0
rxjs                            6.6.7
typescript                      4.6.4
```
### - DevDependencies
```json
  "devDependencies": {
    "@angular-devkit/build-angular": "^14.2.0",
    "@angular-eslint/builder": "^14.0.3",
    "@angular-eslint/eslint-plugin": "^14.0.3",
    "@angular-eslint/eslint-plugin-template": "~14.0.3",
    "@angular-eslint/template-parser": "~14.0.3",
    "@angular/cli": "^14.2.0",
    "@angular/compiler": "^14.2.0",
    "@angular/compiler-cli": "^14.2.0",
    "@angular/language-service": "^14.2.0",
    "@capacitor/cli": "^4.1.0",
    "@ionic/angular-toolkit": "^4.0.0",
    "@types/jasmine": "~3.6.0",
    "@types/jasminewd2": "~2.0.3",
    "@types/node": "^12.11.1",
    "@typescript-eslint/eslint-plugin": "4.16.1",
    "@typescript-eslint/parser": "4.16.1",
    "eslint": "^7.6.0",
    "eslint-plugin-import": "2.22.1",
    "eslint-plugin-jsdoc": "30.7.6",
    "eslint-plugin-prefer-arrow": "1.2.2",
    "jasmine-core": "~3.8.0",
    "jasmine-spec-reporter": "~5.0.0",
    "jetifier": "^2.0.0",
    "karma": "~6.3.2",
    "karma-chrome-launcher": "~3.1.0",
    "karma-coverage": "~2.0.3",
    "karma-coverage-istanbul-reporter": "~3.0.2",
    "karma-jasmine": "~4.0.0",
    "karma-jasmine-html-reporter": "^1.5.0",
    "protractor": "~7.0.0",
    "ts-node": "~8.3.0",
    "typescript": "~4.6.4"
  }
```

## :fearful: Problems and Solutions(macOs m1) ##
### - IOS ###
Pod install - failed!
```sh
$ sudo arch -x86_64 gem install ffi
$ arch -x86_64 pod install
```
### - Android ###
package android.support.v4.content does not exist!
```sh
npm install jetifier
npx jetify
npx cap sync android
```
