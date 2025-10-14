* ## API frotas- v001

#### 1. Abastecimentos

* ![](./Frt_ApiFrotas/image1.png)

##### 1.2. /api/frotas/Abastecimentos/ConsultaAbastecimento

* **Listas todos as Abastecimentos Próprios ou Postos**

```json
[
  {
    "emprdCod": 0,
    "emprDesc": "string",
    "codEquipamento": "string",
    "modelo": "string",
    "quantidade": 0,
    "valorTotal": 0,
    "entidade": 0,
    "insumoCdg": "string",
    "insumoDesc": "string",
    "dataAbastecimento": "2025-10-01T20:11:01.327Z",
    "identificador": "string",
    "localAbastecimento": "string",
    "responsavelCod": "string",
    "responsavelNome": "string",
    "placa": "string",
    "odometro": 0,
    "numVoucher": 0,
    "numRetornoPosto": 0,
    "numeroCartao": "string",
    "horimetro": 0,
    "fornecedorRazao": "string",
    "tpAbastecimento": 0,
    "codAbastecimentoExterno": "string",
    "abastecimentoId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "dataCadastro": "2025-10-01T20:11:01.327Z"
  }
]
```

** **Obs.** O Campo  tpAbastecimento = 0  --> Abastecimento próprio ,
    tpAbastecimento = 1  --> Abastecimento em Postos

#### 2. API Comuns

##### 2.1. /api/suprimentos/Lookups/Insumos

* Lista todos os insumos de uma entidade

##### 2.2. /api/frotas/Lookups/Equipamentos

* Lista todos os equipamentos

##### 2.3. /api/cadastros/Lookups/Empreendimentos

* Lista todos os empreendimentos

#### 3. API Ordem de Serviço

##### 3.1. /api/frotas/OrdensServico/ConsultaGeralOrdensServico

##### 3.2. /api/frotas/OrdensServico/ConsultaDetOrdensServico

##### 3.3. /api/frotas/Lookups/CausaIntervencao

##### 3.4. API para utilização conforme layout -Pesquisa

![](./Frt_ApiFrotas/image2.png)

* 1 - "Número Os"         --> Inserir somente o numero
* 2 - "Empreendimento"    --> Utilizar a  /api/cadastros/Lookups/Empreendimentos
* 3 - "Equipamento"       --> Utilizar a  /api/frotas/Lookups/Equipamentos 
* 4 - "Causa Intervenção" --> Utilizar a  /api/frotas/Lookups/CausaIntervencao
* 5 - "Manutentor"        --> A Implementar
* 6 - "Status"            --> Fazer uma Combo com os Status existentes na OS.
      Codigo	Descrição do Status
      0	      Aberta
      1	      Serviço Iniciado
      2	      Serviço Concluido
      3	      Fechada
      4	      Reprov./Cancelada

Utilizar para a consulta das OS a /api/frotas/OrdensServico/ConsultaGeralOrdensServico

##### 3.5. API para utilização conforme layout - edição

![](./Frt_ApiFrotas/image3.png)

* 1 - "Equipamento"       --> Utilizar a  /api/frotas/Lookups/Equipamentos 
* 2 - "Empreendimento"    --> Utilizar a  /api/cadastros/Lookups/Empreendimentos
* 3 - "Classificação"     --> A Implementar
* 4 - "Tipo"              --> A Implementar
* 5 - "Causa Intervenção" --> Utilizar a  /api/frotas/Lookups/CausaIntervencao
* 6 - "Operador/Motorista"
* 7 - "Empreendimento"    --> Utilizar a  /api/cadastros/Lookups/Empreendimentos
* 8 - "Status"  , Combo do item 3.4. 
* 9 - "Manutentor"        --> A Implementar

Utilizar para Gravar a /api/frotas/OrdensServico/GravarOrdemServico
 
      
