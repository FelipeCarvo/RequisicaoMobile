import { Component, OnInit } from '@angular/core';
//import { CommonModule } from '@angular/common';
//import { FormsModule } from '@angular/forms';
//import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { format, parseISO } from 'date-fns';

import { OrdemServicoService } from '../../services/ordem-servico.service';
import { CalendarPopoverComponent } from '../../components/calendar-popover/calendar-popover.component';
//import { AutocompleteComponent } from '../../components/autocomplete/autocomplete.component';

@Component({

  selector: 'app-ordem-servico',
  templateUrl: './ordem-servico.page.html',
  styleUrls: ['./ordem-servico.page.scss'],

})




export class OrdemServicoPage implements OnInit {

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

  // 🔹 LISTAS DO AUTOCOMPLETE (mesmas da edição)
  equipamentosLista: any[] = [];
  empreendimentosLista: any[] = [];
  causasLista: any[] = [];
  manutentoresLista: any[] = [];

  constructor(
    public router: Router,
    private popoverCtrl: PopoverController,
    private ordemServicoService: OrdemServicoService
  ) {}

  // 🔹 Carrega listas ao abrir tela
 ngOnInit() {
  this.ordemServicoService.listarEquipamentos().subscribe(r => this.equipamentosLista = r || []);
  this.ordemServicoService.listarEmpreendimentos().subscribe(r => this.empreendimentosLista = r || []);
  this.ordemServicoService.listarCausasIntervencao().subscribe(r => this.causasLista = r || []);
  this.ordemServicoService.listarColaboradoresManutentores()
  .subscribe(r => {
    this.manutentoresLista = (r || []).map((m: any) => ({
      id: m.id ?? m.colaboradorId ?? m.manutentorId,
      descricao: m.descricao ?? m.nome ?? m.colaboradorNome
    }));
  });

}


  // Voltar para home de frotas
  onBack() {
    this.router.navigate(['/tabs/frotas-home']);
  }

  // Ir para tela de edição / nova OS
  goNovaOrdem() {
    this.router.navigate(['/tabs/ordem-servico-edicao']);
  }

  // 🔹 Métodos chamados pelo autocomplete
  onEquipamentoSelecionado(item: any) {
    this.filtro.equipamento = item?.id || '';
  }

  onEmpreendimentoSelecionado(item: any) {
    this.filtro.empreendimento = item?.id || '';
  }

  onCausaSelecionada(item: any) {
    this.filtro.causaIntervencao = item?.id || '';
  }

  onManutentorSelecionado(item: any) {
    this.filtro.manutentor = item?.id || '';
  }

  // Abrir calendário
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
    if (!isoString) return '';
    try {
      return format(parseISO(isoString), 'dd/MM/yyyy');
    } catch {
      return '';
    }
  }

  // Pesquisar → navega para tela de pesquisa com filtros
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
