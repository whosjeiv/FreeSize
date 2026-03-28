# ⚡ FreeSize

**FreeSize** es la herramienta de escritorio definitiva para redimensionar y adaptar tus imágenes a cualquier red social en segundos. Diseñada con una interfaz moderna, limpia y altamente profesional, te permite preparar tu contenido visual para múltiples plataformas sin complicaciones, de manera rápida, local y sin perder la calidad de tu trabajo original.

![FreeSize Demo](https://via.placeholder.com/800x450.png?text=FreeSize+-+Redimensiona+Tus+Im%C3%A1genes+Como+Un+Pro)

## ✨ Características Principales

- 🎨 **Diseño Premium y Moderno**: Una interfaz oscura ("Deep Dark") estilizada, con acentos neón y glassmorphism, diseñada por y para creadores que necesitan velocidad y claridad visual.
- 📱 **Presets Integrados de Redes Sociales**: Modifica tus creatividades al instante con nuestras resoluciones predefinidas y siempre actualizadas para:
  - **Instagram** (Historias, Cuadrado, Retrato, Paisaje)
  - **YouTube** (Miniaturas, Shorts)
  - **Facebook & LinkedIn** (Post, Paisaje, Vertical)
  - **Snapchat, X (Twitter), Pinterest** y una variedad de **Formatos Estándar (16:9, 4:3, etc)**.
- 🖼️ **Ajuste Inteligente**: Decide rápidamente si quieres que tu foto cubra completamente el lienzo (*Rellenar*) o que se contenga dentro de los márgenes (*Ajustar*), pudiendo seleccionar el color de fondo exacto con selector HEX.
- 🔍 **Zoom Dinámico y Auto-ajuste**: No importa si exportas en formato gigante o miniatura, nuestro zoom auto-ajustable calcula matemáticamente la escala para que siempre visualices tu trabajo completo en tu espacio de trabajo.
- 🚀 **Procesamiento de Alta Velocidad**: Al ser una app local potenciada por el motor V8 y HTML5 Canvas API, no necesitas conectarte a internet ni esperar pesadas subidas a la nube. Privacidad total y procesamiento instantáneo.
- ⌨️ **Flujo de Trabajo para Power-Users (Atajos de Teclado)**:
  - `Ctrl + S`: Guardar y exportar.
  - `Esc`: Cerrar y volver al inicio.
  - `Ctrl + 0`: Resetear zoom (o autoajustar).
  - `Ctrl + (+/-)`: Control de escala fino.

## 🛠️ Stack Tecnológico

- **Frontend Core**: HTML5 Semántico, CSS3 moderno (con variables reactivas CSS y animaciones fluidas), Vanilla JavaScript.
- **Procesamiento Gráfico**: Canvas API nativa.
- **Integración Desktop**: Electron.js, encargándose del control del sistema de archivos nativo, bordes ocultos y experiencia de aplicación de escritorio real.
- **Entorno de Desarrollo**: Vite, para el HMR (Hot Module Replacement) más rápido posible.

## 🚀 Cómo empezar a usarlo

### Prerrequisitos
- Node.js (versión LTS recomendada)
- Un gestor de paquetes (`npm` estándar de node, o `yarn` o `pnpm`)

### Instalación en tu equipo

1. **Clona este repositorio**:
   ```bash
   git clone https://github.com/whosjeiv/FreeSize.git
   cd FreeSize
   ```

2. **Instala las dependencias principales**:
   ```bash
   npm install
   ```

3. **Inicia la aplicación en modo desarrollo**:
   ```bash
   npm start
   ```
   *(Esto levantará Vite y abrirá la ventana principal de Electron simultáneamente)*

4. **Para empaquetar tu propio ejecutable (.exe / .dmg / .AppImage)**:
   ```bash
   npm run build
   ```

---
💎 *Construido para hacerte ahorrar las incontables horas perdidas redimensionando la misma imagen para distintas redes. Disfruta la velocidad de FreeSize.*
