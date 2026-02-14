import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-autocomplete',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
})
export class AutocompleteComponent {

  @Input() lista: any[] = [];
  @Input() placeholder: string = '';
  @Input() label: string = '';
  @Input() campoDescricao: string = 'descricao'; // 🔥 NOVO

  @Output() selecionado = new EventEmitter<any>();

  textoBusca = '';
  listaFiltrada: any[] = [];
  aberto = false;

  ngOnInit() {
    this.listaFiltrada = [...this.lista];
  }

  getDescricao(item: any): string {
    return (
      item?.[this.campoDescricao] ||
      item?.descricao ||
      item?.nome ||
      ''
    );
  }

  filtrar() {
    const termo = (this.textoBusca || '').toLowerCase();
    this.aberto = true;

    if (!termo) {
      this.listaFiltrada = [...this.lista];
      return;
    }

    this.listaFiltrada = this.lista.filter(item =>
      this.getDescricao(item).toLowerCase().includes(termo)
    );
  }

  selecionar(item: any) {
    this.textoBusca = this.getDescricao(item);
    this.aberto = false;
    this.selecionado.emit(item);
  }

  limpar() {
    this.textoBusca = '';
    this.listaFiltrada = [...this.lista];
    this.aberto = false;
    this.selecionado.emit(null);
  }

  fechar() {
    this.aberto = false;
  }
}
