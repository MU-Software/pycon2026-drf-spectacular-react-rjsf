from core.serializers import JsonSchemaSerializer
from rest_framework import serializers

from .models import Proposal, Reviewer, Room


class ProposalSerializer(JsonSchemaSerializer, serializers.ModelSerializer):
    str_repr = serializers.CharField(source="__str__", read_only=True)
    created_by = serializers.CharField(read_only=True, default="demo")
    topics = serializers.MultipleChoiceField(label="주제", choices=Proposal.Topic.choices, required=False)

    class Meta:
        model = Proposal
        fields = [
            "id",
            "str_repr",
            "created_by",
            "title",
            "track",
            "description",
            "topics",
            "room",
            "reviewers",
            "is_featured",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "str_repr", "created_by", "status", "created_at", "updated_at"]
        extra_kwargs = {"description": {"min_length": 20}}
        ui_schema = {
            "title": {"ui:autofocus": True},
            "track": {"ui:widget": "radio"},
            "description": {"ui:field": "markdown"},
            "topics": {"ui:widget": "checkboxes"},
        }

    def validate_topics(self, value):
        return list(value)


class RoomSerializer(JsonSchemaSerializer, serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ["id", "name", "capacity"]


class ReviewerSerializer(JsonSchemaSerializer, serializers.ModelSerializer):
    class Meta:
        model = Reviewer
        fields = ["id", "name", "specialty"]
