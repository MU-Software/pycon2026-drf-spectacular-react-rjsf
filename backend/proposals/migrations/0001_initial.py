import django.db.models.deletion
from django.db import migrations, models


def seed_demo(apps, schema_editor):
    Room = apps.get_model("proposals", "Room")
    Reviewer = apps.get_model("proposals", "Reviewer")
    Proposal = apps.get_model("proposals", "Proposal")

    rooms = [
        Room.objects.create(name="그랜드볼룸", capacity=500),
        Room.objects.create(name="세미나룸 A", capacity=120),
        Room.objects.create(name="세미나룸 B", capacity=80),
    ]
    reviewers = [
        Reviewer.objects.create(name="김장고", specialty="Django · API"),
        Reviewer.objects.create(name="이리액트", specialty="React · Frontend"),
        Reviewer.objects.create(name="박데이터", specialty="Data · AI"),
    ]
    proposals = [
        Proposal.objects.create(
            title="Serializer 하나로 어드민까지",
            track="backend",
            description="## 발표 소개\n\nDRF serializer와 OpenAPI를 단일 진실 공급원으로 삼아 반복 작업을 줄이는 방법을 소개합니다.\n\n### 기대 효과\n\n- 실무에 적용할 아이디어를 얻습니다.",
            topics=["django", "openapi", "automation"],
            room=rooms[0],
            is_featured=True,
            status="accepted",
        ),
        Proposal.objects.create(
            title="React JSON Schema Form 실전 도입기",
            track="frontend",
            description="## 발표 소개\n\nOpenAPI schema를 RJSF 입력 폼으로 변환하고 커스텀 위젯을 더하는 과정을 함께 살펴봅니다.\n\n### 기대 효과\n\n- 실무에 적용할 아이디어를 얻습니다.",
            topics=["react", "openapi"],
            room=rooms[1],
        ),
        Proposal.objects.create(
            title="Pydantic에서 MCP 도구까지",
            track="data-ai",
            description="## 발표 소개\n\n동일한 스키마 중심 접근을 FastAPI와 MCP 서버로 확장할 때의 설계 포인트를 다룹니다.\n\n### 기대 효과\n\n- 실무에 적용할 아이디어를 얻습니다.",
            topics=["fastapi", "automation"],
            room=rooms[2],
        ),
    ]
    for proposal, reviewer in zip(proposals, reviewers, strict=True):
        proposal.reviewers.add(reviewer)


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Reviewer",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=60, verbose_name="리뷰어")),
                ("specialty", models.CharField(max_length=80, verbose_name="전문 분야")),
            ],
            options={
                "ordering": ["name"],
            },
        ),
        migrations.CreateModel(
            name="Room",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=80, verbose_name="장소명")),
                ("capacity", models.PositiveSmallIntegerField(verbose_name="수용 인원")),
            ],
            options={
                "ordering": ["name"],
            },
        ),
        migrations.CreateModel(
            name="Proposal",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("title", models.CharField(max_length=120, verbose_name="발표 제목")),
                (
                    "track",
                    models.CharField(
                        choices=[("backend", "백엔드"), ("frontend", "프론트엔드"), ("data-ai", "데이터 · AI"), ("devops", "DevOps")],
                        max_length=20,
                        verbose_name="트랙",
                    ),
                ),
                ("description", models.TextField(help_text="Markdown 문법으로 작성할 수 있습니다.", verbose_name="발표 설명")),
                ("topics", models.JSONField(default=list, verbose_name="주제")),
                ("is_featured", models.BooleanField(default=False, verbose_name="추천 발표")),
                (
                    "status",
                    models.CharField(
                        choices=[("draft", "검토 대기"), ("accepted", "승인"), ("rejected", "반려")],
                        default="draft",
                        max_length=20,
                        verbose_name="상태",
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True, verbose_name="등록일")),
                ("updated_at", models.DateTimeField(auto_now=True, verbose_name="수정일")),
                ("reviewers", models.ManyToManyField(blank=True, related_name="proposals", to="proposals.reviewer", verbose_name="리뷰어")),
                (
                    "room",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="proposals",
                        to="proposals.room",
                        verbose_name="발표장",
                    ),
                ),
            ],
            options={
                "ordering": ["-created_at"],
            },
        ),
        migrations.RunPython(seed_demo, migrations.RunPython.noop),
    ]
