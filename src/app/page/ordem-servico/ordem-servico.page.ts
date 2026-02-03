import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { format, parseISO } from 'date-fns';
import { OrdemServicoService } from '../../services/ordem-servico.service';
import { CalendarPopoverComponent } from '../../components/calendar-popover/calendar-popover.component';

@Component({
  standalone: false,
  selector: 'app-ordem-servico',
  templateUrl: './ordem-servico.page.html',
  styleUrls: ['./ordem-servico.page.scss'],
})
export class OrdemServicoPage {

  filtro = {
    numeroOs: '',
    empreendimento: '',
    equipamento: '',
    causaIntervencao: '',
    manutentor: '',
    status: '',
    dataAberturaInicial: '',
    dataAberturaFinal: '',
    dataConclusaoInicial: '',
    dataConclusaoFinal: ''
  };

  resultados: any[] = [];

  constructor(
    public router: Router,
    private popoverCtrl: PopoverController,
    private ordemServicoService: OrdemServicoService
  ) {}

  // Voltar para home de frotas
  onBack() {
    this.router.navigate(['/tabs/frotas-home']);
  }

  // Ir para tela de edição / nova OS
  goNovaOrdem() {
    // Navega para tela de edição sem parâmetros para garantir OS em branco
    this.router.navigate(['/tabs/ordem-servico-edicao']);
  }

  // Abrir calendário (usa o mesmo popover do resto do app)
  async openCalendar(
    event: any,
    field: 'dataAberturaInicial' | 'dataAberturaFinal' | 'dataConclusaoInicial' | 'dataConclusaoFinal'
  ) {
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
      this.filtro[field] = data.date;
    }
  }

  formatDate(isoString: string): string {
    if (!isoString) { return ''; }
    try {
      return format(parseISO(isoString), 'dd/MM/yyyy');
    } catch {
      return '';
    }
  }

  // Pesquisar: navega para a tela de pesquisa levando os filtros (a tela de pesquisa consulta a API)
  pesquisar() {
    this.router.navigate(['/tabs/ordem-servico-pesquisa'], {
      queryParams: {
        numeroOs: this.filtro.numeroOs,
        empreendimento: this.filtro.empreendimento,
        equipamento: this.filtro.equipamento,
        causaIntervencao: this.filtro.causaIntervencao,
        manutentor: this.filtro.manutentor,
        status: this.filtro.status,
        dataAberturaInicial: this.filtro.dataAberturaInicial,
        dataAberturaFinal: this.filtro.dataAberturaFinal,
        dataConclusaoInicial: this.filtro.dataConclusaoInicial,
        dataConclusaoFinal: this.filtro.dataConclusaoFinal,
      }
    });
  }
}
