Param(
    [ValidateSet('atual', 'release', 'versaoMenor', 'versaoMaior', 'build')]
    $tipoIncremento = "atual",
    [ValidateSet('', 'android', 'ios')]
    $plataforma = '',
    [switch]
    $naoZerarGit
)

function ZerarGit {
    if ($naoZerarGit) {
      return
    }
    Write-Host "Excluindo modificacoes pelo Git"
    git reset --hard HEAD
}

function CompilarAndroid {
    param (
        $versao
    )
    ZerarGit
    GerarAndroid -versao $versao
    ZerarGit
}

function CompilarIos {
    param (
        $versao
    )
    ZerarGit
    GerarIOS -versao $versao
    ZerarGit
}

function RemoverPastaInteira {
    param (
        $caminho
    )
    if (Test-Path -Path $caminho) {
        Write-Host "Removendo Pasta $caminho"
        Get-ChildItem $caminho -Recurse -Force | Remove-Item -Force -Recurse -Confirm:$false
        Remove-Item $caminho
    }

}

function GerarIOS {
    param (
        $versao
    )
    RemoverPastaInteira -caminho ".\ios\"

    ionic cap add ios
    npx @capacitor/assets generate
    # cordova-res ios --skip-config --copy
    AtualizaVersaoIOS -versao $versao
    ionic cap build ios
    AguardaFecharXcode
}


function GerarAndroid {
    param (
        $versao
    )

    RemoverPastaInteira -caminho ".\android\"

    ionic cap add android
    npx @capacitor/assets generate
    # cordova-res android --skip-config --copy
    AtualizaVersaoAndroid -versao $versao
    AtualizaPermissoesAndroid
    ionic cap build android
    # Durante o build os plugins são reiniciados, os xmls voltam ao estado original
    #AtualizaPermissoesAndroidPlugins
    AguardaFecharAndroidStudio
    CopiarBinario
}

function CopiarBinario {
    param (
    )
    $arquivoBinario = "./android/app/release/app-release.aab"
    if (-not (Test-Path $arquivoBinario)) {
        Write-Host "Arquivo binário não encontrado $arquivoBinario"
        return
    }

    $destino = "./binario"
    if (-not (Test-Path $destino)) {
        New-Item -Path $destino -ItemType Directory
    }
    $destino += "/requisicaoMobile.aab"
    Copy-Item -Force -Path $arquivoBinario -Destination $destino

}

function AguardaFecharXcode {
    param (
    )

    Write-Host "========================================================"
    Write-Host "|| Aguardando Fechar o Xcode"
    Write-Host "|| Clique em App"
    Write-Host "|| Clique em Signing e Capabilities"
    Write-Host "|| Selecione Provisioning Profile "
    Write-Host "|| No topo da tela selecione 'Generic IOS Device' ou 'Any iOS Device' "
    Write-Host "|| Menu Product->Archive"
    Write-Host "|| "
    Write-Host "|| "
    Write-Host "========================================================"

    $processo = $null
    $tentativas = 0
    while (($null -eq $processo) -and ($tentativas -le 10)) {
        $tentativas += 1
        try {
            $processo = Get-Process -name XCode -ErrorAction Stop
        }
        catch {
            Write-Host "Aguardando Xcode"
            Start-Sleep -Seconds 30
        }
    }
    if ($null -ne $processo) {
        $processo | Wait-Process
    }

}

function AguardaFecharAndroidStudio {
    param (
    )
    $localAtual = $PSScriptRoot
    $localAtual = $localAtual + '/certGoogle/reqmobile.keystore'
    $senha = "poliview"
    $localReal = Get-ChildItem $localAtual

    Write-Host "========================================================"
    Write-Host "|| Aguardando Fechar o Android Studio"
    Write-Host "|| Ir até o menu Build->Generate Signed Bundle / APK..."
    Write-Host "|| Selecione Android App Bundle"
    Write-Host "|| No keystore path digite $localReal"
    Write-Host "|| key store password: $senha"
    Write-Host "|| key alias selecionar existente"
    Write-Host "|| key password: $senha"
    Write-Host "|| Não precisa exportar a chave encriptada"
    Write-Host "|| Na próxima opção selecione release"
    Write-Host "========================================================"

    $processo = $null
    $tentativas = 0
    while (($null -eq $processo) -and ($tentativas -le 10)) {
        $tentativas += 1
        try {
            $processo = Get-Process -name studio64 -ErrorAction Stop
        }
        catch {
            try {
                $processo = Get-Process -name studio -ErrorAction Stop
            }
            catch {
                Write-Host "Aguardando Android Studio"
                Start-Sleep -Seconds 30

            }
        }

    }
    if ($null -ne $processo) {
        $processo | Wait-Process
    }

}

