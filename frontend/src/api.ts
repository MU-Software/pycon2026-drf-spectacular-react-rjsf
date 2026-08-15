import { formSchemaFromJsonSchema, type AdminSchemaDefinition } from "./schema";

export type AdminRecord = Record<string, unknown> & {
  id: number;
  str_repr?: string;
  created_by?: string;
  updated_at?: string;
};
export type Selectable = { const: number; title: string };

export type Proposal = AdminRecord & {
  str_repr: string;
  created_by: string;
  title: string;
  track: string;
  description: string;
  topics: string[];
  room: number | null;
  reviewers: number[];
  is_featured: boolean;
  status: "draft" | "accepted" | "rejected";
  created_at: string;
  updated_at: string;
};

const parse = async <T,>(responseOrPromise: Response | Promise<Response>): Promise<T> => {
  const response = await responseOrPromise;
  if (response.ok) return response.json() as Promise<T>;
  const body = await response.json().catch(() => ({ detail: "요청에 실패했습니다." }));
  throw new Error(Object.entries(body).map(([key, value]) => `${key}: ${String(value)}`).join("\n"));
};

const resourceUrl = (app: string, resource: string, id?: number) =>
  `/api/admin/${app}/${resource}/${id === undefined ? "" : `${id}/`}`;

export const getAdminFormSchema = async (app: string, resource: string) => {
  const definition = await parse<AdminSchemaDefinition>(fetch(`${resourceUrl(app, resource)}json-schema/`));
  return formSchemaFromJsonSchema(definition);
};

export const listAdminRecords = async <T extends AdminRecord>(app: string, resource: string) =>
  parse<T[]>(fetch(resourceUrl(app, resource)));

export const retrieveAdminRecord = <T extends AdminRecord>(app: string, resource: string, id: number) =>
  parse<T>(fetch(resourceUrl(app, resource, id)));

export const listSelectables = async (app: string, resource: string) =>
  (await parse<{ results: Selectable[] }>(fetch(`${resourceUrl(app, resource)}selectables/`))).results;

export const createAdminRecord = <T extends AdminRecord>(app: string, resource: string, data: Record<string, unknown>) =>
  parse<T>(
    fetch(resourceUrl(app, resource), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
  );

export const updateAdminRecord = <T extends AdminRecord>(
  app: string,
  resource: string,
  { id, data }: { id: number; data: Record<string, unknown> },
) =>
  parse<T>(
    fetch(resourceUrl(app, resource, id), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
  );

export const removeAdminRecord = async (app: string, resource: string, id: number) => {
  const response = await fetch(resourceUrl(app, resource, id), { method: "DELETE" });
  if (!response.ok) throw new Error("삭제하지 못했습니다.");
};
