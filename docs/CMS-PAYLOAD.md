# CMS editorial do IPEM-PE — Payload

## O que foi incorporado

- Payload CMS 3 integrado ao Next.js App Router em `/admin`.
- PostgreSQL como banco de dados (Neon, Supabase ou PostgreSQL institucional).
- Coleções `Users`, `News` e `Media`.
- Perfis `communication`, `editor` e `admin`.
- Comunicação cria e edita as próprias notícias, envia para revisão e não pode publicar diretamente.
- Editor revisa e publica notícias; administrador gerencia usuários, conteúdo e configurações.
- Notícias publicadas pelo CMS passam a alimentar `/noticias`, páginas individuais e os destaques da Home.
- Enquanto o banco/segredos não estiverem configurados, o portal mantém os dados estáticos atuais como fallback.

## Preparação local

Requisitos: Node.js compatível com a versão do Payload/Next instalada e um PostgreSQL acessível. Consulte os requisitos atuais em https://payloadcms.com/docs/getting-started/installation.

1. Copie `.env.example` para `.env`.
2. Configure `DATABASE_URL` com uma URL PostgreSQL válida. Para a Vercel, crie também um armazenamento Blob e informe `BLOB_READ_WRITE_TOKEN`.
3. Gere um segredo forte para `PAYLOAD_SECRET` (por exemplo, `openssl rand -base64 48`).
4. Ajuste `NEXT_PUBLIC_SERVER_URL` para a URL local ou pública correta.
5. Instale as dependências: `npm install`.
6. Gere o mapa do painel: `npm run payload:generate:importmap`.
7. Gere os tipos: `npm run payload:generate:types`.
8. Inicie: `npm run dev`.
9. Acesse `/admin`. O primeiro usuário criado recebe automaticamente o perfil Administrador do portal.

O primeiro acesso ao painel permite criar a conta inicial. Depois, o administrador deve cadastrar individualmente os servidores e atribuir o perfil correto.

## Fluxo editorial

1. Comunicação entra em `/admin`, cria uma notícia, adiciona título, resumo, texto, imagem e descrição alternativa.
2. A Comunicação salva como rascunho ou muda o status para `Aguardando revisão`.
3. Editor acessa a notícia, revisa e altera o status para `Publicado` (preencher a data de publicação, se necessário).
4. Apenas documentos publicados são exibidos publicamente.

## Variáveis de ambiente

- `DATABASE_URL`: conexão PostgreSQL com TLS conforme exigido pelo provedor.
- `PAYLOAD_SECRET`: segredo privado e forte usado para autenticação/sessões.
- `NEXT_PUBLIC_SERVER_URL`: URL pública da aplicação, usada em CORS/CSRF.

Nunca envie `.env` ao Git nem compartilhe `PAYLOAD_SECRET` ou credenciais do banco.

## Deploy na Vercel

- Adicione as três variáveis em Project Settings → Environment Variables.
- Use um PostgreSQL gerenciado e armazenamento persistente para mídia. O projeto já prevê o adaptador oficial Vercel Blob para a coleção de mídia; configure `BLOB_READ_WRITE_TOKEN` e valide um upload real antes da publicação.
- Configure o domínio público em `NEXT_PUBLIC_SERVER_URL`.
- Execute os scripts de geração do Payload no processo de build conforme o pipeline do projeto.
- Valide login, criação de usuário, upload, workflow editorial, publicação e atualização da Home antes de liberar o acesso à Comunicação.

## Segurança e governança

- Não compartilhe contas: cada servidor deve ter seu próprio usuário.
- Restrinja o acesso ao `/admin` por política institucional, MFA no provedor/SSO quando disponível e senhas fortes.
- O perfil Comunicação não pode publicar diretamente e só consulta/edita as próprias notícias.
- O perfil Editor pode revisar/publicar notícias e gerenciar a biblioteca de mídia.
- O perfil Administrador controla usuários e todas as coleções.
- Antes da produção, validar com TI e Comunicação a política de retenção, backup, restauração e registro de autoria/aprovação.

## Limitações desta primeira integração

- O campo de texto da notícia está em formato simples (textarea com parágrafos separados por linhas em branco); o editor Lexical do Payload está configurado, mas o campo ainda não foi convertido para rich text.
- Não foi configurado envio de e-mail, SSO institucional, MFA próprio, preview editorial, agendamento automático ou integração com redes sociais.
- A biblioteca de mídia requer armazenamento persistente configurado no deploy; o ZIP não contém serviço de armazenamento externo nem credenciais.
- Os conteúdos históricos continuam no fallback estático até serem migrados ou substituídos por notícias cadastradas no CMS.
