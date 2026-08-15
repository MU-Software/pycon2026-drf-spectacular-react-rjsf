import typing

from django.db.models.fields.related import ForeignKey, ManyToManyField
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.serializers import ManyRelatedField, MultipleChoiceField, PrimaryKeyRelatedField

from core.serializers import JsonSchemaSerializer


class JsonSchemaMixin:
    def __new__(cls, *args, **kwargs):
        if cls.serializer_class and not hasattr(cls.serializer_class, "get_json_schema"):
            raise TypeError(f"{cls.__name__} must use JsonSchemaSerializer.")
        return super().__new__(cls)

    def get_json_schema(self):
        serializer_class = typing.cast(type[JsonSchemaSerializer], self.get_serializer_class())
        ui_schema = {name: dict(hints) for name, hints in getattr(serializer_class.Meta, "ui_schema", {}).items()}
        result = {"schema": serializer_class.get_json_schema(), "ui_schema": ui_schema, "translation_fields": []}
        serializer_fields = serializer_class().fields
        model = getattr(serializer_class.Meta, "model", None)
        model_fields = {field.name: field for field in model._meta.get_fields()} if model else {}

        for name, field_schema in result["schema"].get("properties", {}).items():
            field = serializer_fields[name]
            model_field = model_fields.get(name)
            field_schema["title"] = field.label

            if isinstance(field, (ManyRelatedField, MultipleChoiceField)):
                field_schema["uniqueItems"] = True
            if isinstance(model_field, (ForeignKey, ManyToManyField)):
                options = {
                    "choiceApp": model_field.related_model._meta.app_label,
                    "choiceResource": model_field.related_model._meta.model_name,
                }
                if isinstance(model_field, ManyToManyField):
                    options["multiple"] = True
                result["ui_schema"].setdefault(name, {}).update({"ui:widget": "relation", "ui:options": options})
            if (choices := getattr(field, "choices", None)) and not isinstance(field, (ManyRelatedField, PrimaryKeyRelatedField)):
                choice_schema = field_schema.get("items", field_schema)
                choice_schema.pop("enum", None)
                choice_schema["oneOf"] = [{"const": value, "title": label} for value, label in choices.items()]

        return result

    @action(detail=False, methods=["get"], url_path="json-schema")
    def json_schema(self, request):
        return Response(self.get_json_schema())


class SelectablesMixin:
    @action(detail=False, methods=["get"])
    def selectables(self, request):
        return Response({"results": [{"const": row.pk, "title": str(row)} for row in self.get_queryset()]})
