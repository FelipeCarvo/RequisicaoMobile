import {Observable} from 'rxjs';
export interface FilterRequestFields {
    filteredOptionsEmpreendimento?: Observable<string[]>,
    filteredOptionsOfDescontoMaterial?: Observable<string[]>,
    filteredOptionsUsuarios?:Observable<string[]>,
    filteredOptionsEmpresasInsumos?: Observable<string[]>,
    EmpresasDoEmpreendimento?: Observable<string[]>,
    filteredOptionsInsumos?: Observable<string[]>,
    filteredOptionsPlanoDeContas?: Observable<string[]>,    
    filteredOptionsServico?: Observable<string[]>, 
    filteredOptionsBloco?: Observable<string[]>,
    filteredOptionsUnidade?: Observable<string[]>,
    filteredOptionsOrdemServico?: Observable<string[]>,
    filteredOptionsEquipamento?: Observable<string[]>,        
  }