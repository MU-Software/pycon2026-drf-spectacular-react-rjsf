import type { RJSFSchema, UiSchema } from "@rjsf/utils";

export type AdminSchemaDefinition = {
  schema: RJSFSchema;
  ui_schema: UiSchema;
  translation_fields: string[];
};

const asSchema = (value: unknown) =>
  typeof value === "object" && value !== null ? value as RJSFSchema : null;

const filterProperties = (schema: RJSFSchema, readOnly: boolean): RJSFSchema => {
  const properties = Object.fromEntries(
    Object.entries(schema.properties ?? {})
      .filter(([, property]) => Boolean(asSchema(property)?.readOnly) === readOnly)
      .map(([name, property]) => {
        const propertySchema = asSchema(property);
        return [name, propertySchema ? filterProperties(propertySchema, readOnly) : property];
      }),
  );
  return {
    ...schema,
    properties,
    required: schema.required?.filter((name: string) => name in properties),
  };
};

export const formSchemaFromJsonSchema = ({ schema, ui_schema }: AdminSchemaDefinition) => ({
  schema: filterProperties(schema, false),
  readOnlySchema: filterProperties(schema, true),
  uiSchema: ui_schema,
});
