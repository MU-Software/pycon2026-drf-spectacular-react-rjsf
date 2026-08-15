import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

import {
  type AdminRecord,
  createAdminRecord,
  getAdminFormSchema,
  listAdminRecords,
  listSelectables,
  removeAdminRecord,
  retrieveAdminRecord,
  updateAdminRecord,
} from "./api";

const QUERY_KEYS = {
  LIST: ["admin", "list"],
  RETRIEVE: ["admin", "retrieve"],
  SCHEMA: ["admin", "schema"],
  SELECTABLES: ["admin", "selectables"],
} as const;

const MUTATION_KEYS = {
  CREATE: ["admin", "create"],
  UPDATE: ["admin", "update"],
  REMOVE: ["admin", "remove"],
} as const;

export const useSchemaQuery = (app: string, resource: string) =>
  useSuspenseQuery({
    queryKey: [...QUERY_KEYS.SCHEMA, app, resource],
    queryFn: () => getAdminFormSchema(app, resource),
    staleTime: Infinity,
  });

export const useListQuery = <T extends AdminRecord>(app: string, resource: string) =>
  useSuspenseQuery({
    queryKey: [...QUERY_KEYS.LIST, app, resource],
    queryFn: () => listAdminRecords<T>(app, resource),
  });

export const useRetrieveQuery = <T extends AdminRecord>(app: string, resource: string, id: number) =>
  useSuspenseQuery({
    queryKey: [...QUERY_KEYS.RETRIEVE, app, resource, id],
    queryFn: () => retrieveAdminRecord<T>(app, resource, id),
  });

export const useSelectablesQuery = (app: string, resource: string) =>
  useSuspenseQuery({
    queryKey: [...QUERY_KEYS.SELECTABLES, app, resource],
    queryFn: () => listSelectables(app, resource),
    staleTime: Infinity,
  });

const useInvalidateResource = (app: string, resource: string) => {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ["admin"], predicate: ({ queryKey }) => queryKey.includes(app) && queryKey.includes(resource) });
};

export const useCreateMutation = <T extends AdminRecord>(app: string, resource: string) => {
  const invalidate = useInvalidateResource(app, resource);
  return useMutation({
    mutationKey: [...MUTATION_KEYS.CREATE, app, resource],
    mutationFn: (data: Record<string, unknown>) => createAdminRecord<T>(app, resource, data),
    onSuccess: invalidate,
  });
};

export const useUpdateMutation = <T extends AdminRecord>(app: string, resource: string) => {
  const invalidate = useInvalidateResource(app, resource);
  return useMutation({
    mutationKey: [...MUTATION_KEYS.UPDATE, app, resource],
    mutationFn: (payload: { id: number; data: Record<string, unknown> }) => updateAdminRecord<T>(app, resource, payload),
    onSuccess: invalidate,
  });
};

export const useRemoveMutation = (app: string, resource: string) => {
  const invalidate = useInvalidateResource(app, resource);
  return useMutation({
    mutationKey: [...MUTATION_KEYS.REMOVE, app, resource],
    mutationFn: (id: number) => removeAdminRecord(app, resource, id),
    onSuccess: invalidate,
  });
};
