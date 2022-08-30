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
* `npm run generate_apk:android`
* Pegar apk no output em ``/android/app/build/outputs/apk``
### - Warning: ###
* :warning:``Certfique-se que tem a dependencia `capacitor-resources` para funcionar o run generate_apk`` e gerar splashScreen com capacitor-resources

<<<<<<< HEAD
## Branch(Develop)
    .
    ├── Main                    # Prod branch
    ├── Develop                 # Dev branch


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
=======
## Branch(Main)
    .
    ├── Main                    # Prod branch
    ├── Develop                 # Dev branch
>>>>>>> main
