var APP_DATA = {
  barbers: [
    {
      id: 1,
      name: 'Leonardo',
      nick: '@cortsleo01',
      specialty: 'Cortes e Penteados',
      rating: '5,0',
      reviews: 0,
      stars: 5,
      photo: 'https://mkbsbniaukramqzzbzpt.supabase.co/storage/v1/object/public/avatars/perfil%20leo.jpg',
      phone: '+5511919021251',
      instagram: 'https://www.instagram.com/cortsleo01',
      bio: 'Especialista em cortes modernos e penteados.'
    },
    {
      id: 2,
      name: 'Gabriel',
      nick: '@capital_7_letra',
      specialty: 'Degradê e Barba',
      rating: '5,0',
      reviews: 0,
      stars: 5,
      photo: 'https://mkbsbniaukramqzzbzpt.supabase.co/storage/v1/object/public/avatars/perfil%20biel.jpeg',
      phone: '+5511919021251',
      instagram: 'https://www.instagram.com/capital_7_letra',
      bio: 'Especialista em degradê e acabamentos precisos.'
    },
    {
      id: 3,
      name: 'Pumpe',
      nick: '@pumpecorts',
      specialty: 'Cortes e Navalhado',
      rating: '5,0',
      reviews: 0,
      stars: 5,
      photo: 'https://mkbsbniaukramqzzbzpt.supabase.co/storage/v1/object/public/avatars/perfil%20pumpe.jpeg',
      phone: '+5511919021251',
      instagram: 'https://www.instagram.com/pumpecorts',
      bio: 'Especialista em cortes navalhados e modernos.'
    }
  ],
  services: [
    { id:1,  name:'Corte Social',               category:'corte',    price:30,   duration:'30 min', badge:'',              icon:'✂️' },
    { id:2,  name:'Corte Degradê na Máquina',   category:'corte',    price:35,   duration:'45 min', badge:'',              icon:'✂️' },
    { id:3,  name:'Corte Navalhado',             category:'corte',    price:40,   duration:'45 min', badge:'',              icon:'✂️' },
    { id:4,  name:'Corte e Penteado',            category:'corte',    price:60,   duration:'60 min', badge:'A PARTIR DE',   icon:'✂️' },
    { id:5,  name:'Barba',                       category:'barba',    price:35,   duration:'30 min', badge:'',              icon:'🧔' },
    { id:6,  name:'Corte + Barba + Sobrancelha', category:'combo',    price:70,   duration:'75 min', badge:'MAIS ESCOLHIDO',icon:'⭐' },
    { id:7,  name:'Sobrancelha',                 category:'estetica', price:10,   duration:'15 min', badge:'',              icon:'👁️' },
    { id:8,  name:'Progressiva',                 category:'estetica', price:60,   duration:'90 min', badge:'',              icon:'💆' },
    { id:9,  name:'Luzes',                       category:'estetica', price:60,   duration:'90 min', badge:'',              icon:'✨' },
    { id:10, name:'Limpeza de Pele',             category:'estetica', price:15,   duration:'30 min', badge:'',              icon:'🧴' },
    { id:11, name:'Pomada',                      category:'produto',  price:20,   duration:null,     badge:'',              icon:'🫙' },
    { id:12, name:'Gel',                         category:'produto',  price:null, duration:null,     badge:'CONSULTE',      icon:'🫙' },
    { id:13, name:'Óleo para Barba',             category:'produto',  price:null, duration:null,     badge:'CONSULTE',      icon:'💧' },
    { id:14, name:'Laquê',                       category:'produto',  price:40,   duration:null,     badge:'',              icon:'💨' },
    { id:15, name:'Cerveja Heineken',            category:'bebida',   price:10,   duration:null,     badge:'',              icon:'🍺' },
    { id:16, name:'Cerveja Skol',                category:'bebida',   price:5,    duration:null,     badge:'',              icon:'🍺' },
    { id:17, name:'Suco',                        category:'bebida',   price:6,    duration:null,     badge:'',              icon:'🥤' },
    { id:18, name:'Refrigerante',                category:'bebida',   price:6,    duration:null,     badge:'',              icon:'🥤' },
    { id:19, name:'Ficha Sinuca',                category:'lazer',    price:3,    duration:null,     badge:'',              icon:'🎱' }
  ],
  bookableCategories: ['corte','barba','combo','estetica'],
  appointments: [],
  info: {
    name: 'Ls. Barbearia',
    slogan: 'Estilo · Atitude · Confiança',
    address: 'Estr. da Água Espraiada, 2940',
    phone: '(11) 91902-1251',
    whatsapp: '+5511919021251',
    instagram: 'https://www.instagram.com/ls_barbearia00'
  }
};

var currentState = {
  selectedService: { name:'Corte Degradê na Máquina', price:'R$ 35', duration:'45 min' },
  selectedDate: '',
  selectedTime: '',
  currentBarberDashId: 1,
  currentClientId: null,
  dashFilter: 'todos',
  serviceFilter: 'todos',
  ganhosFilter: 'hoje'
};