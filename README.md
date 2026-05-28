# Dom Cortes — Barbearia Premium App

App mobile web para barbearia com visual dark, vermelho e azul.

## Como rodar localmente

Basta abrir o `index.html` no navegador. Não precisa de build ou servidor.

```
barbearia-app/
  index.html           ← entrada do app
  src/
    style.css          ← todos os estilos
    app.js             ← roteador principal
    data/
      mockData.js      ← dados mockados (clientes, barbeiros, serviços)
    components/
      sidebar.js       ← menu lateral
      bottomNav.js     ← navegação inferior
    pages/
      home.js          ← tela inicial
      services.js      ← serviços
      agendar.js       ← calendário + horários
      barbeiros.js     ← lista de barbeiros
      barberDashboard.js ← área do barbeiro (ver clientes)
      clienteDetalhe.js  ← detalhe do cliente agendado
      perfil.js        ← perfil do usuário
      promos.js        ← promoções
      galeria.js       ← galeria de cortes
      confirmacao.js   ← confirmação de agendamento
```

## Deploy na Vercel

1. Sobe a pasta no GitHub
2. Conecta o repositório na Vercel (vercel.com)
3. Clica em Deploy — pronto!

## Próximos passos

- Conectar ao Supabase (auth + banco de dados)
- Notificações push (Supabase Realtime)
- Chat entre cliente e barbeiro
- Upload de foto de perfil do cliente
- Painel financeiro do barbeiro (dia/semana/mês/ano)

## Telas disponíveis

| Tela | Descrição |
|------|-----------|
| Início | Hero + cards de navegação |
| Serviços | Lista com fotos e preços |
| Agendar | Calendário + horários clicáveis |
| Barbeiros | Lista com avaliações |
| Área do Barbeiro | Dashboard com todos os clientes agendados |
| Detalhe do Cliente | Foto, nome, apelido, serviço, data, horário, foto de referência |
| Perfil | Dados do usuário + próximo agendamento |
| Promoções | Banner + ofertas |
| Galeria | Grid de fotos por categoria |
| Confirmação | Resumo do agendamento |
