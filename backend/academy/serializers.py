from rest_framework import serializers
from .models import Student, Instructor, Vehicle, Course, Enrollment, Lesson

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'

class StudentPictureSerializer(serializers.ModelSerializer):
    def validate_profile_picture(self, value):
        allowed_types = ['image/jpeg', 'image/png']
        max_size = 2 * 1024 * 1024  # 2 MB

        if value.content_type not in allowed_types:
            raise serializers.ValidationError(
                'Solo se permiten imágenes JPEG o PNG.'
            )
        if value.size > max_size:
            raise serializers.ValidationError(
                'El archivo debe ser menor a 2 MB.'
            )
        return value

    class Meta:
        model = Student
        fields = ['profile_picture']

class InstructorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Instructor
        fields = '__all__'

class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = '__all__'

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'

    def validate_name(self, value):
        if not value or value.strip() == '':
            raise serializers.ValidationError('El nombre del curso no puede estar vacío.')
        return value

    def validate_duration_hours(self, value):
        if value <= 0:
            raise serializers.ValidationError('La duración debe ser mayor a 0 horas.')
        return value

    def validate_price(self, value):
        if value < 0:
            raise serializers.ValidationError('El precio no puede ser negativo.')
        return value

class EnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = '__all__'

class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = '__all__'
