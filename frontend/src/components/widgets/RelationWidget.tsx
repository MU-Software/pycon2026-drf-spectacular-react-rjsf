import { Autocomplete, TextField } from "@mui/material";
import type { WidgetProps } from "@rjsf/utils";

import type { Selectable } from "../../api";
import { useSelectablesQuery } from "../../hooks";

export default function RelationWidget(props: WidgetProps) {
  const app = String(props.options.choiceApp ?? "");
  const resource = String(props.options.choiceResource ?? "");
  const multiple = Boolean(props.options.multiple);
  const selectablesQuery = useSelectablesQuery(app, resource);
  const options = selectablesQuery.data;
  const values = Array.isArray(props.value) ? props.value : [];
  const selected = multiple
    ? options.filter((option) => values.includes(option.const))
    : options.find((option) => option.const === props.value) ?? null;

  return (
    <Autocomplete<Selectable, boolean>
      multiple={multiple}
      options={options}
      value={selected}
      disabled={props.disabled || props.readonly}
      getOptionLabel={(option) => option.title}
      isOptionEqualToValue={(option, value) => option.const === value.const}
      onChange={(_, value) =>
        props.onChange(Array.isArray(value) ? value.map((option) => option.const) : value?.const ?? null)
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label={props.label}
          required={props.required}
        />
      )}
    />
  );
}
