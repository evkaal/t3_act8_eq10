# Sistema de Gestión de Biblioteca (Actividad 8)

Aplicación web desarrollada en **React + Vite** que permite consultar un catálogo de libros mediante una API de terceros de solo lectura, implementando un sistema local basado en **localStorage** para cubrir el flujo completo de un CRUD de préstamos (Crear, Leer, Actualizar y Borrar).

## Integrantes del Equipo
* **Integrante 1:** Garcia Cisneros Jonathan Julian 
* **Integrante 2:** Jiménez Mendoza Eduardo
* **Equipo:** EQ10

## API de Terceros Utilizada
Para la obtención de los datos del catálogo de libros, la aplicación consume la siguiente API:
* **API Elegida:** Open Library API (o especifica aquí el nombre exacto de la API que utilizaron en tu servicio `booksService.js`).
* **Uso:** Consulta pública de libros, filtrado por género/disponibilidad y paginación en tiempo real.

##  Despliegue en el VPS
Puedes acceder a la versión en producción desplegada en nuestro servidor virtual privado (VPS) a través del siguiente enlace:
* **Link del proyecto desplegado:** [http://tu-ip-o-dominio.com](http://tu-ip-o-dominio.com)

---

## Tecnologías y Características
* **React 18** con enrutamiento (`react-router-dom`).
* **Icons:** `lucide-react`.
* **Persistencia Local:** Uso de `localStorage` para simular la gestión de préstamos (Creación, Edición de notas, Listado y Devolución) debido a las restricciones de la API externa de solo lectura.
* **Estilos:** Diseño responsivo adaptado para la gestión bibliotecaria.