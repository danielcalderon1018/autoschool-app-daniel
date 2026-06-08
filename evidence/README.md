# Evidence for Activity: Carga de archivos

This folder contains the required evidences for the activity "Carga de archivos y captura de foto de perfil".

Included files:
- `actividad_modulo_cursos.docx` — original activity brief (copied from Downloads).

What I did:
- Copied the activity document into this `evidence/` folder.
- Documented what to submit to Moodle.

How to verify locally:
1. Start the backend:

```powershell
cd backend
.\venv\Scripts\python.exe manage.py runserver
```

2. Start the frontend:

```bash
cd frontend
npm run dev
```

3. Swagger UI with the API schema:

- Open `http://127.0.0.1:8000/api/docs/` and find the `/api/courses/` endpoint.

4. Frontend pages to capture:
- `http://localhost:3000/dashboard/courses` (list and form).

Notes:
- If the `actividad_modulo_cursos.docx` file is not the expected version, replace it with the correct file and keep the same filename.

---

Delivered by your assistant.