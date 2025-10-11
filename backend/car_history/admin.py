from django.contrib import admin
from .models import User, Vehicle, VehicleModel, VehicleGeneration, VehicleMake

class UserAdmin(admin.ModelAdmin):
  list_display = ("username", "email", "joined_date")

admin.site.register(User, UserAdmin)
# Inline do wyświetlania modeli w kontekście marki
class VehicleModelInline(admin.TabularInline):
    model = VehicleModel
    extra = 1

# Inline do wyświetlania generacji w kontekście modelu
class VehicleGenerationInline(admin.TabularInline):
    model = VehicleGeneration
    extra = 1

@admin.register(VehicleMake)
class VehicleMakeAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)
    inlines = [VehicleModelInline]

@admin.register(VehicleModel)
class VehicleModelAdmin(admin.ModelAdmin):
    list_display = ('name', 'make')
    list_filter = ('make',)
    search_fields = ('name', 'make__name')
    inlines = [VehicleGenerationInline]

@admin.register(VehicleGeneration)
class VehicleGenerationAdmin(admin.ModelAdmin):
    list_display = ('name', 'model', 'production_start', 'production_end')
    list_filter = ('model', 'model__make')
    search_fields = ('name', 'model__name', 'model__make__name')
