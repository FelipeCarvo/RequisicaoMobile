import {Observable} from 'rxjs';
export interface FilterRequestFields {
    filteredOptionsEmpreendimento?: Observable<string[]>,
    filteredOptionsOFsDescontoMaterial?: Observable<string[]>,
    filteredOptionsUsuarios?:Observable<string[]>,
    filteredOptionsEmpresasInsumos?: Observable<string[]>,
    filteredOptionsInsumos?: Observable<string[]>,
    filteredOptionsPlanoDeContas?: Observable<string[]>,    
    filteredOptionsServico?: Observable<string[]>,       
  }