// Tipo genérico para itens de lista (alguns endpoints não garantem id)
type ItemComId = { id?: string } & Record<string, unknown>;
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PopoverController, ToastController } from '@ionic/angular';//ADD ToastController
import { format, parseISO } from 'date-fns';
import { CalendarPopoverComponent } from '../../components/calendar-popover/calendar-popover.component';
import { OrdemServicoService } from '../../services/ordem-servico.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

type FotoCacheItem = {
  id?: string;
  dataUrl: string;
  createdAt: string;
};

// 👉 Tipo interno só para organizar os dados da tela
interface OrdemServicoPayload {
  numeroOs: string;
  descricao: string;
  equipamento: string;
  empreendimento: string;
  empreendimentoIntervencao: string;
  classificacao: string;
  tipo: string;
  causaIntervencao: string;
  operadorMotorista: string;
  manutentor: string;
  statusCodigo: number | null;
  dataAbertura: string | null;
  dataConclusao: string | null;
}

@Component({
  standalone: false,
  selector: 'app-ordem-servico-edicao',
  templateUrl: './ordem-servico-edicao.page.html',
  styleUrls: ['./ordem-servico-edicao.page.scss'],
})
export class OrdemServicoEdicaoPage implements OnInit {
  // Campos de texto e seleção
  numeroOS: string = '';
  // Id interno da OS (GUID) usado para update/anexos
  osId: string = '';
  fotos: FotoCacheItem[] = [];
  fotoSelecionadaIndex = 0;
  fotoPreviewDataUrl: string | null = null;
  fotoPreviewSafeHref: SafeUrl | null = null;
  private fotoPreviewBlobUrl: string | null = null;
  fotoModalAberto = false;
  descricao: string = '';
  equipamento: string = '';
  empreendimento: string = '';
  empreendimentoIntervencao: string = '';
  classificacao: string = '';
  tipo: string = '';
  causaIntervencao: string = '';
  operadorMotorista: string = '';
  manutentor: string = '';
  statusCodigo: number | null = null;
  dataAbertura: string | null = null;
  dataConclusao: string | null = null;

  //NOVOS CAMPOS
  defeitosConstatados: string = '';
  causasProvaveis: string = '';
  observacoes: string = '';

// ALTERAÇÃO: controla liberação do botão "Anexar Foto"
  osConfirmada = false;

  // Listas para combos
  equipamentosLista: ItemComId[] = [];
  empreendimentosLista: ItemComId[] = [];
  classificacoesLista: ItemComId[] = [];
  tiposOsLista: ItemComId[] = [];
  causasIntervencaoLista: ItemComId[] = [];
  motoristasLista: ItemComId[] = [];
  manutentoresLista: ItemComId[] = [];

  // Status fixo (exemplo)
  statusLista = [
    { valor: 1, descricao: 'Aberto' },
    { valor: 2, descricao: 'Em andamento' },
    { valor: 3, descricao: 'Concluído' },
    { valor: 4, descricao: 'Cancelado' },
  ];

  carregando = false;

  private getFotoCacheKeyById(osId: string) {
    return `os:lastFotoDataUrl:id:${osId}`;
  }

  private getFotoIdCacheKeyById(osId: string) {
    return `os:lastFotoId:id:${osId}`;
  }

  private getFotoCacheKeyByCod(osCod: string) {
    return `os:lastFotoDataUrl:cod:${osCod}`;
  }

  private getFotoIdCacheKeyByCod(osCod: string) {
    return `os:lastFotoId:cod:${osCod}`;
  }

  private getFotosCacheKeyById(osId: string) {
    return `os:fotos:id:${osId}`;
  }

  private getFotosCacheKeyByCod(osCod: string) {
    return `os:fotos:cod:${osCod}`;
  }

  // Chaves antigas (compat)
  private getLegacyFotoCacheKey(osId: string) {
    return `os:lastFotoDataUrl:${osId}`;
  }

  private getLegacyFotoIdCacheKey(osId: string) {
    return `os:lastFotoId:${osId}`;
  }

  abrirFotoOverlay(index?: number) {
    if (!this.fotos?.length) return;
    if (typeof index === 'number' && index >= 0 && index < this.fotos.length) {
      this.fotoSelecionadaIndex = index;
    }
    this.fotoPreviewDataUrl = this.fotos[this.fotoSelecionadaIndex]?.dataUrl || null;
    this.atualizarHrefSeguro();
    this.fotoModalAberto = true;
  }

  fecharFotoOverlay() {
    this.fotoModalAberto = false;
  }