function AtualizaPermissoesAndroid {
    $arquivoManifestoAndroid = "./android/app/src/main/AndroidManifest.xml"
    SubstituiNoArquivo -arquivo $arquivoManifestoAndroid `
        -procurarPor "<application"`
        -substituirPor '<application android:usesCleartextTraffic="true"'
    SubstituiNoArquivo -arquivo $arquivoManifestoAndroid `
        -procurarPor "<application"`
        -substituirPor '<application android:requestLegacyExternalStorage="true"'
    SubstituiNoArquivo -arquivo $arquivoManifestoAndroid `
        -procurarPor "</manifest>"`
        -substituirPor "	<uses-permission android:name=`"android.permission.WRITE_EXTERNAL_STORAGE`" />`n</manifest>"
    SubstituiNoArquivo -arquivo $arquivoManifestoAndroid `
        -procurarPor "</manifest>"`
        -substituirPor "	<uses-permission android:name=`"android.permission.CAMERA`" />`n</manifest>"
    #$arquivoManifestoPlugin = "./android/capacitor-cordova-android-plugins/src/main/AndroidManifest.xml"
    #SubstituiNoArquivo -arquivo $arquivoManifestoPlugin `
    #    -procurarPor "<uses-permission\sandroid:name=`"android.permission.REQUEST_INSTALL_PACKAGES`"/>" `
    #    -substituirPor ""
}

function AtualizaPermissoesAndroidPlugins {
    $arquivoManifestoPlugin = "./android/capacitor-cordova-android-plugins/src/main/AndroidManifest.xml"
    SubstituiNoArquivo -arquivo $arquivoManifestoPlugin `
        -procurarPor "<uses-permission\sandroid:name=`"android.permission.REQUEST_INSTALL_PACKAGES`"/>" `
        -substituirPor ""
}

function VersaoTrabalho {
    param (
        $tipoIncremento
    )
    $arquivoDaVersao = './versao.json'
    $versao = Get-Content $arquivoDaVersao | Out-String | ConvertFrom-Json

    switch ($tipoIncremento) {
        "build" { $versaoNova = AddBuild $versao }
        "release" { $versaoNova = AddRelease $versao }
        "versaoMenor" { $versaoNova = AddVersaoMenor $versao }
        "versaoMaior" { $versaoNova = AddVersaoMaior $versao }
        default { $versaoNova = $versao }
    }
    $versao | ConvertTo-Json -depth 100 | Out-File $arquivoDaVersao
    return $versaoNova
}

function AddVersaoMaior {
    param (
        $versao
    )
    $versao.maior += 1
    $versao.menor = 0
    $versao.release = 0
    $versao.build = 0
    return $versao
}

function AddVersaoMenor {
    param (
        $versao
    )
    $versao.menor += 1
    $versao.release = 0
    $versao.build = 0
    return $versao
}

function AddRelease {
    param (
        $versao
    )
    $versao.release += 1
    $versao.build = 0
    return $versao
}

function AddBuild {
    param (
        $versao
    )
    $versao.build += 1
    return $versao
}

