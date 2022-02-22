import {Observable} from 'rxjs';
export interface FilterRequestFields {
    filteredOptionsEmpreendimento?: Observable<string[]>,
    filteredOptionsOFsDescontoMaterial?: Observable<string[]>,
    filteredOptionsUsuarios?:Observable<string[]>,
    filteredOptionsEmpresasInsumos?: Observable<string[]>,
    EmpresasDoEmpreendimento?: Observable<string[]>,
    filteredOptionsInsumos?: Observable<string[]>,
    filteredOptionsPlanoDeContas?: Observable<string[]>,    
    filteredOptionsServico?: Observable<string[]>, 
    filteredOptionsBloco?: Observable<string[]>,
    filteredOptionsUnidade?: Observable<string[]>,       
  }