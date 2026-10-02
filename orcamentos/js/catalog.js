// Catálogo base: especialidades, unidades, sugestões de serviços (sem preço),
// campos adicionais do pedido e modelos de proposta por especialidade.
(function (root) {
  const UNITS = [
    'serviço', 'unidade', 'hora', 'diária', 'metro', 'm²', 'ponto',
    'peça', 'kg', 'litro', 'galão', 'lata', 'rolo', 'km', 'verba',
  ];

  // Formas de cobrança perguntadas no onboarding.
  const BILLING_MODES = [
    { id: 'serviço', label: 'Por serviço' },
    { id: 'unidade', label: 'Por unidade' },
    { id: 'hora', label: 'Por hora' },
    { id: 'diária', label: 'Por diária' },
    { id: 'metro', label: 'Por metro' },
    { id: 'm²', label: 'Por metro quadrado' },
  ];

  const CATEGORIES = [
    { id: 'labor', label: 'Mão de obra' },
    { id: 'material', label: 'Materiais' },
    { id: 'extra', label: 'Deslocamento e outros acréscimos' },
  ];

  const SPECIALTIES = [
    {
      id: 'handy',
      label: 'Marido de aluguel e pequenos reparos',
      short: 'Pequenos reparos',
      units: ['serviço', 'unidade', 'hora', 'diária'],
      keywords: ['montar', 'montagem', 'fixar', 'fixação', 'pendurar', 'quadro', 'prateleira', 'cortina',
        'persiana', 'varal', 'móvel', 'movel', 'armário', 'armario', 'lustre', 'luminária', 'luminaria',
        'tomada', 'interruptor', 'fechadura', 'maçaneta', 'macaneta', 'porta', 'suporte de tv', 'tv',
        'reparo', 'conserto', 'consertar', 'furar', 'furo', 'trocar lâmpada', 'chuveiro', 'espelho', 'nicho'],
      services: [
        { name: 'Montagem de móvel', unit: 'unidade' },
        { name: 'Instalação de suporte de TV', unit: 'unidade' },
        { name: 'Instalação de prateleira ou nicho', unit: 'unidade' },
        { name: 'Instalação de cortina ou persiana', unit: 'unidade' },
        { name: 'Fixação de quadro ou espelho', unit: 'unidade' },
        { name: 'Troca de tomada ou interruptor', unit: 'unidade' },
        { name: 'Instalação de luminária ou lustre', unit: 'unidade' },
        { name: 'Troca de fechadura ou maçaneta', unit: 'unidade' },
        { name: 'Instalação de varal', unit: 'unidade' },
        { name: 'Pequenos reparos gerais', unit: 'hora' },
        { name: 'Diária de serviços gerais', unit: 'diária' },
      ],
      template: {
        inclusions: ['Mão de obra para as tarefas listadas', 'Ferramentas do prestador', 'Recolhimento de embalagens geradas no serviço'],
        exclusions: ['Peças, acessórios e materiais não listados no orçamento', 'Tarefas não descritas nesta proposta', 'Serviços de alvenaria ou elétrica estrutural'],
        notes: 'Tarefas adicionais solicitadas no local serão orçadas à parte.',
      },
    },
    {
      id: 'ac',
      label: 'Instalação e manutenção de ar-condicionado',
      short: 'Ar-condicionado',
      units: ['serviço', 'unidade', 'metro'],
      keywords: ['ar-condicionado', 'ar condicionado', 'split', 'btu', 'btus', 'condensadora', 'evaporadora',
        'climatizador', 'higienização', 'higienizacao', 'gás', 'carga de gás', 'inverter', 'janela', 'tubulação de cobre'],
      services: [
        { name: 'Instalação de split', unit: 'unidade' },
        { name: 'Desinstalação de aparelho', unit: 'unidade' },
        { name: 'Reinstalação de aparelho', unit: 'unidade' },
        { name: 'Limpeza / higienização', unit: 'unidade' },
        { name: 'Manutenção preventiva', unit: 'unidade' },
        { name: 'Visita técnica / avaliação', unit: 'serviço' },
        { name: 'Tubulação adicional (cobre)', unit: 'metro' },
        { name: 'Instalação de suporte para condensadora', unit: 'unidade' },
      ],
      template: {
        inclusions: ['Mão de obra de instalação/manutenção conforme itens', 'Teste de funcionamento ao final do serviço'],
        exclusions: ['Obras de alvenaria, gesso ou acabamento', 'Adequações na rede elétrica não descritas', 'Tubulação e materiais além do informado no orçamento', 'Andaime ou equipamento de altura, salvo se listado'],
        notes: 'Condições de instalação sujeitas a confirmação no local.',
      },
    },
    {
      id: 'paint',
      label: 'Pintura',
      short: 'Pintura',
      units: ['m²', 'diária', 'serviço'],
      keywords: ['pintura', 'pintar', 'tinta', 'parede', 'teto', 'massa corrida', 'textura', 'grafiato',
        'demão', 'demãos', 'lixar', 'selador', 'fachada', 'verniz', 'esmalte', 'mofo', 'descascando', 'reboco'],
      services: [
        { name: 'Pintura de parede interna', unit: 'm²' },
        { name: 'Pintura de teto', unit: 'm²' },
        { name: 'Pintura externa / fachada', unit: 'm²' },
        { name: 'Aplicação de massa corrida', unit: 'm²' },
        { name: 'Lixamento e preparação de superfície', unit: 'm²' },
        { name: 'Pintura de portas e batentes', unit: 'unidade' },
        { name: 'Pintura de grades e esquadrias', unit: 'm²' },
        { name: 'Diária de pintor', unit: 'diária' },
      ],
      template: {
        inclusions: ['Mão de obra de pintura nas áreas listadas', 'Proteção de pisos e móveis na área de trabalho', 'Limpeza básica ao final'],
        exclusions: ['Tinta e materiais, quando fornecidos pelo cliente', 'Correção de infiltrações ou trincas estruturais', 'Movimentação de móveis pesados', 'Áreas não listadas nesta proposta'],
        notes: 'Áreas informadas pelo cliente estão sujeitas a conferência no local.',
      },
    },
    {
      id: 'plumb',
      label: 'Serviços hidráulicos e encanamento',
      short: 'Hidráulica',
      units: ['serviço', 'ponto', 'hora', 'metro'],
      keywords: ['vazamento', 'vazando', 'cano', 'encanamento', 'torneira', 'registro', 'descarga', 'válvula',
        'valvula', 'sifão', 'sifao', 'ralo', 'entupido', 'entupimento', 'desentupir', 'desentupimento', 'caixa d',
        'caixa acoplada', 'vaso sanitário', 'vaso', 'pia', 'hidráulica', 'hidraulica', 'esgoto', 'aquecedor', 'boia'],
      services: [
        { name: 'Troca de torneira', unit: 'unidade' },
        { name: 'Troca de sifão ou flexível', unit: 'unidade' },
        { name: 'Troca de registro', unit: 'unidade' },
        { name: 'Instalação de vaso sanitário', unit: 'unidade' },
        { name: 'Reparo de caixa acoplada / válvula de descarga', unit: 'unidade' },
        { name: 'Desentupimento', unit: 'serviço' },
        { name: 'Localização e reparo de vazamento', unit: 'serviço' },
        { name: 'Instalação de ponto de água ou esgoto', unit: 'ponto' },
        { name: 'Visita técnica / avaliação', unit: 'serviço' },
        { name: 'Hora técnica de encanador', unit: 'hora' },
      ],
      template: {
        inclusions: ['Mão de obra para os itens listados', 'Teste de estanqueidade/funcionamento nos pontos atendidos'],
        exclusions: ['Quebra e recomposição de piso, azulejo ou alvenaria, salvo se listado', 'Peças e materiais não listados no orçamento', 'Problemas identificados fora dos pontos descritos'],
        notes: 'Serviços que dependem de diagnóstico no local poderão ter o valor revisado após a avaliação.',
      },
    },
  ];

  // Campos adicionais do pedido por especialidade. type: text | textarea | number | select | yesno
  const EXTRA_FIELDS = {
    ac: [
      { key: 'equipmentType', label: 'Tipo de aparelho', type: 'select', options: ['', 'Split hi-wall', 'Split piso-teto', 'Cassete', 'Janela', 'Portátil', 'Multi-split', 'Outro'] },
      { key: 'equipmentQty', label: 'Quantidade de aparelhos', type: 'number' },
      { key: 'btu', label: 'Potência (BTU), se conhecida', type: 'text', placeholder: 'Ex.: 12.000' },
      { key: 'infra', label: 'Infraestrutura existente', type: 'select', options: ['', 'Não há infraestrutura', 'Infraestrutura pronta (tubulação/dreno/elétrica)', 'Parcial', 'Não sabe informar'] },
      { key: 'pipeLength', label: 'Comprimento estimado de tubulação (m)', type: 'text' },
      { key: 'installSite', label: 'Local e condições de instalação', type: 'textarea', placeholder: 'Andar, fachada, altura, acesso à condensadora…' },
    ],
    paint: [
      { key: 'rooms', label: 'Ambientes', type: 'text', placeholder: 'Ex.: sala, 2 quartos' },
      { key: 'surface', label: 'Superfície a pintar', type: 'text', placeholder: 'Parede, teto, porta, grade…' },
      { key: 'area', label: 'Área informada (m²)', type: 'text' },
      { key: 'surfaceState', label: 'Estado da superfície', type: 'select', options: ['', 'Boa, só repintura', 'Pequenas imperfeições', 'Descascando / com mofo', 'Reboco novo', 'Não informado'] },
      { key: 'prep', label: 'Preparação solicitada', type: 'text', placeholder: 'Lixar, massa corrida, selador…' },
      { key: 'paintBy', label: 'Quem fornece tinta e materiais', type: 'select', options: ['', 'Cliente', 'Prestador', 'A definir'] },
      { key: 'coats', label: 'Número de demãos (definido pelo prestador)', type: 'number' },
    ],
    plumb: [
      { key: 'requestType', label: 'Tipo de solicitação', type: 'select', options: ['', 'Instalação', 'Vazamento', 'Troca', 'Desentupimento', 'Outro'] },
      { key: 'points', label: 'Pontos ou peças envolvidos', type: 'text', placeholder: 'Ex.: torneira da cozinha, registro do banheiro' },
      { key: 'location', label: 'Local do problema', type: 'text' },
      { key: 'pipeAccess', label: 'Condições de acesso à tubulação', type: 'text', placeholder: 'Embutida, aparente, forro…' },
      { key: 'knownMaterials', label: 'Materiais conhecidos', type: 'text' },
      { key: 'needsOnsite', label: 'Necessita avaliação presencial?', type: 'yesno' },
    ],
    handy: [
      { key: 'taskList', label: 'Lista de tarefas (uma por linha, com quantidade)', type: 'textarea', placeholder: '2x fixar prateleira\n1x montar guarda-roupa' },
      { key: 'actionType', label: 'Natureza das tarefas', type: 'text', placeholder: 'Montagem, fixação, troca, reparo…' },
      { key: 'availableMaterials', label: 'Materiais e acessórios disponíveis', type: 'text' },
      { key: 'billingMode', label: 'Forma de cobrança escolhida', type: 'select', options: ['', 'Por tarefa', 'Por hora', 'Por diária'] },
    ],
  };

  // Campos relevantes para preço por especialidade (usados para apontar faltantes).
  const PRICE_CRITICAL = {
    ac: ['equipmentType', 'equipmentQty', 'infra', 'installSite'],
    paint: ['area', 'surfaceState', 'paintBy'],
    plumb: ['requestType', 'points', 'pipeAccess'],
    handy: ['taskList'],
  };

  const EVALUATION = [
    { id: 'pending_info', label: 'Informações pendentes' },
    { id: 'awaiting_visit', label: 'Aguardando visita' },
    { id: 'ready', label: 'Pronto para orçamento' },
  ];

  const COMMERCIAL = [
    { id: 'draft', label: 'Rascunho' },
    { id: 'sent', label: 'Enviado' },
    { id: 'approved', label: 'Aprovado' },
    { id: 'lost', label: 'Perdido' },
  ];

  const ESTIMATE_TYPES = [
    { id: 'firm', label: 'Orçamento' },
    { id: 'preliminary', label: 'Estimativa preliminar' },
    { id: 'awaiting_visit', label: 'Aguardando visita técnica' },
  ];

  const specialty = (id) => SPECIALTIES.find((s) => s.id === id);
  const labelOf = (list, id) => (list.find((x) => x.id === id) || {}).label || id;

  root.Catalog = {
    UNITS, BILLING_MODES, CATEGORIES, SPECIALTIES, EXTRA_FIELDS, PRICE_CRITICAL,
    EVALUATION, COMMERCIAL, ESTIMATE_TYPES, specialty, labelOf,
  };
  if (typeof module !== 'undefined') module.exports = root.Catalog;
})(typeof window !== 'undefined' ? window : globalThis);
