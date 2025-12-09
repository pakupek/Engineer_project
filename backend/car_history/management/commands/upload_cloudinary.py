from django.core.management.base import BaseCommand
from django.conf import settings
import cloudinary.uploader
import os

class Command(BaseCommand):
    help = 'Upload existing media files to Cloudinary'

    def handle(self, *args, **options):
        media_root = os.path.join(settings.BASE_DIR, 'media')
        
        for root, dirs, files in os.walk(media_root):
            for file in files:
                file_path = os.path.join(root, file)
                relative_path = os.path.relpath(file_path, media_root)
                
                self.stdout.write(f"Uploading: {relative_path}")
                
                try:
                    result = cloudinary.uploader.upload(
                        file_path,
                        public_id=relative_path.replace('\\', '/'),
                        resource_type='auto'
                    )
                    self.stdout.write(self.style.SUCCESS(f"Uploaded: {result['url']}"))
                except Exception as e:
                    self.stdout.write(self.style.ERROR(f"Error: {str(e)}"))