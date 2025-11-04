from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Message, VehicleSaleStats

@receiver(post_save, sender=Message)
def update_message_count(sender, instance, created, **kwargs):
    if not created:
        return

    if instance.sale:
        stats, _ = VehicleSaleStats.objects.get_or_create(sale=instance.sale)
        stats.messages_sent += 1
        stats.save()
