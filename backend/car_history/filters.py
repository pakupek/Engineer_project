import django_filters
from .models import Discussion

class DiscussionFilter(django_filters.FilterSet):
    # filtrowanie po kategorii
    category = django_filters.CharFilter(field_name="category", lookup_expr="iexact")

    # filtrowanie po statusie (OPEN / CLOSED)
    status = django_filters.CharFilter(method="filter_status")

    # wyszukiwanie (title + content)
    search = django_filters.CharFilter(method="filter_search")

    class Meta:
        model = Discussion
        fields = ["category", "locked"]

    def filter_status(self, queryset, name, value):
        if value.upper() == "OPEN":
            return queryset.filter(locked=False)
        if value.upper() == "CLOSED":
            return queryset.filter(locked=True)
        return queryset

    def filter_search(self, queryset, name, value):
        return queryset.filter(
            title__icontains=value
        ) | queryset.filter(
            content__icontains=value
        )
