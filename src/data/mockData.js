const APP_DATA = {
  barbers: [
    {
      id: 1,
      name: 'Lucas Ferreira',
      nick: '@lucascuts',
      specialty: 'Especialista em degradê',
      rating: '4,9',
      reviews: 120,
      stars: 5,
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop',
      phone: '+5511999990001'
    },
    {
      id: 2,
      name: 'Rafael Lima',
      nick: '@rafaelcuts',
      specialty: 'Cortes clássicos',
      rating: '4,8',
      reviews: 98,
      stars: 4,
      photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=300&auto=format&fit=crop',
      phone: '+5511999990002'
    },
    {
      id: 3,
      name: 'Bruno Almeida',
      nick: '@brunobarber',
      specialty: 'Barba e pigmentação',
      rating: '4,7',
      reviews: 76,
      stars: 4,
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop',
      phone: '+5511999990003'
    },
    {
      id: 4,
      name: 'Gustavo Martins',
      nick: '@gustavocuts',
      specialty: 'Cortes modernos',
      rating: '4,9',
      reviews: 110,
      stars: 5,
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=300&auto=format&fit=crop',
      phone: '+5511999990004'
    }
  ],

  appointments: [
    {
      id: 1,
      barberId: 1,
      clientName: 'João Paulo',
      clientNick: '@joaopaulox',
      clientPhoto: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop',
      clientPhone: '+5511988880001',
      service: 'Degradê + Barba',
      date: '29/05/2025',
      time: '14:00',
      duration: '60 min',
      price: 'R$ 70,00',
      status: 'confirmado',
      refPhoto: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=300&auto=format&fit=crop',
      notes: 'Degradê fechado nas laterais, franja pra frente'
    },
    {
      id: 2,
      barberId: 1,
      clientName: 'Marcos Silva',
      clientNick: '@marquinhos',
      clientPhoto: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=200&auto=format&fit=crop',
      clientPhone: '+5511988880002',
      service: 'Corte Navalhado',
      date: '29/05/2025',
      time: '15:30',
      duration: '45 min',
      price: 'R$ 45,00',
      status: 'pendente',
      refPhoto: null,
      notes: ''
    },
    {
      id: 3,
      barberId: 1,
      clientName: 'Roberto Figueiredo',
      clientNick: '@beto_fig',
      clientPhoto: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=200&auto=format&fit=crop',
      clientPhone: '+5511988880003',
      service: 'Pigmentação Capilar',
      date: '29/05/2025',
      time: '17:00',
      duration: '90 min',
      price: 'R$ 120,00',
      status: 'confirmado',
      refPhoto: 'https://images.unsplash.com/photo-1503951458645-643d53bfd90f?q=80&w=300&auto=format&fit=crop',
      notes: 'Pigmentação leve, tom natural'
    },
    {
      id: 4,
      barberId: 1,
      clientName: 'Felipe Moura',
      clientNick: '@feliipe_m',
      clientPhoto: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?q=80&w=200&auto=format&fit=crop',
      clientPhone: '+5511988880004',
      service: 'Corte + Barba',
      date: '28/05/2025',
      time: '10:00',
      duration: '60 min',
      price: 'R$ 70,00',
      status: 'concluido',
      refPhoto: null,
      notes: ''
    },
    {
      id: 5,
      barberId: 1,
      clientName: 'André Costa',
      clientNick: '@andre_cst',
      clientPhoto: 'https://images.unsplash.com/photo-1500048993953-d23a436266cf?q=80&w=200&auto=format&fit=crop',
      clientPhone: '+5511988880005',
      service: 'Barba Premium',
      date: '28/05/2025',
      time: '14:00',
      duration: '30 min',
      price: 'R$ 35,00',
      status: 'concluido',
      refPhoto: null,
      notes: 'Barba bem definida, sem muito corte'
    },
    {
      id: 6,
      barberId: 1,
      clientName: 'Thiago Ramos',
      clientNick: '@thiiagoramos',
      clientPhoto: null,
      clientPhone: '+5511988880006',
      service: 'Sobrancelha',
      date: '30/05/2025',
      time: '09:00',
      duration: '20 min',
      price: 'R$ 20,00',
      status: 'pendente',
      refPhoto: null,
      notes: ''
    }
  ],

  services: [
    { name: 'Corte Masculino', desc: 'Corte personalizado com acabamento.', price: 'R$ 45,00', duration: '45 min', img: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=400&auto=format&fit=crop', badge: '' },
    { name: 'Barba', desc: 'Modelagem e acabamento com toalha quente.', price: 'R$ 35,00', duration: '30 min', img: 'https://images.unsplash.com/photo-1517832606299-7ae9b720a186?q=80&w=400&auto=format&fit=crop', badge: '' },
    { name: 'Corte + Barba', desc: 'Combo completo para visual impecável.', price: 'R$ 70,00', duration: '60 min', img: 'https://images.unsplash.com/photo-1503951458645-643d53bfd90f?q=80&w=400&auto=format&fit=crop', badge: 'MAIS ESCOLHIDO' },
    { name: 'Sobrancelha', desc: 'Design e alinhamento.', price: 'R$ 20,00', duration: '20 min', img: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=400&auto=format&fit=crop', badge: '' },
    { name: 'Pigmentação', desc: 'Realce e preenchimento capilar.', price: 'R$ 40,00', duration: '45 min', img: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=400&auto=format&fit=crop', badge: '' }
  ]
};

let currentState = {
  selectedService: { name: 'Corte + Barba', price: 'R$ 70,00', duration: '60 min' },
  selectedDate: '',
  selectedTime: '15:00',
  currentBarberDashId: 1,
  currentClientId: null,
  dashFilter: 'todos'
};
