from rest_framework.pagination import PageNumberPagination

class DiscussionPagination(PageNumberPagination):
    page_size = 10
    max_page_size = 30

class TenPerPagePagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'