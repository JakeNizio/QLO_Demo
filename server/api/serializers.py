from django.contrib.auth.models import User
from rest_framework import serializers

# User serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User # Django User model
        fields = ["id", "username", "password"] # Fields to serialize
        extra_kwargs = {"password": {"write_only": True}} # Password is write only

    # Create a user with validated data
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user