# siecon-req

![](https://img.shields.io/badge/Ionic-v7.0.1-blue) ![](https://img.shields.io/badge/Capacitor-v5.0.0-black) ![](https://img.shields.io/badge/Angular-16.2.12-red) ![](https://img.shields.io/badge/Node-v18.16.0-green)

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

## :hammer: Dependences

```sh

Package                         Version
---------------------------------------------------------
Angular                         CLI: 16.2.13
Node:                           18.16.0
Package Manager:                npm 8.18.0 
@angular-eslint/eslint-plugin   14.0.3,
@angular-devkit/architect       0.1602.13
@angular-devkit/build-angular   16.2.13
@angular-devkit/core            16.2.13
@angular-devkit/schematics      16.2.13
@angular/cdk                    16.2.14
@angular/cli                    16.2.13
@angular/material               16.2.14
@schematics/angular             16.2.13
rxjs                            6.6.7
typescript                      5.1.6
zone.js                         0.13.3

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
