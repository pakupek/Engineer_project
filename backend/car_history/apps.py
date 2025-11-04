from django.apps import AppConfig


class CarHistoryConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'car_history'

    def ready(self):
        import car_history.signals