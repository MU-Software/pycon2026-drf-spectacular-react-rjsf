import typing

from openapi_schema_to_json_schema import to_json_schema
from rest_framework import serializers
from rest_framework.schemas.openapi import AutoSchema


class JsonSchema(typing.TypedDict):
    type: str
    properties: dict[str, dict[str, typing.Any]]
    required: list[str]


class JsonSchemaSerializer:
    @classmethod
    def get_json_schema(cls: type[serializers.Serializer]) -> JsonSchema:
        return to_json_schema(
            schema=AutoSchema().map_serializer(cls()),
            options={"keepNotSupported": ["readOnly", "writeOnly"]},
        )
