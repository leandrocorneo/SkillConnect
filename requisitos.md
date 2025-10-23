# Relatório de Requisitos para Modelagem

Escopo inicial (módulos priorizados)
1. Autenticação e autorização (login/register, refresh, roles)
2. Usuários / Perfil (avatar)
3. Serviços (CRUD + imagens + pesquisa/listagem/página de detalhe)
4. Categorias (CRUD)
5. Pedidos (orders)
6. Reviews (avaliar serviços)
7. Mensagens (chat simples entre cliente e provedor)
8. Upload de imagens (morfismo images_services)
9. Infra & Observability: logging, métricas, health-check
10. Testes e segurança (OWASP basics + JWT, rate limiting)

Recomendações principais
- Backend: API RESTful versionada (/api/v1/), autenticação JWT + refresh tokens, RBAC simples (roles: admin/provider/client).
- Frontend: SPA Vue 3 + Vite, Pinia para state global; roteamento com Vue Router; componentes reutilizáveis.
- Priorizar entregas que habilitam frontend (auth, services endpoints).
- Observability: logs estruturados (JSON), métricas (Prometheus), tracing (OpenTelemetry).
- Testes: cobertura mínima de 70% nas áreas críticas; E2E com Cypress para fluxos críticos.

---

## Inventário inicial de módulos (a partir do código existente)

Módulos:
- Autenticação 
- Usuários
- Serviços
- Imagens
- Categories
- Orders 
- Reviews 
- Messages

**Hipóteses (H)**
- H1: Tabela `services` com colunas: id, user_id, category_id, title, description, price, available, location, timestamps.
- H2: Tabela `orders` com: id, client_id, service_id, status, description, scheduled_date.
- H3: `reviews` com client_id, service_id, rating, comment.
- H4: `messages` com sender_id, receiver_id, message, read_at.
- H5: Roles: 'provider' e 'client'

---

## Detalhamento por funcionalidade

> Para cada funcionalidade: descrição, objetivo, fluxo, entradas/saídas, regras, dependências, roles, NFRs, casos de erro.

### 1) Autenticação e Conta (Auth)
- Descrição: registro, login, refresh tokens, recuperação de senha, verificação de email.
- Objetivo: permitir acesso seguro; separar providers e clients.
- Fluxo (resumido): register -> confirm email (optional) -> login -> access token + refresh token -> refresh
- Entradas/saídas (exemplos):
  - POST /api/v1/auth/register
    - request: {name,email,password,password_confirmation,role}
    - response 201: { user, access_token, refresh_token }
  - POST /api/v1/auth/login
    - request: {email,password}
    - response 200: { access_token, refresh_token, user }
- Regras: senha min 8; rate limit login (ex.: 5 tentativas/15min); role default client.
- Dependências: tabela users, SMTP/email, redis (recomendado) para rate limit.
- Roles: guest, client, provider, (admin se existir)
- NFRs: tempo de resposta <200ms para 95% das requisições de auth.
- Casos de erro: 400,401,429,500.

### 2) Usuário / Perfil
- Descrição: CRUD de perfil, avatar.
- Endpoints: GET/PUT /api/v1/users/me, GET /api/v1/users/{id}
- Regras: apenas dono edita; avatar max 5MB, tipos jpeg/png.

### 3) Serviços (Service)
- Descrição: provedores criam/edita/deletam serviços; clientes buscam e contratam.
- Modelo: id, user_id, category_id, title, description, price, available, location, timestamps.
- Endpoints principais:
  - GET /api/v1/services
  - POST /api/v1/services (provider)
  - GET /api/v1/services/{id}
  - PUT /api/v1/services/{id}
  - DELETE /api/v1/services/{id}
- Regras: apenas providers criam/edita/delete; validações (price >=0, title len); provider só edita seus serviços.

### 4) Imagens (ImagesServices)
- Descrição: upload e associação (morphMany) a serviços.
- Migration presente: `images_services` com campos: id, path, disk, imageable_type, imageable_id, order, timestamps.
- Endpoints:
  - POST /api/v1/services/{id}/images (multipart/form-data)
  - DELETE /api/v1/services/{id}/images/{imageId}
- Regras: max 8 imagens por serviço; validação MIME, size.

### 5) Categories
- Endpoints: GET /api/v1/categories, POST/PUT/DELETE (admin)
- Regras: nome único, ao deletar reatribuir ou bloquear.

### 6) Orders
- Descrição: cliente contrata serviço.
- Modelo (inferido): id, client_id, service_id, status, description, scheduled_date.
- Endpoints principais:
  - POST /api/v1/services/{serviceId}/orders
  - GET /api/v1/orders (filtrado por usuário)
  - PATCH /api/v1/orders/{id}/status
- Regras: cliente não pode contratar próprio serviço; apenas pending orders canceláveis.

### 7) Reviews
- Endpoints: POST /api/v1/services/{serviceId}/reviews, GET reviews
- Regras: rating 1..5; idealmente somente clientes que completaram pedido podem avaliar (confirmar).

### 8) Messages
- Endpoints: POST /api/v1/messages, GET /api/v1/conversations/{userId}
- Regras: somente participantes podem ver mensagens; anti-spam rate limiting.

---

## Modelagem de dados (ER básico + exemplos)

