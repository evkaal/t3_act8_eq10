# Sistema de Gestión de Banco de Sangre
**Institución:** Instituto Tecnológico de Oaxaca (ITO)  
**Proyecto:**  Banco de sangre  
**Materia/Módulo:**  Programación Web  
**Integrantes del Equipo:**
*   Jimenez Mendoza Eduardo
*   Hernández Uvera Azael  

**Profesor:** Martinez Nieto Adelina  
**Grupo:** 7SD  

---

## Descripción del Proyecto
Este proyecto consiste en el desarrollo de un sistema web para la gestión de un banco de sangre. Su objetivo es facilitar el control de donaciones, registro de donantes y administración de información relacionada con los tipos sanguíneos.

---

## Tecnologías Utilizadas

- React
- Vite
- ESLint
- HMR (Hot Module Replacement)

---

## Configuración del Proyecto

Este proyecto utiliza una plantilla base de **React + Vite**, la cual proporciona una configuración mínima funcional.

### Plugins disponibles:

- `@vitejs/plugin-react` → Usa Oxc
- `@vitejs/plugin-react-swc` → Usa SWC

---

## Compilador de React

El compilador de React no está habilitado por defecto debido a su impacto en el rendimiento en desarrollo. Puede integrarse manualmente si se requiere.

---

## Configuración de ESLint

El proyecto incluye reglas básicas de ESLint.

Para entornos más robustos se recomienda:
- Usar TypeScript
- Integrar `typescript-eslint`

---

## Integración de APIs

Para simular funcionalidades reales del sistema (como autenticación y datos de donaciones), se utilizan APIs públicas.

### Autenticación de Usuarios

**Endpoint:**
```
POST https://dummyjson.com/auth/login
```

**Body de ejemplo:**
```json
{
  "username": "emilys",
  "password": "emilyspass"
}
```

Usuarios de prueba:
https://dummyjson.com/users

La respuesta incluye datos del usuario como nombre, email, imagen y tokens.

---

###  Datos de Donaciones de Sangre

**Endpoint:**
```
GET https://api.data.gov.my/data-catalogue?id=blood_donations&limit=10
```

Este endpoint permite obtener datos reales de donaciones de sangre para pruebas y visualización.

