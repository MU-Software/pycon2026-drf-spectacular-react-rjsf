from django.db import models


class Room(models.Model):
    name = models.CharField("장소명", max_length=80)
    capacity = models.PositiveSmallIntegerField("수용 인원")

    class Meta:
        ordering = ["name"]

    def __str__(self) -> str:
        return f"{self.name} ({self.capacity}석)"


class Reviewer(models.Model):
    name = models.CharField("리뷰어", max_length=60)
    specialty = models.CharField("전문 분야", max_length=80)

    class Meta:
        ordering = ["name"]

    def __str__(self) -> str:
        return f"{self.name} · {self.specialty}"


class Proposal(models.Model):
    class Track(models.TextChoices):
        BACKEND = "backend", "백엔드"
        FRONTEND = "frontend", "프론트엔드"
        DATA_AI = "data-ai", "데이터 · AI"
        DEVOPS = "devops", "DevOps"

    class Status(models.TextChoices):
        DRAFT = "draft", "검토 대기"
        ACCEPTED = "accepted", "승인"
        REJECTED = "rejected", "반려"

    class Topic(models.TextChoices):
        DJANGO = "django", "Django"
        FASTAPI = "fastapi", "FastAPI"
        REACT = "react", "React"
        OPENAPI = "openapi", "OpenAPI"
        AUTOMATION = "automation", "자동화"

    title = models.CharField("발표 제목", max_length=120)
    track = models.CharField("트랙", max_length=20, choices=Track.choices)
    description = models.TextField("발표 설명", help_text="Markdown 문법으로 작성할 수 있습니다.")
    topics = models.JSONField("주제", default=list)
    room = models.ForeignKey(Room, verbose_name="발표장", null=True, blank=True, related_name="proposals", on_delete=models.SET_NULL)
    reviewers = models.ManyToManyField(Reviewer, verbose_name="리뷰어", related_name="proposals", blank=True)
    is_featured = models.BooleanField("추천 발표", default=False)
    status = models.CharField("상태", max_length=20, choices=Status.choices, default=Status.DRAFT)

    created_at = models.DateTimeField("등록일", auto_now_add=True)
    updated_at = models.DateTimeField("수정일", auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return self.title