Entidades primárias e atributos chave (resumo):
- users(id, name, email, password, cpf, role, avatar, timestamps)
- categories(id, name, timestamps)
- services(id, user_id, category_id, title, description, price, available, location, timestamps)
- images_services(id, path, disk, imageable_type, imageable_id, order, timestamps)
- orders(id, client_id, service_id, status, description, scheduled_date, timestamps)
- reviews(id, client_id, service_id, rating, comment, timestamps)
- messages(id, sender_id, receiver_id, message, read_at, timestamps)

ER textual:
- users 1 - N services
- categories 1 - N services
- services 1 - N images_services
- services 1 - N orders
- services 1 - N reviews
- users 1 - N messages (sent/received)

SQL esboço (service):
```sql
CREATE TABLE services (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  category_id BIGINT NULL,
  title VARCHAR(191) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) DEFAULT 0,
  available TINYINT(1) DEFAULT 1,
  location VARCHAR(255) NULL,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL
);
```

Payload JSON exemplo (service detail):
```json
{
  "id": 12,
  "title": "Instalação de ar-condicionado",
  "description": "Instalação completa +/- 2h",
  "price": 250.00,
  "available": true,
  "location": "Rio de Janeiro",
  "category": { "id": 3, "name": "Reformas" },
  "user": { "id": 45, "name": "Carlos Silva", "avatar_url": "https://..." },
  "images": [ { "id": 100, "url": "https://..." } ],
  "reviews_count": 12,
  "reviews_avg_rating": 4.6
}
```

---

## API Design

Padrões:
- Base: /api/v1
- Autenticação: Bearer JWT
- Paginação: page, per_page com meta
- Erros: retornar JSON com `errors` e http status

Lista resumida (exemplos):
- POST /api/v1/auth/register
- POST /api/v1/auth/login
- POST /api/v1/auth/refresh
- GET /api/v1/users/me
- PUT /api/v1/users/me
- GET /api/v1/services
- POST /api/v1/services
- GET /api/v1/services/{id}
- POST /api/v1/services/{id}/images
- POST /api/v1/services/{id}/orders
- POST /api/v1/services/{id}/reviews
- POST /api/v1/messages

---

## Front-end (Vue.js) — telas e components

Páginas principais:
- Home / Landing
- Services List `/services`
- Service Detail `/services/:id`
- Login `/login` e Register `/register`
- User dashboards: `/dashboard` (client) e `/provider` (provider)
- Provider: Create/Edit Service `/services/create`, `/services/:id/edit`
- Messages `/messages`

Components principais reutilizáveis:
- ServiceCard, Pagination, ImageGallery, DropzoneUpload, Modal, StarRating, Form components

State management (Pinia):
- authStore (user, tokens), servicesStore, ordersStore, messagesStore, categoriesStore

Validações: usar VeeValidate ou Zod para alinhar com validação backend.

---

## Non-functional

Segurança:
- JWT + refresh tokens
- Rate limiting e lockouts
- Hash de senhas Argon2/bcrypt
- Não logar dados sensíveis (PII)

Performance:
- Paginação, índices em colunas de busca (title, category_id, user_id), cache (Redis) para queries pesadas

Backup & Observability:
- Backups DB nightly, logs estruturados, métricas Prometheus, traces OpenTelemetry

Testes:
- Backend: unit + integration; target 70% para áreas críticas
- Frontend: unit + E2E (Cypress) para fluxos: login, criar serviço, contratar serviço

---

## Sprint backlog (cards organizados por sprint de 2 semanas)

Sprint 0 (Infra & Auth)
- BE-001: Implementar endpoint POST /api/v1/auth/register & login (JWT + refresh) — 5 pts — Alta
- INF-001: CI pipeline + templates — 3 pts — Alta

Sprint 1 (Core API)
- BE-002: CRUD Services (create/list/show/update/delete) — 8 pts — Alta
- BE-003: CRUD Categories — 3 pts — Média
- FE-001: SPA base + Auth flow (Pinia) — 5 pts — Alta

Sprint 2 (Media/Orders/Reviews)
- BE-004: Upload images + thumbnails async — 5 pts — Alta
- BE-005: Orders endpoints + rules — 8 pts — Alta
- BE-006: Reviews endpoints — 3 pts — Média
- FE-002: Services list & detail pages — 8 pts — Alta
- FE-003: Service create/edit + image upload UI — 5 pts — Alta

Sprint 3 (Messaging & Observability)
- BE-007: Messages API — 5 pts — Média
- FE-004: Messages UI — 8 pts — Média
- INF-002: Observability (logs, metrics, Sentry) — 5 pts — Média

---

## Checklist de entrega e DoD padrão

DoD (por card):
- Código com lint/format
- Unit tests + integration tests relevantes
- Documentação OpenAPI/Swagger atualizada
- Policies e autenticação aplicadas
- PR revisado e merge

### Release MVP checklist
- API core implementada
- SPA com pages principais implementada
- Observability mínima ativada
- E2E para fluxos críticos

---

## Estimativa macro e equipe sugerida
- MVP core: ~3 meses (6 sprints de 2 semanas)
- Equipe sugerida: 1 Tech Lead/PO, 2 Backend, 2 Frontend, 1 QA/DevOps, 1 Designer (parte-time)
