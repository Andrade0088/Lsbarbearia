# lsBarbearia — Guia de Deploy

## PASSO 1 — Supabase (banco + auth)

1. Acesse https://supabase.com → seu projeto
2. Vá em **SQL Editor** → **New query**
3. Cole o conteúdo do arquivo `supabase/schema.sql` e clique **Run**
4. Vá em **Settings** → **API**
5. Copie:
   - **Project URL** → `https://xxxx.supabase.co`
   - **anon / public key** → chave longa começando com `eyJ...`

---

## PASSO 2 — Configurar credenciais no app

Abra o arquivo `src/lib/supabase.js` e substitua:

```js
const SUPABASE_URL = 'https://SEU_PROJECT_ID.supabase.co';  // ← sua URL
const SUPABASE_ANON_KEY = 'SUA_ANON_KEY_AQUI';              // ← sua chave
```

---

## PASSO 3 — GitHub

```bash
# Na pasta do projeto
git init
git add .
git commit -m "feat: lsBarbearia app inicial"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/lsbarbearia.git
git push -u origin main
```

---

## PASSO 4 — Vercel

1. Acesse https://vercel.com → **Add New Project**
2. Selecione o repositório `lsbarbearia`
3. Framework: **Other**
4. Root directory: deixe vazio (usa a raiz)
5. Clique **Deploy**

> O app ficará disponível em `https://lsbarbearia.vercel.app`

---

## PASSO 5 — Criar primeiro ADM

Após o deploy, registre uma conta normalmente como **Cliente**.
Depois vá no Supabase → **Table Editor** → tabela `profiles` →
encontre seu registro e mude o campo `role` de `cliente` para `adm`.

---

## Estrutura de roles

| Role     | Acesso |
|----------|--------|
| `cliente`  | Home, Serviços, Agendar, Perfil |
| `barbeiro` | Dashboard de clientes, Chat, Ganhos, Escala |
| `adm`      | Tudo acima + gerenciar serviços e barbeiros |
