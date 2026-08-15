from core.views import JsonSchemaMixin, SelectablesMixin
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet

from .models import Proposal, Reviewer, Room
from .serializers import ProposalSerializer, ReviewerSerializer, RoomSerializer


class RoomViewSet(JsonSchemaMixin, SelectablesMixin, ReadOnlyModelViewSet):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer


class ReviewerViewSet(JsonSchemaMixin, SelectablesMixin, ReadOnlyModelViewSet):
    queryset = Reviewer.objects.all()
    serializer_class = ReviewerSerializer


class ProposalViewSet(JsonSchemaMixin, ModelViewSet):
    queryset = Proposal.objects.select_related("room").prefetch_related("reviewers")
    serializer_class = ProposalSerializer
    http_method_names = ["get", "post", "patch", "delete", "head", "options"]
