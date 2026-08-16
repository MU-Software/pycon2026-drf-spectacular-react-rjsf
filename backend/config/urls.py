from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView
from proposals.views import ProposalViewSet, ReviewerViewSet, RoomViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register("proposal", ProposalViewSet, basename="proposal")
router.register("room", RoomViewSet, basename="room")
router.register("reviewer", ReviewerViewSet, basename="reviewer")

urlpatterns = [
    path("api/admin/proposals/", include(router.urls)),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/schema/swagger-ui/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
]
