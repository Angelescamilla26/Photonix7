# Photonix 7 — Hiperdeportivo Eléctrico 🔋⚡

> **Un hipercar eléctrico de tres ruedas nacido en Pénjamo, Guanajuato.**  
> Desarrollado por estudiantes de Ingeniería Mecatrónica y Automotriz de la Universidad Politécnica de Pénjamo.

---

## 🚗 ¿Qué es Photonix 7?

Photonix 7 es un vehículo hiperdeportivo eléctrico de tres ruedas diseñado y construido íntegramente por un equipo de 10 estudiantes universitarios. El nombre sintetiza tres fuerzas: la **P** de Pénjamo, el **fotón** como unidad de energía limpia, y el sufijo **ix** que honra las raíces del equipo. El **7** representa la unión del equipo.

El proyecto participa en la competición **E-Challenge Gto 2025 / Electratón — Modalidad 2**.

---

## 📋 Especificaciones técnicas

| Parámetro | Valor |
|---|---|
| Motor | QS 273 V3 40H (Hub motor) |
| Potencia nominal | 8,000 W |
| Potencia máxima | 12,000 W |
| Torque máximo | 250 N·m |
| Voltaje | 72 V |
| Eficiencia | 91% |
| Controlador | Sabvoton MQ 100A (FOC) |
| Batería | LiFePO₄ 51.2V · 1 kWh |
| Velocidad máxima (5T) | 80 km/h |
| Aceleración 0–100 km/h | 3.2 s *(simulación con lastre 81.6 kg)* |
| Configuración | 3 ruedas — 2 delanteras, 1 trasera |
| Largo × Ancho × Alto | 2110 × 732 × 1040 mm |
| Chasis | Acero inoxidable / galvanizado calibre 18/40, triangulado |

---

## 🔒 Seguridad

- Barra antivuelco triangulada
- Jaulas frontales, laterales y superiores
- Cinturón de 5 puntos con liberación instantánea
- Línea de vida Iropa · casco bajo estructura
- Evacuación < 20 segundos
- Kill switch doble (cabina / exterior)

---

## 🖥️ Estructura del proyecto web

```
Photonix7/
├── index.html            # Landing page principal
├── tienda.html           # Tienda oficial de merchandising
├── login.html            # Autenticación (login + registro)
├── dashboard.html        # Panel de usuario
├── nosotros.html         # Sobre el equipo
├── vehiculo.html         # Detalle técnico del vehículo
├── terminos.html         # Términos y condiciones
│
├── css/
│   ├── styles.css        # Estilos globales
│   ├── loader.css        # Animación de carga
│   ├── login.css         # Estilos del login
│   ├── tienda.css        # Estilos de la tienda
│   ├── index.html-extras.css
│   └── index.html-improvements.css
│
├── js/
│   ├── main.js           # Lógica principal (scroll, counters, parallax)
│   ├── menu.js           # Menú fullscreen
│   ├── loader.js         # Pantalla de carga
│   ├── login.js          # Lógica de autenticación
│   └── tienda.js         # Carrito y productos
│
├── img/                  # Imágenes del vehículo y galería
│   ├── gallery/
│   ├── logos/            # Logotipos de patrocinadores
│   └── banners/          # Banners de la tienda
│
├── vid/                  # Archivos de video
├── models/               # Modelos 3D
└── Photonix7/            # (Carpeta de recursos adicionales)
```

---

## 🛠️ Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | HTML5, CSS3, JavaScript (vanilla) |
| Backend / Plantillas | Laravel (Blade templates) |
| Fuentes | Google Fonts — Inter |
| Iconos | Font Awesome 6.5 |
| Video | YouTube embed |
| Pagos | Mercado Pago *(en integración)* |

---

## 🚀 Cómo correr el proyecto

### Opción A — Modo estático (sólo frontend)
Abre directamente `index.html` en tu navegador.  
> ⚠️ Las directivas `@csrf`, `{{ }}` y `@foreach` de Blade **no funcionarán** sin un servidor Laravel activo.

### Opción B — Con Laravel (modo completo)

```bash
# 1. Clonar el repositorio
git clone https://github.com/Angelescamilla26/Photonix7.git
cd Photonix7

# 2. Instalar dependencias PHP
composer install

# 3. Copiar y configurar .env
cp .env.example .env
php artisan key:generate

# 4. Migrar la base de datos
php artisan migrate

# 5. Iniciar el servidor de desarrollo
php artisan serve
```

Luego abre [http://localhost:8000](http://localhost:8000) en tu navegador.

---

## 🤝 Patrocinadores

Gracias a las más de **15 empresas locales** que hicieron posible este proyecto:

Hacienda Corralejo · La Caldera · Multico · Turbomáquinas · Carnicería Sánchez · Carnicería Los Juanes · Invernaderos el Rosal · PEMEX Arias · Recicla.lo · Sigma Alimentos · Grúas Sálias · Ferretería El Agricultor · Refaccionaria Carrillo · Flow Music · Sunsteel · y más.

---

## 👥 Equipo

Proyecto desarrollado por **10 estudiantes** de Ingeniería Mecatrónica y Automotriz de la **Universidad Politécnica de Pénjamo**, Guanajuato, México.

---

## 📄 Licencia

© 2025 Photonix 7 — Universidad Politécnica de Pénjamo. Todos los derechos reservados.

---

<p align="center">
  <strong>hecho con orgullo local · Pénjamo, Guanajuato 🇲🇽</strong>
</p>