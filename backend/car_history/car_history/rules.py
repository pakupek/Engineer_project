import rules

# Sprawdza, czy użytkownik jest właścicielem pojazdu
@rules.predicate
def is_vehicle_owner(user, vehicle):
    return user.role == 'owner' and vehicle.owner == user

# Sprawdza, czy użytkownik jest serwisem
@rules.predicate
def is_service(user):
    return user.role == 'service'

# Sprawdza, czy użytkownik może przeglądać pojazd
@rules.predicate
def can_view_vehicle(user, vehicle):
    return user.role in ['owner', 'service', 'buyer']

# Rejestracja reguł
rules.add_perm('vehicles.edit_vehicle', is_vehicle_owner)
rules.add_perm('vehicles.add_service_entry', is_service)
rules.add_perm('vehicles.view_vehicle', can_view_vehicle)
