export const AVATARS = [
  { id:'drop',  label:'Gotinha',    desc:'Energica e otimista',   color:'#5bc8f5' },
  { id:'dino',  label:'Dino',       desc:'Divertido e comilão',   color:'#5dd67a' },
  { id:'whale', label:'Baleia',     desc:'Calma e zen',           color:'#6baaf7' },
  { id:'plant', label:'Plantinha',  desc:'Doce e delicada',       color:'#8ed44e' },
  { id:'robot', label:'Robô',       desc:'Inteligente e leal',    color:'#00d4ff' },
  { id:'ghost', label:'Fantasminha',desc:'Brincalhão e travesso', color:'#c084fc' },
  { id:'fire',  label:'Foguinho',   desc:'Apaixonado e intenso',  color:'#fb923c' },
  { id:'cloud', label:'Nuvem',      desc:'Tranquilo e sonhador',  color:'#e2e8f0' },
]
export const ROUTINES = [
  { id:'light',   label:'Leve',     goal:1800, icon:'🌙', desc:'Atividade baixa'       },
  { id:'normal',  label:'Normal',   goal:2000, icon:'☀️', desc:'Rotina comum'          },
  { id:'work',    label:'Trabalho', goal:2200, icon:'💼', desc:'Escritório/Home office' },
  { id:'intense', label:'Intensa',  goal:2500, icon:'🔥', desc:'Alta atividade'        },
  { id:'gym',     label:'Academia', goal:3000, icon:'💪', desc:'Treinos pesados'       },
]
export const NOTIF_MSGS = [
  'Parabéns! Você ignorou a água por mais uma hora. 👏 Orgulho.',
  'Seu rim ligou. Caiu na caixa postal. Ele tá preocupado.',
  'A ciência diz que humanos precisam de água. Talvez você seja especial? 🤔',
  'Sua última hidratação foi em outra era geológica.',
  'Seu médico agradece por garantir a aposentadoria dele. Beba água. 💀',
  'Tecnicamente você pode sobreviver sem água por dias. Tecnicamente. 🫠',
  'Spoiler: a dor de cabeça que vem aí não é do estresse. É sede.',
  'Seu corpo ainda é feito de carne, não de cacto. 🌵',
  'URGENTE: suas células fizeram vaquinha pra comprar água. 🆘',
  'Seu fígado pediu demissão. RH tá segurando, mas ele tá no limite.',
  'Seu sangue tá mais grosso que desculpa de segunda-feira. 🩸',
  'Você gastou dinheiro em skincare. A água é de graça. Irônico. ✨',
  'Hidratado você pensa melhor. Desidratado você manda áudio de 3 min. 🎤',
  'Seu cérebro encolhiu 2% hoje. Tá explicado as decisões de ontem. 🧠',
  'A garrafinha te olha com decepção silenciosa. 🫙',
  'Bebe água ou perde o streak. Simples assim. 🔥',
  'Hoje você tomou menos água que uma suculenta. UMA SUCULENTA. 🪴',
  'Você não é um camelo. Embora a situação esteja parecida.',
  'Café não conta. Refrigerante não conta. Lágrima não conta. 😤',
  'Imagine ser 60% água e passar sede. Que ironia cruel da natureza.',
  'Seu personagem tá murchando aqui. Olha o estado dele. 😵',
  '+200ml e você desbloqueia felicidade real. Tente. ✨',
  'Água: o único vício saudável disponível. Seja viciado. 💧',
  'Seu rim mandou coraçãozinho. Retribua com hidratação. 🙏',
  '3, 2, 1... Beba água AGORA! ⏰',
]
export const MOTIVATIONAL = [
  'Hoje você bebe água ou o rim cobra depois. 💧',
  'Café te acorda. Água te mantém vivo. Prioridades. ☕➡️💧',
  'Cada gole é um tapa carinhoso no seu fígado. 👊',
  'Você gastou dinheiro em skincare. A água é de graça. Irônico. ✨',
  'Hidratado você pensa melhor. Desidratado você manda áudio de 3 min. 🎤',
  'Água: o único vício que o médico aplaude. 💊',
  'O segredo dos bem-sucedidos? Água, sono e não te contar o resto. 🤫',
  'Beber água é praticamente um superpoder que todo mundo ignora. ⚡',
  'Sua pele agradece. Seu rim agradece. Seu humor agradece. 🌟',
  'Pequeno hábito, grande diferença. Beba mais um gole. 💪',
]
export const ACHIEVEMENTS = [
  { id:'first_sip',  label:'Primeiro Gole',    desc:'Primeiro registro',      icon:'🌊', xp:50   },
  { id:'day1',       label:'Dia Hidratado',     desc:'Meta diária atingida',   icon:'⭐', xp:100  },
  { id:'liter',      label:'Litro Zero',        desc:'1000ml em um dia',       icon:'🏆', xp:150  },
  { id:'streak3',    label:'3 Dias On Fire',    desc:'3 dias consecutivos',    icon:'🔥', xp:200  },
  { id:'early',      label:'Madrugador',        desc:'Água antes das 8h',      icon:'🌅', xp:75   },
  { id:'night',      label:'Noturno',           desc:'Água após as 22h',       icon:'🌙', xp:75   },
  { id:'consistent', label:'Consistente',       desc:'5 registros em um dia',  icon:'💪', xp:100  },
  { id:'streak7',    label:'Uma Semana!',       desc:'7 dias consecutivos',    icon:'💎', xp:500  },
  { id:'master',     label:'Mestre da Água',    desc:'Nível 5 atingido',       icon:'🧙', xp:300  },
  { id:'streak14',   label:'Quinzena Campeã',   desc:'14 dias consecutivos',   icon:'👑', xp:1000 },
  { id:'champion',   label:'Campeão',           desc:'Meta 10 dias seguidos',  icon:'🥇', xp:1000 },
  { id:'speed',      label:'Veloz',             desc:'500ml na primeira hora', icon:'⚡', xp:150  },
]
export const LEVEL_TITLES = [
  'Iniciante Seco','Aprendiz da Gota','Hidratante','Caminhante Aquoso',
  'Guerreiro da Água','Mestre da Hidratação','Lenda Aquática','Deus das Águas',
]
export const fmt      = ml => ml >= 1000 ? `${(ml/1000).toFixed(1)}L` : `${ml}ml`
export const todayKey = () => new Date().toISOString().split('T')[0]
export const xpInfo   = xp => {
  const level = Math.floor(xp/200)+1
  const prev=(level-1)*200, next=level*200
  return { level, progress:(xp-prev)/(next-prev), next,
    title:LEVEL_TITLES[Math.min(level-1,LEVEL_TITLES.length-1)] }
}
export const ls = {
  get:  k    => { try{ return JSON.parse(localStorage.getItem(k)) }catch{ return null } },
  set:  (k,v)=> { try{ localStorage.setItem(k,JSON.stringify(v)) }catch{} },
}
export const AVATAR_ICONS = { drop:'💧',dino:'🦕',whale:'🐳',plant:'🌱',robot:'🤖',ghost:'👻',fire:'🔥',cloud:'☁️' }
