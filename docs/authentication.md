# Autenticação

O Hub usa Supabase Auth com e-mail e senha. O cadastro público deve permanecer
desativado: usuários são criados pela administração no painel do Supabase. O
papel do aplicativo vem da tabela `public.profiles`, nunca de metadados editáveis
pelo usuário.

## Configuração local

1. No painel do projeto Supabase, abra **Project Settings → API** e copie o
   **Project URL** e a chave pública **anon** (ou publishable). Não use a chave
   `service_role`.
2. Salve esses valores em `apps/web/.env.local`, sem enviá-los pelo chat:

   ```dotenv
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   ```

3. No **SQL Editor** do Supabase, execute a migração
   [`20261114000000_auth_profiles.sql`](../supabase/migrations/20261114000000_auth_profiles.sql).
   Ela cria `profiles`, ativa RLS e permite que cada usuário leia somente o
   próprio perfil. Não concede ao usuário políticas de inserção ou alteração
   de papel.
4. Em **Authentication → Users**, crie o primeiro usuário com o e-mail e uma
   senha temporária forte. Não habilite cadastro público.
5. Copie o UUID desse usuário e, no **SQL Editor**, atribua o papel inicial:

   ```sql
   insert into public.profiles (id, role)
   values ('<UUID_DO_USUARIO>', 'administrator');
   ```

   Substitua o marcador pelo UUID do usuário criado. Não coloque senhas ou
   tokens nesse comando.
6. Inicie o app na raiz do workspace com `pnpm dev` e entre em `/login`.

O middleware do Next.js atualiza os cookies de sessão Supabase. A chave usada
pelo app é pública; as operações de autenticação e leitura do perfil são
validadas no servidor. Nenhuma chave `service_role` é necessária ou deve ser
configurada no app.

## Estado e limites

- Não há formulário de cadastro no Hub; novos usuários devem ser criados pela
  administração no painel do Supabase e receber um perfil explicitamente.
- Um usuário autenticado sem registro em `profiles` não recebe acesso ao Hub.
- Os papéis disponíveis são `reader`, `analyst`, `approver` e `administrator`.
  Alterações de papel são feitas por uma pessoa administradora no banco, não
  pelo usuário.
- A atribuição de usuários a clientes ainda precisa ser conectada aos casos de
  uso antes de disponibilizar dados de clientes. O papel `administrator` não
  concede acesso implícito a todos os clientes.
- Credenciais antigas de desenvolvimento local foram removidas do app. Não
  reutilize senhas temporárias em staging ou produção.
