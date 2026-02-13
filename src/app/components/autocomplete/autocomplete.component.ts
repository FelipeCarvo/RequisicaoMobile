import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
})
export class AutocompleteComponent {

  @Input() lista: any[] = [];
  @Input() placeholder: string = '';
  @Input() campoDescricao: string = 'descricao';

  @Output() selecionado = new EventEmitter<any>();

  textoBusca = '';
  filtrados: any[] = [];
  aberto = false;

  ngOnInit() {
    this.filtrados = [...this.lista];
  }

  onDigitar() {
    const texto = (this.textoBusca || '').toLowerCase().trim();

    if (!texto) {
      this.aberto = false;
      this.filtrados = [];
      return;
    }

    this.filtrados = this.lista.filter(item =>
      String(item[this.campoDescricao] || '')
        .toLowerCase()
        .includes(texto)
    );

    this.aberto = this.filtrados.length > 0;
  }

  selecionar(item: any) {
    this.textoBusca = item[this.campoDescricao];
    this.aberto = false;
    this.selecionado.emit(item);
  }

  limpar() {
    this.textoBusca = '';
    this.aberto = false;
    this.filtrados = [];
    this.selecionado.emit(null);
  }

  abrir() {
    this.aberto = this.filtrados.length > 0;
  }
}
