import { Component, Output, EventEmitter, AfterViewInit, Input } from '@angular/core';
import { CapacitorBarcodeScanner, CapacitorBarcodeScannerTypeHint } from '@capacitor/barcode-scanner';

@Component({
    selector: 'app-qr-scanner',
    templateUrl: './qr-scanner.component.html',
    styleUrls: ['./qr-scanner.component.scss'],
    standalone: false
})
export class QrScannerComponent implements AfterViewInit {
  @Output() qrCodeLido = new EventEmitter<string>();
  @Input() caption = 'Ler QRCODE';

  scanResult: string | null = null;

  ngAfterViewInit() {
  }

  async startScan() {
    /*
    this.scanActive = false;
    this.scanResult = 'DB385629-EB38-4142-AC2B-249E9FBAA7B9';
    this.qrCodeLido.emit(this.scanResult);
    return;
    // */


    var resposta = undefined;
    await CapacitorBarcodeScanner.scanBarcode({
      hint: CapacitorBarcodeScannerTypeHint.ALL
    })
    .then(r => {
      resposta = r;
    })
    .catch(e => {
      alert(e);
    });
    
    if (resposta !== undefined) {
      this.scanResult = resposta.ScanResult;
      this.qrCodeLido.emit(this.scanResult);
    }
    
  }

  reset() {
    this.scanResult = null;
  }

  stopScan() {
  }
}
