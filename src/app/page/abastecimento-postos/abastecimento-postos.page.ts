import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Router } from '@angular/router';
import { format, parseISO } from 'date-fns';
import { CalendarPopoverComponent } from '../../components/calendar-popover/calendar-popover.component';

@Component({
  selector: 'app-abastecimento-postos',
  templateUrl: './abastecimento-postos.page.html',
  styleUrls: ['./abastecimento-postos.page.scss'],
  standalone: false
})
export class AbastecimentoPostosPage implements OnInit {

  fornecedor = '';
  equipamento = '';
  numeroVoucher = '';

  dataInicial: string | null = null;
  dataFinal: string | null = null;

  constructor(
    private popoverCtrl: PopoverController,
    private router: Router
  ) { }

  ngOnInit() {}

  // casinha no header (mesmo padrão do abastecimento próprio)
  onBack() {
    this.router.navigate(['/tabs/abastecimento']);
    // se o menu principal for outra rota, é só trocar aqui
  }

  async openCalendar(event: any, fieldName: 'dataInicial' | 'dataFinal') {
    const popover = await this.popoverCtrl.create({
      component: CalendarPopoverComponent,
      event,
      backdropDismiss: true,
      translucent: true,
      cssClass: 'calendar-popover'
    });

    await popover.present();

    const { data } = await popover.onDidDismiss();

    if (data && data.date) {
      if (fieldName === 'dataInicial') {
        this.dataInicial = data.date;
      } else {
        this.dataFinal = data.date;
      }
    }
  }

  formatDate(isoString: string | null): string {
    if (!isoString) return '';
    try {
      return format(parseISO(isoString), 'dd/MM/yyyy');
    } catch {
      return '';
    }
  }

  pesquisar() {
    const filtros = {
      fornecedor: this.fornecedor,
      equipamento: this.equipamento,
      dataInicial: this.dataInicial,
      dataFinal: this.dataFinal,
      numVoucher: this.numeroVoucher,
    };

    this.router.navigate(
      ['/tabs/abastecimento-postos-pesquisa'],
      { queryParams: filtros }
    );
  }

  novo() {
    console.log('Navegando para a página de edição de abastecimento em postos...');
    this.router.navigate(['/tabs/abastecimento-postos-edicao']);
  }

  novoAbastecimento() {
    this.novo();
  }
}
