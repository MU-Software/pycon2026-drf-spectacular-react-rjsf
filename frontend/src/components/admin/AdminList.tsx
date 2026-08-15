import { Add, Delete, Edit } from "@mui/icons-material";
import {
  Alert,
  Button,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import type { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";

import type { AdminRecord } from "../../api";
import { useListQuery, useRemoveMutation } from "../../hooks";

export type AdminListColumn<T> = {
  field: keyof T & string;
  header: string;
  render?: (row: T) => ReactNode;
};

type AdminListProps<T extends AdminRecord> = {
  app: string;
  resource: string;
  title?: string;
  columns?: AdminListColumn<T>[];
};

export default function AdminList<T extends AdminRecord>({ app, resource, title, columns = [] }: AdminListProps<T>) {
  const navigate = useNavigate();
  const listQuery = useListQuery<T>(app, resource);
  const removeMutation = useRemoveMutation(app, resource);
  const basePath = `/${app}/${resource}`;
  const hasCustomColumns = columns.length > 0;

  const remove = (row: T) => {
    const label = hasCustomColumns ? String(row[columns[0].field] ?? row.id) : row.str_repr ?? String(row.id);
    if (!window.confirm(`“${label}” 항목을 삭제할까요?`)) return;
    removeMutation.mutate(row.id);
  };

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} gap={2}>
        <Typography variant="h4">{title ?? `${resource} 관리`}</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => navigate(`${basePath}/create`)}>새 객체 추가</Button>
      </Stack>

      {removeMutation.isError && <Alert severity="error">{removeMutation.error.message}</Alert>}

      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              {hasCustomColumns ? columns.map((column) => <TableCell key={column.field}>{column.header}</TableCell>) : (
                <>
                  <TableCell>ID</TableCell>
                  <TableCell>이름</TableCell>
                  <TableCell>등록자</TableCell>
                  <TableCell>수정 시간</TableCell>
                </>
              )}
              <TableCell align="right">작업</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listQuery.data.map((row) => (
              <TableRow key={row.id} hover>
                {hasCustomColumns ? columns.map((column) => (
                    <TableCell key={column.field}>
                      {column.render ? column.render(row) : String(row[column.field] ?? "")}
                    </TableCell>
                  )) : (
                    <>
                      <TableCell><Link to={`${basePath}/${row.id}`}>{row.id}</Link></TableCell>
                      <TableCell><Link to={`${basePath}/${row.id}`}>{row.str_repr}</Link></TableCell>
                      <TableCell>{row.created_by}</TableCell>
                      <TableCell>{row.updated_at ? new Date(row.updated_at).toLocaleString() : ""}</TableCell>
                    </>
                  )}
                <TableCell align="right">
                  <IconButton aria-label="수정" onClick={(event) => { event.stopPropagation(); navigate(`${basePath}/${row.id}`); }}>
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton
                    aria-label="삭제"
                    color="error"
                    disabled={removeMutation.isPending}
                    onClick={(event) => { event.stopPropagation(); remove(row); }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}
