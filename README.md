# siecon-req

![](https://img.shields.io/badge/Ionic-v6.20.1-blue) ![](https://img.shields.io/badge/Capacitor-v4.1.0-black) ![](https://img.shields.io/badge/Angular-14.2.0-red) ![](https://img.shields.io/badge/Node-v16.16.0-green)

## :electric_plug: Getting Started

Clone this repository

```sh
git clone https://github.com/Poliview-Siecon/RequisicaoMobile.git
cd RequisicaoMobile
'npm i' ou 'yarn'
'npm install @capacitor/core @capacitor/cli'
```

## :zap: Run

* no browser: `npm start`
* no android: `ionic capacitor run android`
* no ios: `ionic capacitor run ios`

## :rocket: Build 

### - IOS

* `npm run generate_apk:ios`
* Confirmar certificados
* Alterar a versao no XCode
* Confirmar Bundle com.siecon.req.app
* Confirmar dispositivo como any ios Device (arm64)
* fazer o archive e upload pra App Store

### - Android

* `npm run generate_apk:android`
* Pegar apk no output em ``/android/app/build/outputs/apk``

### - Warning

* :warning:``Certfique-se que tem a dependencia `capacitor-resources` para funcionar o run generate_apk`` e gerar splashScreen com capacitor-resources

## Branch(Develop)

.
├── Main                    # Prod branch
├── Develop                 # Dev branch
├── old_version_node        # Branch com backup

## :hammer: Dependences

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

## :fearful: Problemas e Soluções(macOs m1)

### - Solução IOS

Pod install - failed!

```sh
sudo arch -x86_64 gem install ffi
arch -x86_64 pod install
```

### - Solução Android

package android.support.v4.content does not exist!

```sh
npm install jetifier
npx jetify
npx cap sync android
```

## Publicar Apps

### Android

```sh
npx cap sync
npm run generate_apk:android
npm run pos_build_android
npx cap open android
```

Dentro do Android Studio procure pelo arquivo **"build.gradle"** módulo android.app (android/app/build.gradle).

Procure por **versionName** e modifique de acordo com a versão atual como o usuário enxerga.

Procure por **versionCode** e modifique de acordo com a versão atual, mas de forma que o site do google enxerga.

Depois acesse o menu Build->"Generate Signed Bundle / APK"

Siga os passos na tela.

O arquivo será gerado na pasta {raizdoprojeto}/android/app/release

#### IOS

```sh
npx cap sync
npm run generate_apk:ios
npx cap open ios
```

Após abrir o xcode garantir que as permissões abaixo estão na lista do arquivo Info.plist. [Clique aqui para ver como chegar lá](https://capacitorjs.com/docs/ios/configuration)

* NSCameraUsageDescription (Privacy - Camera Usage Description)
* NSPhotoLibraryAddUsageDescription (Privacy - Photo Library Additions Usage Description)
* NSPhotoLibraryUsageDescription (Privacy - Photo Library Usage Description)

Selecione a opção "Any IOS Device" na lista dos dispositivos.

No lado esquerdo clique duplo em App, na aba **"General"**, procure por **Version** e **Build** esses dois campos devem ser únicos em relação ao site da Apple. 

Depois selecione o menu Product->Archive, siga os passos na tela.
