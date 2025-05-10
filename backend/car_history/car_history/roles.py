from rolepermissions.roles import AbstractUserRole

class Owner(AbstractUserRole):
    available_permissions = {
        'edit_vehicle': True,
        'add_service_entry': True,
        'view_vehicle': True,
    }

class Service(AbstractUserRole):
    available_permissions = {
        'add_service_entry': True,
        'view_vehicle': True,
    }

class Buyer(AbstractUserRole):
    available_permissions = {
        'view_vehicle': True,
    }