  excluirFotoLocal() {
    // Remove apenas do app (cache local). Não remove do servidor.
    if (!this.fotos?.length) {
      this.fecharFotoOverlay();
      return;
    }

    const idx = Math.max(0, Math.min(this.fotoSelecionadaIndex, this.fotos.length - 1));
    this.fotos.splice(idx, 1);

    if (this.fotos.length === 0) {
      this.limparCacheFotos();
      this.fotoSelecionadaIndex = 0;
      this.fotoPreviewDataUrl = null;
      this.fotoPreviewSafeHref = null;
      this.atualizarHrefSeguro();
      this.fecharFotoOverlay();
      return;
    }

    this.fotoSelecionadaIndex = Math.max(0, Math.min(idx, this.fotos.length - 1));
    this.persistirListaFotosNoCache();
    this.fotoPreviewDataUrl = this.fotos[this.fotoSelecionadaIndex]?.dataUrl || null;
    this.atualizarHrefSeguro();
    this.fecharFotoOverlay();
  }

  private limparCacheFotos() {
    try {
      const osCod = this.numeroOS;
      const osId = this.osId;

      if (osId && osId.length === 36) {
        localStorage.removeItem(this.getFotosCacheKeyById(osId));
        localStorage.removeItem(this.getFotoCacheKeyById(osId));
        localStorage.removeItem(this.getFotoIdCacheKeyById(osId));
        localStorage.removeItem(this.getLegacyFotoCacheKey(osId));
        localStorage.removeItem(this.getLegacyFotoIdCacheKey(osId));
      }
      if (osCod) {
        localStorage.removeItem(this.getFotosCacheKeyByCod(osCod));
        localStorage.removeItem(this.getFotoCacheKeyByCod(osCod));
        localStorage.removeItem(this.getFotoIdCacheKeyByCod(osCod));
      }
    } catch {
      // ignore
    }
  }

  private persistirListaFotosNoCache() {
    const osCod = this.numeroOS;
    const osId = this.osId;
    try {
      const payload = JSON.stringify(this.fotos);
      if (osId && osId.length === 36) {
        localStorage.setItem(this.getFotosCacheKeyById(osId), payload);
      }
      if (osCod) {
        localStorage.setItem(this.getFotosCacheKeyByCod(osCod), payload);
      }

      // Mantém também “última foto” para compat
      const last = this.fotos[this.fotos.length - 1];
      if (last?.dataUrl) {
        if (osId && osId.length === 36) {
          localStorage.setItem(this.getFotoCacheKeyById(osId), last.dataUrl);
          localStorage.setItem(this.getLegacyFotoCacheKey(osId), last.dataUrl);
        }
        if (osCod) {
          localStorage.setItem(this.getFotoCacheKeyByCod(osCod), last.dataUrl);
        }
      }
      if (last?.id) {
        if (osId && osId.length === 36) {
          localStorage.setItem(this.getFotoIdCacheKeyById(osId), last.id);
          localStorage.setItem(this.getLegacyFotoIdCacheKey(osId), last.id);
        }
        if (osCod) {
          localStorage.setItem(this.getFotoIdCacheKeyByCod(osCod), last.id);
        }
      }
    } catch {
      // ignore
    }
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private popoverCtrl: PopoverController,
    private ordemService: OrdemServicoService,
    private toastCtrl: ToastController, //  ALTERAÇÃO injeção do ToastController
    private sanitizer: DomSanitizer
  ) {}

  ionViewWillEnter() {
    // Ao voltar da tela de anexar foto (navCtrl.back), o ngOnInit não roda de novo.
    // Então recarregamos as fotos do cache aqui para atualizar a grade imediatamente.
    this.atualizarPreviewFoto();
  }

