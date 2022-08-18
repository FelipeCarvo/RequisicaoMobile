# siecon-req
![](https://img.shields.io/badge/Ionic-v6.xx-blue) ![](https://img.shields.io/badge/Capacitor-v3.xx-black) ![](https://img.shields.io/badge/Angular-v12.xx-red) ![](https://img.shields.io/badge/Node-v12.xx-green)

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
* `npm run generate_apk:android`
* Pegar apk no output em ``/android/app/build/outputs/apk``
* :warning:``Certfique-se que tem a dependencia `capacitor-resources` para funcionar o run generate_apk``

## Branch(Main)
    .
    ├── Main                    # Prod branch
    ├── Develop                 # Dev branch
