from rest_framework.pagination import PageNumberPagination

class DiscussionPagination(PageNumberPagination):
    page_size = 20
    max_page_size = 100

class TenPerPagePagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'