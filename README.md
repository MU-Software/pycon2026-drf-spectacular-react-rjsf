# Schema-driven Admin Demo

PyCon KR 발표용 최소 데모입니다. Django REST Framework serializer를 단일 진실 공급원으로 사용해 다음 세 가지를 함께 만듭니다.

1. API 입력 검증
2. drf-spectacular OpenAPI 문서
3. react-jsonschema-form + MUI 관리자 입력 폼

인증, 권한, 배포 설정은 의도적으로 제외했습니다. Django 프로젝트는 저장소 루트가 아닌 `backend/` 안에만 있습니다. 루트의 `uv`와 `pnpm` 워크스페이스에는 이후 `FastAPI + Pydantic`, MCP 서버 예제를 나란히 추가할 수 있습니다.

## 실행

터미널 1:

```bash
uv sync
uv run python backend/manage.py migrate
uv run python backend/manage.py runserver
```

터미널 2:

```bash
pnpm install
pnpm dev
```

- 관리자 데모: http://localhost:5173
- Proposal JSON Schema: http://localhost:8000/api/admin/proposals/proposal/json-schema/

최초 migration에 발표 제안 샘플 3개가 포함되어 있습니다. `topics`는 Django `TextChoices` 기반 다중 선택, `description`은 Markdown 편집·미리보기, `room` FK와 `reviewers` M2M은 관계 필드 예시입니다. RJSF의 MUI Autocomplete가 React Query로 `selectables` API를 조회합니다.

## 발표에서 보여줄 흐름

[`backend/proposals/serializers.py`](backend/proposals/serializers.py)의 필드 하나를 바꿉니다. 예를 들어 `description`의 최소 길이를 바꾸거나 새로운 ChoiceField를 추가한 뒤 브라우저를 새로 고치면:

```text
DRF Serializer → OpenAPI Schema → JSON Schema → RJSF 폼
       └──────────── 같은 검증 규칙 ─────────────┘
```

각 ViewSet의 `JsonSchemaMixin`은 `/api/admin/{app}/{resource}/json-schema/`에서 RJSF가 사용할 `schema`와 `ui_schema`를 반환합니다. 프론트는 `app`과 `resource`만으로 이 엔드포인트를 조회합니다.

[`backend/core/serializers.py`](backend/core/serializers.py)의 `JsonSchemaSerializer`는 `py-openapi-schema-to-json-schema`로 OpenAPI Schema를 JSON Schema로 변환합니다. `JsonSchemaMixin`은 serializer 필드의 표현 힌트를 별도 `ui_schema`로 구성합니다.

프론트의 순수 HTTP 함수는 `frontend/src/api.ts`, React Query의 query/mutation hook과 캐시 무효화는 `frontend/src/hooks.ts`에 분리되어 있습니다. 관계 위젯은 `ui_schema`의 대상 리소스 힌트를 읽어 `/selectables/`를 조회하므로 FK와 M2M마다 별도 폼 코드를 만들 필요가 없습니다.

`AdminList`와 `AdminEditor`는 `app`과 `resource`만으로 API와 라우트에 연결됩니다. [`frontend/src/routes.tsx`](frontend/src/routes.tsx)의 `buildDefaultRoutes`가 목록, 생성, 수정 경로를 한 번에 등록합니다.

## 검증

```bash
uv run ruff check backend
uv run python backend/manage.py spectacular --file /tmp/openapi.yaml --validate
pnpm build
```

## 디렉터리 구조

```text
.
├── pyproject.toml          # uv 루트 환경 (향후 FastAPI/MCP 추가 가능)
├── package.json           # pnpm 루트
├── backend/               # Django는 이 하위에만 격리
│   ├── config/
│   ├── core/              # 재사용 가능한 OpenAPI/serializer/view mixin
│   └── proposals/
└── frontend/              # Vite + React Query + RJSF/MUI
```

이 예제는 개념 전달을 위한 로컬 데모입니다. 실제 운영 어드민에는 인증·권한, 감사 로그, 오류 매핑, 관계형 필드용 비동기 위젯 등이 추가로 필요합니다.
