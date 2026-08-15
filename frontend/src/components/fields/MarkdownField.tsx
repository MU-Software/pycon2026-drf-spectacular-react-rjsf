import { Card, CardContent, Stack, TextField, Typography } from "@mui/material";
import type { FieldProps } from "@rjsf/utils";
import ReactMarkdown from "react-markdown";

export default function MarkdownField(props: FieldProps) {
  const value = typeof props.formData === "string" ? props.formData : "";

  return (
    <Stack spacing={2}>
      <TextField
        id={props.idSchema.$id}
        label={props.schema.title}
        value={value}
        onChange={(event) => props.onChange(event.target.value)}
        disabled={props.disabled || props.readonly}
        required={props.required}
        multiline
        minRows={10}
        fullWidth
      />
      <Typography variant="h6">미리보기</Typography>
      <Card variant="outlined">
        <CardContent><ReactMarkdown>{value}</ReactMarkdown></CardContent>
      </Card>
    </Stack>
  );
}
