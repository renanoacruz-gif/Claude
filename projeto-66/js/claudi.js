/* =============================================================
   PROJETO 66 — Claudi, o analista de execução.
   Motor 100% local: lê o histórico do Store, identifica padrões
   e devolve insights objetivos e orientados à ação.
   ============================================================= */
'use strict';

P66.Claudi = {

  greeting() {
    const S = P66.Store;
    const h = new Date().getHours();
    const nome = S.state.profile.name;
    if (h < 5) return `Madrugada de trabalho, ${nome}? Cuide também do sono.`;
    if (h < 12) return `Bom dia, ${nome}.`;
    if (h < 18) return `Boa tarde, ${nome}.`;
    return `Boa noite, ${nome}.`;
  },

  /* Análise diária completa — lista de insights ordenada por relevância */
  briefing() {
    const S = P66.Store;
    const out = [];
    const today = S.completionForDay(S.today());
    const late = S.lateHabitsToday();
    const hour = new Date().getHours();

    /* 1. Situação de hoje */
    if (today.pct === 100) {
      out.push({ tone: 'good', icon: 'trophy', title: 'Dia vencido', text: `100% executado. ${today.total} de ${today.total} hábitos. Registre sua reflexão e proteja o sono — amanhã o campo de batalha reabre às ${S.habits()[0]?.time || '05:30'}.` });
    } else if (late.length >= 3) {
      out.push({ tone: 'bad', icon: 'warning', title: `${late.length} hábitos atrasados`, text: `${late.map(h => h.name).join(', ')}. Não tente recuperar tudo de uma vez: execute o mais rápido primeiro (${late.slice().sort((a, b) => a.min - b.min)[0].name}) e recupere o ritmo.` });
    } else if (late.length > 0) {
      out.push({ tone: 'warn', icon: 'clock', title: 'Atenção ao relógio', text: `${late.map(h => h.name).join(' e ')} ${late.length > 1 ? 'passaram' : 'passou'} do horário planejado. Ainda dá tempo de fechar o dia em 100%.` });
    } else if (today.done > 0) {
      out.push({ tone: 'good', icon: 'check', title: 'Em dia com o plano', text: `${today.done} de ${today.total} concluídos e nenhum atraso. Mantenha o ritmo — o próximo é "${S.nextHabit()?.name || '—'}".` });
    }

    /* 2. Risco de quebrar o dia à noite */
    if (hour >= 20 && today.pct < 100 && today.pct > 0) {
      const pend = S.habits().filter(h => !S.isDone(h.id));
      out.push({ tone: 'warn', icon: 'moon', title: 'Reta final do dia', text: `Faltam ${pend.length}: ${pend.map(h => h.name).join(', ')}. ${pend.length <= 2 ? 'Dá para fechar 100% antes de dormir.' : 'Priorize os de maior XP e registre o motivo do que ficar para trás.'}` });
    }

    /* 3. Semana atual vs anterior */
    const thisWeekFrom = S.addDays(S.today(), -6);
    const prevWeekFrom = S.addDays(S.today(), -13);
    const prevWeekTo = S.addDays(S.today(), -7);
    const cur = S.rateBetween(thisWeekFrom, S.today());
    const prev = S.rateBetween(prevWeekFrom, prevWeekTo);
    if (cur !== null && prev !== null) {
      const d = cur - prev;
      if (d >= 5) out.push({ tone: 'good', icon: 'arrowUp', title: 'Tendência de evolução', text: `Sua execução subiu de ${prev}% para ${cur}% em relação à semana passada (+${d} pontos). O sistema está funcionando — não mexa no que está dando certo.` });
      else if (d <= -5) out.push({ tone: 'bad', icon: 'arrowDown', title: 'Tendência de regressão', text: `Execução caiu de ${prev}% para ${cur}% (${d} pontos) em relação à semana passada. Reveja o que mudou na rotina nos últimos 7 dias e corte a causa, não o sintoma.` });
      else out.push({ tone: 'info', icon: 'minus', title: 'Semana estável', text: `Execução em ${cur}% contra ${prev}% da semana anterior. Estabilidade é boa — o próximo passo é subir o padrão.` });
    }

    /* 4. Padrão de procrastinação: hábitos executados muito depois do horário */
    const strength = S.habitStrength();
    const procr = strength.filter(x => x.done >= 3 && x.avgDelay > 45);
    if (procr.length) {
      const w = procr[0];
      out.push({ tone: 'warn', icon: 'clock', title: 'Padrão de procrastinação detectado', text: `"${w.habit.name}" é executado em média ${w.avgDelay} min depois das ${w.habit.time}. Ou o horário está errado, ou há um gatilho de fuga antes dele. Sugestão: mova para outro horário ou prepare o ambiente na véspera.` });
    }

    /* 5. Gargalo: hábito mais fraco do ciclo */
    const weak = strength.filter(x => x.opp >= 3).slice(-1)[0];
    if (weak && weak.rate < 60) {
      out.push({ tone: 'bad', icon: 'target', title: 'Gargalo do ciclo', text: `"${weak.habit.name}" está em ${weak.rate}% de execução — é o elo mais fraco. Reduza o atrito: versão mínima de 5 minutos conta como vitória enquanto o hábito não se firma.` });
    }

    /* 6. Janela de ouro: horário em que você mais executa */
    const hist = S.hourHistogram();
    const totalEx = hist.reduce((a, b) => a + b, 0);
    if (totalEx >= 10) {
      const peak = hist.indexOf(Math.max(...hist));
      out.push({ tone: 'info', icon: 'sun', title: 'Sua janela de ouro', text: `A maior parte das suas execuções acontece por volta das ${String(peak).padStart(2, '0')}h. Agende o que é mais difícil perto desse horário — você joga melhor nesse campo.` });
    }

    /* 7. Melhor e pior dia da semana */
    const wd = S.weekdayRates().filter(x => x.n >= 2);
    if (wd.length >= 3) {
      const sorted = [...wd].sort((a, b) => b.pct - a.pct);
      const best = sorted[0], worst = sorted[sorted.length - 1];
      if (best.pct - worst.pct >= 15) {
        out.push({ tone: 'info', icon: 'calendar', title: `${worst.label} é seu dia crítico`, text: `Média de ${worst.pct}% contra ${best.pct}% de ${best.label}. Planeje as ${worst.label}s na véspera com padrão reduzido e inegociável.` });
      }
    }

    /* 8. Streak */
    const streak = S.currentStreak();
    const best = S.bestStreak();
    if (streak >= 3) {
      out.push({ tone: 'good', icon: 'flame', title: `${streak} dias perfeitos seguidos`, text: streak >= best ? 'É a sua melhor sequência até aqui. Proteja-a como patrimônio: a decisão de amanhã começa no sono de hoje.' : `Sua melhor marca é ${best}. Faltam ${best - streak + 1} dias para superá-la.` });
    }

    /* 9. Prioridades de amanhã */
    const lows = strength.filter(x => x.opp >= 2).slice(-3).reverse();
    if (lows.length === 3) {
      out.push({ tone: 'info', icon: 'flag', title: 'Prioridades para amanhã', text: `Comece o dia garantindo os três mais frágeis: ${lows.map(x => `"${x.habit.name}" (${x.rate}%)`).join(', ')}. Vitória neles cedo muda o dia inteiro.` });
    }

    if (!out.length) {
      out.push({ tone: 'info', icon: 'spark', title: 'Coletando dados', text: 'Ainda há pouco histórico para análise. Execute os hábitos de hoje — em poucos dias começo a apontar padrões, gargalos e tendências.' });
    }
    return out;
  },

  /* Mensagem curta e contextual para o dashboard */
  headline() {
    const S = P66.Store;
    const today = S.completionForDay(S.today());
    const late = S.lateHabitsToday();
    const h = new Date().getHours();
    if (today.pct === 100) return 'Missão do dia concluída. Hoje você venceu.';
    if (late.length >= 3) return `${late.length} batalhas atrasadas. Recupere uma agora — a mais curta primeiro.`;
    if (late.length > 0) return `"${late[0].name}" passou do horário. Execute e volte ao plano.`;
    const next = S.nextHabit();
    if (next) return `Próxima batalha: ${next.name} às ${next.time}.`;
    if (h >= 20) return 'Feche o dia com a reflexão e proteja o sono.';
    return 'Plano limpo. Execute.';
  },
};