function AtualizaVersaoIOS {
    param (
        $versao
    )
    $versaoString = $versao.maior.ToString() `
        + "." + $versao.menor.ToString() `
        + "." + $versao.release.ToString()
    $versionCode = $versao.maior.ToString() `
        + "." + $versao.menor.ToString() `
        + "." + $versao.release.ToString() `
        + "." + $versao.build.ToString() `

    Write-Host "Versão Com Pontos: $versaoString"
    Write-Host "Versão Com Build: $versionCode"
    $arquivoPlist = "./ios/App/App/Info.plist"


    SubstituiNoArquivo -arquivo $arquivoPlist `
        -procurarPor '(?sm)<key>CFBundleShortVersionString</key>\s+<string>[^<]+</string>' `
        -substituirPor "<key>CFBundleShortVersionString</key>`n`t<string>$versaoString</string>"
    SubstituiNoArquivo -arquivo $arquivoPlist `
        -procurarPor '(?sm)<key>CFBundleVersion</key>\s+<string>[^<]+</string>' `
        -substituirPor "<key>CFBundleVersion</key>`n`t<string>$versionCode</string>"
    SubstituiNoArquivo -arquivo $arquivoPlist `
        -procurarPor '(?sm)^</dict>' `
        -substituirPor "`t<key>UIBackgroundModes</key>`n`t<array>`n`t`t<string>remote-notification</string>`n`t</array>`n</dict>"

    SubstituiNoArquivo -arquivo $arquivoPlist `
        -procurarPor "(?sm)^</dict>$" `
        -substituirPor "`t<key>NSAppTransportSecurity</key>`n`t<dict>`n`t<key>NSAllowsArbitraryLoads</key>`n`t<true/>`n`t</dict>`n</dict>"
    SubstituiNoArquivo -arquivo $arquivoPlist `
        -procurarPor "(?sm)^</dict>$" `
        -substituirPor "`t<key>NSLocationWhenInUseUsageDescription</key>`n`t<string>Nao precisa de localizacao</string>`n</dict>"
    SubstituiNoArquivo -arquivo $arquivoPlist `
        -procurarPor "(?sm)^</dict>$" `
        -substituirPor "`t<key>NSCameraUsageDescription</key>`n`t<string></string>`n</dict>"
    SubstituiNoArquivo -arquivo $arquivoPlist `
        -procurarPor "(?sm)^</dict>$" `
        -substituirPor "`t<key>NSPhotoLibraryAddUsageDescription</key>`n`t<string></string>`n</dict>"
    SubstituiNoArquivo -arquivo $arquivoPlist `
        -procurarPor "(?sm)^</dict>$" `
        -substituirPor "`t<key>NSPhotoLibraryUsageDescription</key>`n`t<string></string>`n</dict>"
}

function AtualizaVersaoAndroid {
    param (
        $versao
    )
    $versaoString = $versao.maior.ToString() `
        + "." + $versao.menor.ToString() `
        + "." + $versao.release.ToString()
    $versionCode = ($versao.maior * 10).ToString() + `
        '{0:d2}' -f [int]$versao.menor + `
        '{0:d2}' -f [int]$versao.release + `
        '{0:d2}' -f [int]$versao.build
    Write-Host "Versão Com Pontos: $versaoString"
    Write-Host "Versão Sem Pontos: $versionCode"
    $arquivoVersaoAndroid = "./android/app/build.gradle"
    SubstituiNoArquivo -arquivo $arquivoVersaoAndroid `
        -procurarPor "versionCode +\d+" `
        -substituirPor "versionCode $versionCode"
    SubstituiNoArquivo -arquivo $arquivoVersaoAndroid `
        -procurarPor 'versionName +[0-9\."]+' `
        -substituirPor "versionName `"$versaoString`""
}

function SubstituiNoArquivo {
    param (
        [string]$arquivo,
        [string]$procurarPor,
        [string]$substituirPor
    )
    (Get-Content -Path $arquivo -Raw) `
        -replace $procurarPor, $substituirPor `
    | Out-File -FilePath $arquivo
}

$versao = VersaoTrabalho -tipoIncremento $tipoIncremento
if (($plataforma -eq '') -or ($plataforma -eq 'android')) {
    CompilarAndroid -versao $versao
}
if (($plataforma -eq '') -or ($plataforma -eq 'ios')) {
    CompilarIos -versao $versao
}


