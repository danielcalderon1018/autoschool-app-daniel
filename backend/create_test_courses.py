#!/usr/bin/env python
import os
import django
from decimal import Decimal

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'autoschool.settings')
django.setup()

from academy.models import Course

# Create sample courses
courses_data = [
    {
        'name': 'Conducción Avanzada',
        'description': 'Curso de conducción avanzada para pilotos experimentados',
        'duration_hours': 40,
        'price': Decimal('599.99'),
        'level': 'advanced',
        'is_active': True,
    },
    {
        'name': 'Conducción Básica',
        'description': 'Curso introductorio a la conducción segura',
        'duration_hours': 20,
        'price': Decimal('199.99'),
        'level': 'basic',
        'is_active': True,
    },
    {
        'name': 'Conducción en Carretera',
        'description': 'Técnicas de conducción en carreteras de alto tráfico',
        'duration_hours': 30,
        'price': Decimal('349.99'),
        'level': 'intermediate',
        'is_active': True,
    },
    {
        'name': 'Manejo Defensivo',
        'description': 'Aprende a anticipar peligros y conducir defensivamente',
        'duration_hours': 25,
        'price': Decimal('279.99'),
        'level': 'intermediate',
        'is_active': True,
    },
]

# Clear existing courses
Course.objects.all().delete()

# Create courses
created_courses = []
for data in courses_data:
    course = Course.objects.create(**data)
    created_courses.append(course)
    print(f"✓ Creado: {course.name} ({course.level})")

print(f"\nTotal de cursos creados: {len(created_courses)}")