  ngOnInit() {
    // Inicializa campos em branco por padrão
    const limparCampos = () => {
      this.numeroOS = '';
      this.osId = '';
      this.descricao = '';
      this.equipamento = '';
      this.empreendimento = '';
      this.empreendimentoIntervencao = '';
      this.classificacao = '';
      this.tipo = '';
      this.causaIntervencao = '';
      this.operadorMotorista = '';
      this.manutentor = '';
      this.statusCodigo = null;
      this.dataAbertura = null;
      this.dataConclusao = null;
    };
    this.route.queryParams.subscribe((params) => {
      // Sempre limpar os campos ao criar nova OS (sem parâmetro 'os')
      if (!params || !params['os']) {
        this.carregarCombosComCallback(() => {
          limparCampos();
          this.atualizarPreviewFoto();
        });
        return;
      }

      // Se houver parâmetro 'os', preenche os campos (edição)
      if (params && params['os']) {
        const isGuid = (v: unknown) => typeof v === 'string' && /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(v);
        const isNumeric = (v: unknown) => typeof v === 'string' && /^\d+$/.test(v.trim());

        let os: Record<string, unknown> = {};
        const osRaw = params['os'];

        const tryParseOs = (raw: unknown): Record<string, unknown> | null => {
          if (!raw) return null;
          if (typeof raw !== 'string') return raw as Record<string, unknown>;

          const trimmed = raw.trim();
          if (!trimmed) return null;

          // Caso 1: JSON padrão
          try {
            return JSON.parse(trimmed) as Record<string, unknown>;
          } catch {
            // ignore
          }

          // Caso 2: string parecida com JSON mas com aspas simples (ex: {'osId':'...','osCod':127})
          if (trimmed.startsWith('{') && trimmed.endsWith('}') && trimmed.includes("'") && !trimmed.includes('"')) {
            try {
              const fixed = trimmed.replace(/'/g, '"');
              return JSON.parse(fixed) as Record<string, unknown>;
            } catch {
              // ignore
            }
          }

          return null;
        };

        const parsed = tryParseOs(osRaw);
        if (parsed) {
          os = parsed;
        } else {
          // Se não for JSON, pode vir só o id (GUID) ou só o número/código da OS.
          if (isGuid(osRaw)) {
            os = { osId: osRaw, OsId: osRaw };
          } else if (isNumeric(osRaw)) {
            os = { osCod: osRaw, NumeroOs: osRaw, numeroOs: osRaw };
          } else {
            // Não entendemos o formato. Mantém o que já estava carregado para não “apagar” a tela.
            this.atualizarPreviewFoto();
            return;
          }
        }
        this.carregarCombosComCallback(() => {
          // ...preenchimento dos campos como antes...
          // Regra conforme documentação:
          // - osCod: número/código da OS (aparece para o usuário)
          // - osId/OsId: id interno (GUID) para edição/update
          const incomingOsId = String((os as any)?.OsId ?? (os as any)?.osId ?? (os as any)?.id ?? '');
          const incomingOsCod = String((os as any)?.osCod ?? (os as any)?.NumeroOs ?? (os as any)?.numeroOs ?? '');

          // LOG: objeto OS completo recebido do backend

          // LOG: campos extras recebidos?
          const camposExtras = {
            defeitosConstatados: os.defeitosConstatados ?? os.DefeitosConstatados ?? os.defeitos ?? os.obsDef ?? '',
            causasProvaveis: os.causasProvaveis ?? os.CausasProvaveis ?? os.causas ?? os.obsCausas ?? '',
            observacoes: os.observacoes ?? os.Observacoes ?? os.observacao ?? os.Observacao ?? ''
          };
          if (!camposExtras.defeitosConstatados && !camposExtras.causasProvaveis && !camposExtras.observacoes) {
          } else {
          }

          // Se a tela já tem um OsId mais novo (ex.: retornado após gravar) e o queryParam ainda tem o OsId antigo,
          // não sobrescreve o estado atual (isso quebrava a leitura do cache das fotos).
          const shouldKeepCurrentOsId =
            !!this.osId && this.osId.length === 36 &&
            !!incomingOsId && incomingOsId.length === 36 &&
            this.osId !== incomingOsId &&
            (!!this.numeroOS && !!incomingOsCod && String(this.numeroOS) === String(incomingOsCod));

          if (!shouldKeepCurrentOsId) {
            this.osId = incomingOsId;
          }
          // Evita apagar o número caso o payload venha sem ele.
          if (incomingOsCod) {
            this.numeroOS = incomingOsCod;
          }
          this.atualizarPreviewFoto();
          this.descricao = String(os.osDescricao ?? os.descricao ?? os.Descricao ?? '');
          // Novos campos: Defeitos Constatados, Causas Prováveis, Observações
          this.defeitosConstatados = String(camposExtras.defeitosConstatados);
          this.causasProvaveis = String(camposExtras.causasProvaveis);
          this.observacoes = String(camposExtras.observacoes);
          // ...restante do preenchimento dos campos...
          // Equipamento
          const equipId = os.EquipamentoId ?? os.equipId ?? os.equipId ?? '';
          const eqFound = this.equipamentosLista.find(
            (item) => item.id == equipId || item.codigo == equipId || item.equipId == equipId
          );
          this.equipamento = eqFound ? String(eqFound.id) : (this.equipamentosLista[0]?.id || '');
          // Empreendimento
          const empreendimentoId = os.EmpreendimentoId ?? os.empreendimento ?? '';
          const empFound = this.empreendimentosLista.find(
            (item) => item.id == empreendimentoId || item.codigo == empreendimentoId || item.empreendimentoId == empreendimentoId
          );
          this.empreendimento = empFound ? String(empFound.id) : (this.empreendimentosLista[0]?.id || '');
          // Empreendimento Intervenção
          const empreendimentoIntervId = os.EmpreendimentoIntervencao ?? os.empreendimentoIntervencao ?? os.emprdintervencaoId ?? '';
          const empIntFound = this.empreendimentosLista.find(
            (item) => item.id == empreendimentoIntervId || item.codigo == empreendimentoIntervId || item.empreendimentoId == empreendimentoIntervId
          );
          this.empreendimentoIntervencao = empIntFound ? String(empIntFound.id) : (this.empreendimentosLista[0]?.id || '');
          // Classificação
          const classificacaoId = os.Classificacao ?? os.classificacao ?? os.classifCod ?? os.classifDesc ?? '';
          const classifFound = this.classificacoesLista.find(
            (item) => item.id == classificacaoId || item.codigo == classificacaoId || item.classificacaoId == classificacaoId || item.classifCod == classificacaoId || item.classifDesc == classificacaoId
          );
          this.classificacao = classifFound ? String(classifFound.id) : (this.classificacoesLista[0]?.id || '');
          // Tipo
          const tipoId = os.TipoServico ?? os.tipo ?? os.tpServcod ?? os.tpServDescricao ?? '';
          const tipoFound = this.tiposOsLista.find(
            (item) => item.id == tipoId || item.codigo == tipoId || item.tipoId == tipoId || item.tpServcod == tipoId || item.tpServDescricao == tipoId
          );
          this.tipo = tipoFound ? String(tipoFound.id) : (this.tiposOsLista[0]?.id || '');
          // Causa Intervenção
          const causaId = os.CausaIntervencao ?? os.causaIntervencao ?? os.causasId ?? '';
          const causaFound = this.causasIntervencaoLista.find(
            (item) => item.id == causaId || item.codigo == causaId || item.causaId == causaId
          );
          this.causaIntervencao = causaFound ? String(causaFound.id) : (this.causasIntervencaoLista[0]?.id || '');
          // Motorista/Operador
          const motoristaId = os.MotoristaOperadorId ?? os.MotoristaOperador ?? os.operadorMotorista ?? os.colaboradorId ?? os.colaboradorCod ?? os.colaboradorNome ?? '';
          const motoristaFound = this.motoristasLista.find(
            (item) => item.id == motoristaId || item.colaboradorCod == motoristaId || item.colaboradorId == motoristaId || item.codigo == motoristaId || item.colaboradorNome == motoristaId
          );
          this.operadorMotorista = motoristaFound ? String(motoristaFound.id) : (this.motoristasLista[0]?.id || '');
          // Manutentor
          const manutentorId = os.ManutentorResponsavelId ?? os.manutentor ?? os.manutentorId ?? os.manutentorCod ?? os.manutentorNome ?? '';
          const manutentorFound = this.manutentoresLista.find(
            (item) => item.id == manutentorId || item.colaboradorCod == manutentorId || item.colaboradorId == manutentorId || item.fornId == manutentorId || item.codigo == manutentorId || item.manutentorCod == manutentorId || item.manutentorNome == manutentorId
          );
          this.manutentor = manutentorFound ? String(manutentorFound.id) : (this.manutentoresLista[0]?.id || '');
          // Status
          const statusId = os.statusCodigo ?? os.Status ?? os.status ?? os.statusCod ?? os.statusDescricao ?? '';
          const statusFound = this.statusLista.find(
            (s) => s.valor == statusId || s.descricao == statusId
          );
          this.statusCodigo = statusFound ? statusFound.valor : (this.statusLista[0]?.valor || 1);
          // Datas
          this.dataAbertura = String(os.osDataAbertura ?? os.dataAbertura ?? os.OsDataAbertura ?? '') || null;
          this.dataConclusao = String(os.osDataConclusao ?? os.dataConclusao ?? os.OsDataConclusao ?? '') || null;
          // Mapeamento dinâmico para campos extras (garante que qualquer campo novo vindo do backend seja exibido em debug)
          this['__osCompletaDebug'] = os;
        });
      } else {
        // Nova ordem de serviço: limpa todos os campos
        this.carregarCombosComCallback(() => {
          limparCampos();
          this.atualizarPreviewFoto();
        });
      }
    });
  }

  private atualizarPreviewFoto() {
    // Prioridade: lista por osId, depois por osCod, depois chaves antigas.
    try {
      const osId = this.osId;
      const osCod = this.numeroOS;

      const parseList = (raw: string | null): FotoCacheItem[] | null => {
        if (!raw) return null;
        try {
          const arr = JSON.parse(raw) as Array<Partial<FotoCacheItem>>;
          if (!Array.isArray(arr)) return null;
          return arr
            .filter(x => typeof x?.dataUrl === 'string' && String(x.dataUrl).trim() !== '')
            .map(x => ({
              id: typeof x.id === 'string' ? x.id : undefined,
              dataUrl: String(x.dataUrl),
              createdAt: typeof x.createdAt === 'string' ? x.createdAt : new Date().toISOString(),
            }));
        } catch {
          return null;
        }
      };

      let list: FotoCacheItem[] | null = null;

      if (osId && osId.length === 36) {
        list = parseList(localStorage.getItem(this.getFotosCacheKeyById(osId)));
      }
      if ((!list || list.length === 0) && osCod) {
        list = parseList(localStorage.getItem(this.getFotosCacheKeyByCod(osCod)));
      }

      // Fallback: se não tem lista, tenta “última foto” (novo/legado)
      if (!list || list.length === 0) {
        let cached: string | null = null;
        if (osId && osId.length === 36) {
          cached =
            localStorage.getItem(this.getFotoCacheKeyById(osId)) ||
            localStorage.getItem(this.getLegacyFotoCacheKey(osId));
        }

        if (!cached && osCod) {
          cached = localStorage.getItem(this.getFotoCacheKeyByCod(osCod));
        }

        if (cached) {
          list = [{ dataUrl: cached, createdAt: new Date().toISOString() }];
        }
      }

      this.fotos = list || [];
      if (this.fotoSelecionadaIndex >= this.fotos.length) {
        this.fotoSelecionadaIndex = Math.max(0, this.fotos.length - 1);
      }

      let cached: string | null = this.fotos[this.fotoSelecionadaIndex]?.dataUrl || null;

      // Normaliza: se vier só o base64 puro, monta um dataURL padrão (jpeg)
      if (cached && !cached.startsWith('data:')) {
        const looksLikeBase64 = /^[A-Za-z0-9+/=\r\n]+$/.test(cached);
        if (looksLikeBase64) {
          cached = `data:image/jpeg;base64,${cached}`;
        }
      }

      this.fotoPreviewDataUrl = cached || null;
      this.atualizarHrefSeguro();
    } catch {
      this.fotos = [];
      this.fotoPreviewDataUrl = null;
      this.atualizarHrefSeguro();
    }
  }

  private atualizarHrefSeguro() {
    // Limpa blob anterior para evitar vazamento de memória
    if (this.fotoPreviewBlobUrl) {
      try {
        URL.revokeObjectURL(this.fotoPreviewBlobUrl);
      } catch {
        // ignore
      }
      this.fotoPreviewBlobUrl = null;
    }

    if (!this.fotoPreviewDataUrl) {
      this.fotoPreviewSafeHref = null;
      return;
    }

    // Converte dataURL -> Blob URL (evita 'unsafe:data:' em href)
    try {
      const dataUrl = this.fotoPreviewDataUrl;
      const match = /^data:([^;]+);base64,(.*)$/s.exec(dataUrl);
      if (!match) {
        // fallback: ainda assim tenta abrir como URL normal
        this.fotoPreviewSafeHref = this.sanitizer.bypassSecurityTrustUrl(dataUrl);
        return;
      }

      const mime = match[1] || 'image/jpeg';
      const b64 = match[2] || '';
      const byteString = atob(b64);
      const bytes = new Uint8Array(byteString.length);
      for (let i = 0; i < byteString.length; i++) bytes[i] = byteString.charCodeAt(i);
      const blob = new Blob([bytes], { type: mime });
      this.fotoPreviewBlobUrl = URL.createObjectURL(blob);
      this.fotoPreviewSafeHref = this.sanitizer.bypassSecurityTrustUrl(this.fotoPreviewBlobUrl);
    } catch {
      this.fotoPreviewSafeHref = this.sanitizer.bypassSecurityTrustUrl(this.fotoPreviewDataUrl);
    }
  }

  private migrarCacheFotoSeMudou(oldOsId: string, newOsId: string, osCod: string) {
    if (!oldOsId || oldOsId.length !== 36) return;
    if (!newOsId || newOsId.length !== 36) return;
    if (oldOsId === newOsId) return;

    try {
      const listRaw =
        localStorage.getItem(this.getFotosCacheKeyById(oldOsId)) ||
        (osCod ? localStorage.getItem(this.getFotosCacheKeyByCod(osCod)) : null);
      if (listRaw) {
        localStorage.setItem(this.getFotosCacheKeyById(newOsId), listRaw);
      }

      const dataUrl =
        localStorage.getItem(this.getFotoCacheKeyById(oldOsId)) ||
        localStorage.getItem(this.getLegacyFotoCacheKey(oldOsId)) ||
        (osCod ? localStorage.getItem(this.getFotoCacheKeyByCod(osCod)) : null);

      const fotoId =
        localStorage.getItem(this.getFotoIdCacheKeyById(oldOsId)) ||
        localStorage.getItem(this.getLegacyFotoIdCacheKey(oldOsId)) ||
        (osCod ? localStorage.getItem(this.getFotoIdCacheKeyByCod(osCod)) : null);

      if (dataUrl) {
        localStorage.setItem(this.getFotoCacheKeyById(newOsId), dataUrl);
        localStorage.setItem(this.getLegacyFotoCacheKey(newOsId), dataUrl);
      }
      if (fotoId) {
        localStorage.setItem(this.getFotoIdCacheKeyById(newOsId), fotoId);
        localStorage.setItem(this.getLegacyFotoIdCacheKey(newOsId), fotoId);
      }
    } catch {
      // ignore
    }
  }

  private atualizarQueryParamOsComNovoId(novoOsId: string) {
    try {
      if (!novoOsId || novoOsId.length !== 36) return;

      const raw = this.route.snapshot?.queryParams?.['os'];
      if (!raw || typeof raw !== 'string') return;

      const trimmed = raw.trim();
      if (!trimmed.startsWith('{') || !trimmed.endsWith('}')) return;

      let obj: Record<string, unknown> | null = null;
      try {
        obj = JSON.parse(trimmed) as Record<string, unknown>;
      } catch {
        // tenta aspas simples
        try {
          obj = JSON.parse(trimmed.replace(/'/g, '"')) as Record<string, unknown>;
        } catch {
          obj = null;
        }
      }
      if (!obj) return;

      obj['OsId'] = novoOsId;
      obj['osId'] = novoOsId;
      obj['IdOs'] = novoOsId;
      obj['id'] = novoOsId;

      const updated = JSON.stringify(obj);
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { os: updated },
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
    } catch {
      // ignore
    }
  }

  // --------- LOOKUPS / COMBOS ---------

  private carregarCombosComCallback(callback: () => void) {
    // Equipamentos
    let carregadas = 0;
    const total = 7;
    const checkDone = () => { carregadas++; if (carregadas === total) callback(); };
    this.ordemService.listarEquipamentos().subscribe({
      next: (lista) => { this.equipamentosLista = lista || []; checkDone(); },
    });
    this.ordemService.listarEmpreendimentos().subscribe({
      next: (lista) => { this.empreendimentosLista = lista || []; checkDone(); },
    });
    this.ordemService.listarClassificacoesServico().subscribe({
      next: (lista) => { this.classificacoesLista = lista || []; checkDone(); },
    });
    this.ordemService.listarTiposOs().subscribe({
      next: (lista) => { this.tiposOsLista = lista || []; checkDone(); },
    });
    this.ordemService.listarCausasIntervencao().subscribe({
      next: (lista) => { this.causasIntervencaoLista = lista || []; checkDone(); },
    });
    this.ordemService.listarColaboradoresMotoristas().subscribe({
      next: (lista) => {
        this.motoristasLista = (lista || []).map(m => ({
          ...m,
          id: String((m as any).fornId || (m as any).colaboradorId || (m as any).id || (m as any).colaboradorCod || ''),
        }));
        checkDone();
      },
    });
    this.ordemService.listarColaboradoresManutentores().subscribe({
      next: (lista) => {
        this.manutentoresLista = (lista || []).map(m => ({
          ...m,
          id: String((m as any).fornId || (m as any).colaboradorId || (m as any).id || (m as any).colaboradorCod || ''),
        }));
        checkDone();
      },
    });
  }
      //---------------------------------------------------------------------//
      // ADD ALTERAÇÃO: Toast de sucesso com fechamento automático */
      //--------------------------------------------------------------------//
  private async mostrarToastSucesso() {
    const toast = await this.toastCtrl.create({
      message: 'OS criada e confirmada com sucesso',
      duration: 2500,
      position: 'top',
      color: 'success',
      icon: 'checkmark-circle-outline',
    });

    await toast.present();
  }

  private async mostrarToastAviso(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2800,
      position: 'top',
      color: 'warning',
    });
    await toast.present();
  }

  // --------- NAVEGAÇÃO / CALENDÁRIO ---------

  onBack() {
    this.router.navigate(['/tabs/ordem-servico']);
  }

  async openCalendar(event: Event, fieldName: 'dataAbertura' | 'dataConclusao') {
    const popover = await this.popoverCtrl.create({
      component: CalendarPopoverComponent,
      event,
      backdropDismiss: true,
      translucent: true,
      cssClass: 'calendar-popover',
    });

    await popover.present();
    const { data } = await popover.onDidDismiss();

    if (data && data.date) {
      let dateStr: string;
      // Se vier como objeto Date, converte para ISO
      if (data.date instanceof Date) {
        dateStr = data.date.toISOString();
      } else if (typeof data.date === 'string') {
        // Se vier como string dd/MM/yyyy, converte para ISO
        if (/^\d{2}\/\d{2}\/\d{4}$/.test(data.date)) {
          const [dia, mes, ano] = data.date.split('/');
          const d = new Date(Number(ano), Number(mes) - 1, Number(dia));
          dateStr = d.toISOString();
        } else {
          dateStr = data.date;
        }
      } else {
        dateStr = String(data.date);
      }
      if (fieldName === 'dataAbertura') {
        this.dataAbertura = dateStr;
      } else {
        this.dataConclusao = dateStr;
      }
    }
  }

  formatDate(isoOrDate: string | null): string {
    // Removido log de debug
    if (!isoOrDate) return '';
    // Se já estiver no formato dd/MM/yyyy, só devolve
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(isoOrDate)) {
      return isoOrDate;
    }
    // Se vier no formato yyyy-MM-dd, converte para dd/MM/yyyy
    if (/^\d{4}-\d{2}-\d{2}$/.test(isoOrDate)) {
      const [ano, mes, dia] = isoOrDate.split('-');
      return `${dia}/${mes}/${ano}`;
    }
    // Se vier no formato yyyy-MM-ddTHH:mm:ss (com ou sem milissegundos, sem Z), adiciona Z para parseISO
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(isoOrDate)) {
      try {
        return format(parseISO(isoOrDate + 'Z'), 'dd/MM/yyyy');
      } catch {
        return isoOrDate;
      }
    }
    // Se vier no formato ISO completo, tenta converter
    try {
      return format(parseISO(isoOrDate), 'dd/MM/yyyy');
    } catch {
      return isoOrDate;
    }
  }

  /** Converte a data interna para um formato ISO (ou null) */
  private toApiDate(dateStr: string | null): string | null {
    if (!dateStr) return null;

    // dd/MM/yyyy -> ISO
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
      const [dia, mes, ano] = dateStr.split('/');
      const d = new Date(Number(ano), Number(mes) - 1, Number(dia));
      return d.toISOString();
    }

    // já ISO
    try {
      const d = parseISO(dateStr);
      return d.toISOString();
    } catch {
      return dateStr;
    }
  }

  // --------- PAYLOAD PARA A API ---------

  /** Monta o payload completo da OS com base nos campos da tela */
  private montarPayloadOS(): OrdemServicoPayload {
    // Garante que os campos são sempre o id/UUID do item selecionado
    const payload: OrdemServicoPayload = {
      numeroOs: this.numeroOS,
      descricao: this.descricao,
      equipamento: this.equipamento,
      empreendimento: this.empreendimento,
      empreendimentoIntervencao: this.empreendimentoIntervencao,
      classificacao: this.classificacao,
      tipo: this.tipo,
      causaIntervencao: this.causaIntervencao,
      operadorMotorista: this.operadorMotorista,
      manutentor: this.manutentor,
      statusCodigo: this.statusCodigo,
      dataAbertura: this.toApiDate(this.dataAbertura),
      dataConclusao: this.toApiDate(this.dataConclusao),

    };
    return payload;
  }

  /** Clicou na setinha – monta o JSON igual ao do sistema antigo e chama a API */
  salvarOS() {
    const oldOsId = this.osId;
    const osCod = this.numeroOS;
    // Log do valor atual do campo descricao
    // Monta o objeto principal usando o método centralizador do serviço
    // Só envia IdOs se for um GUID válido (evita duplicidade/criação indevida)
    const idOsValido = (this.osId && this.osId.length === 36) ? this.osId : undefined;
    const params = this.ordemService.montarPayloadOrdemServico({
      ...(idOsValido ? { IdOs: idOsValido } : {}),
      NumeroOs: this.numeroOS,
      Descricao: (this.descricao || '').toString().trim().toUpperCase(),
      EquipamentoId: this.equipamento,
      EmpreendimentoId: this.empreendimento,
      EmpreendimentoIntervencao: this.empreendimentoIntervencao,
      Classificacao: this.classificacao,
      TipoOs: this.tipo,
      CausaIntervencao: this.causaIntervencao,
      ColaboradorId: this.operadorMotorista,
      ManutentorResponsavelId: this.manutentor,
      Status: (this.statusCodigo !== null && this.statusCodigo !== undefined) ? this.statusCodigo : 1,
      DataAbertura: this.dataAbertura,
      DataFechamento: this.dataConclusao,
      // Novos campos:
      DefeitosConstatados: (this.defeitosConstatados || '').toString().trim(),
      CausasProvaveis: (this.causasProvaveis || '').toString().trim(),
      Observacao: (this.observacoes || '').toString().trim(),
    });

    // Validação dos campos obrigatórios conforme documentação
    const obrigatorios = [
      ...(params.OsId ? ['OsId'] : []),
      'Descricao',                // Descrição
      'EquipamentoId',            // Equipamento
      'EmpreendimentoId',         // Empreendimento
      'OsDataAbertura',           // Data Abertura
      'OsDataConclusao',          // Data Conclusão
      'ClassificacaoId',          // Classificação
      'TipoServicoId',            // Tipo
      'CausasId',                 // Causa Intervenção
      'MotoristaOperadorId',      // Operador / Motorista
      'EmprdintervencaoId',       // Empreendimento da intervenção
      'Status',                   // Status
      'ManutentorResponsavelId'   // Manutentor
    ];
    const faltando = obrigatorios.filter((key) => !params[key] && params[key] !== 0);
    if (faltando.length > 0) {
      const msg = 'Preencha todos os campos obrigatórios:\n' + faltando.map(f => {
        switch(f) {
          case 'OsId': return 'Identificador da OS';
          case 'Descricao': return 'Descrição';
          case 'EquipamentoId': return 'Equipamento';
          case 'EmpreendimentoId': return 'Empreendimento';
          case 'OsDataAbertura': return 'Data Abertura';
          case 'OsDataConclusao': return 'Data Conclusão';
          case 'ClassificacaoId': return 'Classificação';
          case 'TipoServicoId': return 'Tipo';
          case 'CausasId': return 'Causa Intervenção';
          case 'MotoristaOperadorId': return 'Operador / Motorista';
          case 'EmprdintervencaoId': return 'Empreendimento da intervenção';
          case 'Status': return 'Status (Selecione um status válido)';
          case 'ManutentorResponsavelId': return 'Manutentor';
          default: return f;
        }
      }).join('\n');
      alert(msg);
      return;
    }

   // Log detalhado dos parâmetros

    this.ordemService.gravarOrdem(params).subscribe({
      next: (res) => {
        // LOG: resposta do backend ao gravar OS
        if (typeof res === 'object') {
        }
        // Se o backend retornar o OsId (GUID) no insert, guarda para anexos/edição
        const returnedId = typeof res === 'string'
          ? res
          : String((res as any)?.OsId ?? (res as any)?.osId ?? (res as any)?.id ?? '');
        if (returnedId && returnedId.length === 36) {
          // LOG: OS não foi duplicada, ID retornado corretamente
          if (oldOsId && oldOsId !== returnedId) {
          } else {
          }
          this.osId = returnedId;
        } else {
          // LOG: backend não retornou OsId válido
        }

        // Atualiza o queryParam 'os' (JSON) para não voltar ao OsId antigo em refresh/retorno.
        this.atualizarQueryParamOsComNovoId(this.osId);

        // Se o backend trocou o OsId, mantém a foto “junto” via cache local.
        this.migrarCacheFotoSeMudou(oldOsId, this.osId, osCod);
        this.atualizarPreviewFoto();
        // 🔧 ALTERAÇÃO: exibe popup automático de sucesso
        this.mostrarToastSucesso();

        // 🔧 ALTERAÇÃO: libera botão Anexar Foto
        this.osConfirmada = true;
      },
      error: async () => {
        // mesmo em erro, mantém o fluxo atual conforme solicitado
        await this.mostrarToastSucesso();
        this.osConfirmada = true;

        // Mesmo em erro, tenta atualizar o preview (pode ter voltado da tela de foto)
        this.atualizarPreviewFoto();
      },
    });
  }
    //ALTERAÇÃO
    irParaNovaFoto() {
    if (!this.osConfirmada) return;

    if (!this.osId || this.osId.length !== 36) {
      this.mostrarToastAviso('OS sem identificador (OsId). Confirme a OS antes de anexar foto.');
      return;
    }

    this.router.navigate(['/tabs/ordem-servico-nova-foto'], {
        queryParams: { osId: this.osId, osCod: this.numeroOS, os: this.osId },
    });
  }

  //AQUI ERA A ROT ANTIGA
/*
  private irParaDefeitos() {
    this.router.navigate(['/tabs/ordem-servico-defeitos'], {
      queryParams: { os: this.numeroOS },
    });
  }
*/
  onMotoristaChange(event: any) {
    let guid = event.detail?.value;
    // Se não for um GUID, tenta buscar na lista
    if (!guid || guid.length !== 36) {
      const motorista = this.motoristasLista?.find(m => m.id === guid || m.colaboradorCod === guid || m.colaboradorId === guid);
      guid = motorista?.id || '';
    }
    this.operadorMotorista = guid;
  }
}
