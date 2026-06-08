from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Student, Instructor, Vehicle, Course, Enrollment, Lesson
from .serializers import (
    StudentSerializer, StudentPictureSerializer, InstructorSerializer, VehicleSerializer,
    CourseSerializer, EnrollmentSerializer, LessonSerializer
)

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    search_fields = ['first_name', 'last_name', 'email']
    ordering_fields = ['created_at', 'first_name', 'last_name']

    @action(detail=True, methods=['post'], url_path='upload-picture',
            parser_classes=[MultiPartParser, FormParser])
    def upload_picture(self, request, pk=None):
        student = self.get_object()

        incoming_file = request.FILES.get('profile_picture')
        if not incoming_file:
            return Response(
                {'detail': 'Debes enviar el archivo profile_picture.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = StudentPictureSerializer(
            student,
            data={'profile_picture': incoming_file},
            partial=True,
            context={'request': request},
        )
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()

        student.refresh_from_db()
        response_data = StudentSerializer(student, context={'request': request}).data
        return Response(response_data, status=status.HTTP_200_OK)

class InstructorViewSet(viewsets.ModelViewSet):
    queryset = Instructor.objects.all()
    serializer_class = InstructorSerializer
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['first_name', 'last_name', 'email']
    ordering_fields = ['created_at', 'first_name', 'last_name']

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['level', 'is_active']
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'duration_hours', 'created_at']
    ordering = ['-created_at']

class VehicleViewSet(viewsets.ModelViewSet):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['vehicle_type', 'is_available']
    search_fields = ['plate', 'brand', 'model']
    ordering_fields = ['created_at', 'plate']

class EnrollmentViewSet(viewsets.ModelViewSet):
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['status', 'student', 'course']
    ordering_fields = ['enrolled_at', 'status']

class LessonViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['status', 'enrollment', 'instructor']
    ordering_fields = ['scheduled_at', 'status']
