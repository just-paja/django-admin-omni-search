from django.db.models import Model, CharField


class Unsearchable(Model):
    name = CharField(max_length=255)
