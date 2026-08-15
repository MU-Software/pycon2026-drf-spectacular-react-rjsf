import { Add, ArrowBack, Delete, Save } from "@mui/icons-material";
import { Alert, Button, Divider, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import type { IChangeEvent } from "@rjsf/core";
import Form from "@rjsf/mui";
import type { RJSFSchema } from "@rjsf/utils";
import { customizeValidator } from "@rjsf/validator-ajv8";
import AjvDraft04 from "ajv-draft-04";
import { useNavigate, useParams } from "react-router-dom";

import type { AdminRecord } from "../../api";
import { useCreateMutation, useRemoveMutation, useRetrieveQuery, useSchemaQuery, useUpdateMutation } from "../../hooks";
import MarkdownField from "../fields/MarkdownField";
import RelationWidget from "../widgets/RelationWidget";

const validator = customizeValidator({ AjvClass: AjvDraft04 });

type AdminEditorProps = {
  app: string;
  resource: string;
  id?: number;
  record?: AdminRecord;
};

export function AdminEditor({ app, resource, id, record }: AdminEditorProps) {
  const navigate = useNavigate();
  const schemaQuery = useSchemaQuery(app, resource);
  const createMutation = useCreateMutation<AdminRecord>(app, resource);
  const updateMutation = useUpdateMutation<AdminRecord>(app, resource);
  const removeMutation = useRemoveMutation(app, resource);
  const basePath = `/${app}/${resource}`;
  const pending = createMutation.isPending || updateMutation.isPending || removeMutation.isPending;
  const mutationError = createMutation.error ?? updateMutation.error ?? removeMutation.error;

  const submit = ({ formData }: IChangeEvent) => {
    const data = formData as Record<string, unknown>;
    if (id) {
      updateMutation.mutate({ id, data }, { onSuccess: () => navigate(basePath) });
      return;
    }
    createMutation.mutate(data, { onSuccess: (created) => navigate(`${basePath}/${created.id}`) });
  };

  const remove = () => {
    if (!record || !window.confirm("이 객체를 삭제할까요?")) return;
    removeMutation.mutate(record.id, { onSuccess: () => navigate(basePath) });
  };

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} gap={2}>
        <Typography variant="h4">{id ? `객체 수정: ${id}` : "새 객체 추가"}</Typography>
        <Button startIcon={<ArrowBack />} onClick={() => navigate(basePath)}>목록</Button>
      </Stack>

      {mutationError && <Alert severity="error">{mutationError.message}</Alert>}

      {record && (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>필드</TableCell>
              <TableCell>값</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(schemaQuery.data.readOnlySchema.properties ?? {}).map(([name, definition]) => {
              const fieldSchema = typeof definition === "object" && definition ? definition as RJSFSchema : null;
              const title = fieldSchema?.title ?? name;
              const value = record[name];
              return (
                <TableRow key={name}>
                  <TableCell>{title}</TableCell>
                  <TableCell>{value == null ? "" : typeof value === "object" ? JSON.stringify(value) : String(value)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      <Form
        key={record?.id ?? "new"}
        schema={schemaQuery.data.schema}
        uiSchema={{ ...schemaQuery.data.uiSchema, "ui:submitButtonOptions": { norender: true } }}
        validator={validator}
        formData={record}
        onSubmit={submit}
        disabled={pending}
        showErrorList={false}
        fields={{ markdown: MarkdownField }}
        widgets={{ relation: RelationWidget }}
      >
        <Divider />
        <Stack direction="row" justifyContent="flex-end" spacing={1.5}>
          {record && <Button color="error" startIcon={<Delete />} onClick={remove}>삭제</Button>}
          <Button onClick={() => navigate(basePath)}>취소</Button>
          <Button type="submit" variant="contained" startIcon={record ? <Save /> : <Add />}>
            {pending ? "저장 중" : record ? "변경 저장" : "새 객체 추가"}
          </Button>
        </Stack>
      </Form>
    </Stack>
  );
}

type AdminEditorRoutePageProps = Omit<AdminEditorProps, "id" | "record">;

export function AdminEditorCreateRoutePage(props: AdminEditorRoutePageProps) {
  return <AdminEditor {...props} />;
}

export function AdminEditorModifyRoutePage(props: AdminEditorRoutePageProps) {
  const { id } = useParams<{ id: string }>();
  const recordId = Number(id);
  const { data } = useRetrieveQuery<AdminRecord>(props.app, props.resource, recordId);
  return <AdminEditor {...props} id={recordId} record={data} />;
}
