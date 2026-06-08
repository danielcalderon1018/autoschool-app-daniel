"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { coursesService } from "@/services/courses.service";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, CheckCircle2, Trash2, Edit2 } from "lucide-react";

const courseSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().optional(),
  duration_hours: z.coerce.number().min(1, "La duración debe ser mayor a 0"),
  price: z.coerce.number().min(0, "El precio no puede ser negativo"),
  level: z.enum(["basic", "intermediate", "advanced"]),
  is_active: z.boolean().default(true),
});

const LEVEL_OPTIONS = [
  { value: "basic", label: "Básico" },
  { value: "intermediate", label: "Intermedio" },
  { value: "advanced", label: "Avanzado" },
];

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      level: "basic",
      is_active: true,
    },
  });

  const level = watch("level");
  const is_active = watch("is_active");

  const loadCourses = async () => {
    try {
      setIsLoading(true);
      const data = await coursesService.getCourses();
      setCourses(data);
    } catch {
      setError("Error al cargar los cursos. Verifica la conexión con el servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const onSubmit = async (data) => {
    try {
      setError("");
      setSuccess("");
      
      if (editingId) {
        await coursesService.updateCourse(editingId, data);
        setSuccess("Curso actualizado exitosamente");
        setEditingId(null);
      } else {
        await coursesService.createCourse(data);
        setSuccess("Curso creado exitosamente");
      }
      
      reset();
      loadCourses();
    } catch (err) {
      setError(err.response?.data?.detail || "Error al guardar el curso");
    }
  };

  const handleEdit = (course) => {
    setEditingId(course.id);
    setValue("name", course.name);
    setValue("description", course.description);
    setValue("duration_hours", course.duration_hours);
    setValue("price", course.price);
    setValue("level", course.level);
    setValue("is_active", course.is_active);
  };

  const handleDelete = async (id) => {
    try {
      setError("");
      await coursesService.deleteCourse(id);
      setSuccess("Curso eliminado exitosamente");
      setDeleteConfirm(null);
      loadCourses();
    } catch (err) {
      setError(err.response?.data?.detail || "Error al eliminar el curso");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    reset();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gestión de Cursos</h1>
        <p className="text-gray-600 mt-2">Administra los cursos disponibles en la plataforma</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "Editar Curso" : "Crear Nuevo Curso"}</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-4 border-green-200 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Éxito</AlertTitle>
              <AlertDescription className="text-green-700">{success}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del Curso *</Label>
                <Input
                  id="name"
                  placeholder="Ej: Conducción Avanzada"
                  {...register("name")}
                  disabled={isSubmitting}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="level">Nivel *</Label>
                <Select value={level} onValueChange={(value) => setValue("level", value)}>
                  <SelectTrigger id="level">
                    <SelectValue placeholder="Selecciona un nivel" />
                  </SelectTrigger>
                  <SelectContent>
                    {LEVEL_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                placeholder="Describe el contenido del curso"
                {...register("description")}
                rows={3}
                disabled={isSubmitting}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration_hours">Duración (horas) *</Label>
                <Input
                  id="duration_hours"
                  type="number"
                  placeholder="Ej: 40"
                  {...register("duration_hours")}
                  disabled={isSubmitting}
                />
                {errors.duration_hours && (
                  <p className="text-sm text-red-500">{errors.duration_hours.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Precio ($) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  placeholder="Ej: 199.99"
                  {...register("price")}
                  disabled={isSubmitting}
                />
                {errors.price && (
                  <p className="text-sm text-red-500">{errors.price.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register("is_active")}
                  disabled={isSubmitting}
                  className="rounded"
                />
                Curso Activo
              </Label>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Guardando..." : editingId ? "Actualizar" : "Crear Curso"}
              </Button>
              {editingId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Listado de Cursos</CardTitle>
          <CardDescription>
            Total: {courses.length} {courses.length === 1 ? "curso" : "cursos"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center py-4 text-gray-500">Cargando cursos...</p>
          ) : courses.length === 0 ? (
            <p className="text-center py-4 text-gray-500">No hay cursos registrados</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Nivel</TableHead>
                    <TableHead>Duración (h)</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell className="font-medium">{course.name}</TableCell>
                      <TableCell>
                        <span className="capitalize">
                          {LEVEL_OPTIONS.find((l) => l.value === course.level)?.label}
                        </span>
                      </TableCell>
                      <TableCell>{course.duration_hours}</TableCell>
                      <TableCell>${parseFloat(course.price).toFixed(2)}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded text-sm font-medium ${
                            course.is_active
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {course.is_active ? "Activo" : "Inactivo"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(course)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setDeleteConfirm(course.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Confirmar Eliminación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>¿Estás seguro de que deseas eliminar este curso? Esta acción no se puede deshacer.</p>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setDeleteConfirm(null)}
                >
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(deleteConfirm)}
                >
                  Eliminar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
