// ===== State =====
let img = new Image();
let originalAspect = 1;
let isLocked = true;
let currentMode = 'contain';
let bgColor = '#000000';
let zoomLevel = 100;
let currentPlatform = 'custom';
let originalFileSize = 0;

// ===== Platform Presets Data =====
const PLATFORM_PRESETS = {
  instagram: [
    { name: 'Historia', w: 1080, h: 1920 },
    { name: 'Cuadrado', w: 1080, h: 1080 },
    { name: 'Retrato', w: 1080, h: 1350 },
    { name: 'Paisaje', w: 1080, h: 566 },
  ],
  youtube: [
    { name: 'Miniatura', w: 1280, h: 720 },
    { name: 'Paisaje', w: 1920, h: 1080 },
    { name: 'Shorts', w: 1080, h: 1920 },
  ],
  facebook: [
    { name: 'Post', w: 1200, h: 628 },
    { name: 'Paisaje', w: 1280, h: 720 },
    { name: 'Retrato', w: 720, h: 1280 },
    { name: 'Historia', w: 720, h: 1280 },
  ],
  linkedin: [
    { name: 'Blog Post', w: 1200, h: 628 },
    { name: 'Post', w: 1920, h: 1920 },
    { name: 'Paisaje', w: 1920, h: 1080 },
    { name: 'Vertical', w: 1080, h: 1920 },
  ],
  snapchat: [
    { name: 'Historia', w: 1080, h: 1920 },
    { name: 'Estándar', w: 1080, h: 1920 },
  ],
  x: [
    { name: 'Post', w: 1200, h: 670 },
    { name: 'Paisaje', w: 1280, h: 720 },
    { name: 'Retrato', w: 720, h: 1280 },
    { name: 'Cuadrado', w: 1200, h: 1200 },
  ],
  pinterest: [
    { name: 'Pin', w: 735, h: 1102 },
    { name: 'Pines Estándar', w: 1080, h: 1620 },
    { name: 'Pin Cuadrado', w: 1080, h: 1080 },
    { name: 'Pin Vertical', w: 1080, h: 1920 },
  ],
  standard: [
    { name: '1:1', w: 1080, h: 1080 },
    { name: '16:9', w: 1920, h: 1080 },
    { name: '9:16', w: 1080, h: 1920 },
    { name: '4:5', w: 1080, h: 1350 },
    { name: '4:3', w: 1440, h: 1080 },
    { name: '3:2', w: 1620, h: 1080 },
  ],
  custom: [],
};

const PLATFORM_LABELS = {
  instagram: 'Instagram',
  youtube: 'YouTube',
  facebook: 'Facebook',
  linkedin: 'LinkedIn',
  snapchat: 'Snapchat',
  x: 'X (Twitter)',
  pinterest: 'Pinterest',
  standard: 'Estándar',
  custom: 'Personalizado',
};

// ===== DOM Elements =====
const uploadState = document.getElementById('upload-state');
const editorState = document.getElementById('editor-state');
const dropzone = document.getElementById('dropzone');
const fileIn = document.getElementById('fileIn');
const canvas = document.getElementById('preview-canvas');
const ctx = canvas.getContext('2d');

const widthInput = document.getElementById('width-input');
const heightInput = document.getElementById('height-input');

const lockBtn = document.getElementById('lock-btn');
const modeCards = document.querySelectorAll('.mode-card');
const radios = document.querySelectorAll('input[name="mode"]');
const bgInput = document.getElementById('bg-color');
const colorHex = document.getElementById('color-hex');
const exportBtn = document.getElementById('export-btn');
const resetBtn = document.getElementById('reset-btn');

const zoomSlider = document.getElementById('zoom-slider');
const zoomValue = document.getElementById('zoom-value');
const zoomInBtn = document.getElementById('zoom-in');
const zoomOutBtn = document.getElementById('zoom-out');
const zoomFit = document.getElementById('zoom-fit');

const canvasContainer = document.getElementById('canvas-container');

const originalSizeInfo = document.getElementById('original-size-info');
const newSizeInfo = document.getElementById('new-size-info');

const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');

// Quick Actions
const qaResetSize = document.getElementById('qa-reset-size');
const qaDouble = document.getElementById('qa-double');
const qaHalf = document.getElementById('qa-half');

// Dropdown
const platformDropdown = document.getElementById('platform-dropdown');
const dropdownTrigger = document.getElementById('dropdown-trigger');
const dropdownMenu = document.getElementById('dropdown-menu');
const dropdownLabel = document.getElementById('dropdown-label');
const dropdownItems = document.querySelectorAll('.dropdown-item');
const presetCardsGrid = document.getElementById('preset-cards-grid');

// ===== Utility Functions =====
function showToast(message, duration = 2500) {
  toastMessage.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(0) + ' KB';
  return (bytes / 1048576).toFixed(2) + ' MB';
}

function updateSizeInfo() {
  const w = parseInt(widthInput.value) || 0;
  const h = parseInt(heightInput.value) || 0;
  // Estimate new file size (rough PNG estimate: ~3 bytes per pixel with compression)
  const estimatedBytes = w * h * 3 * 0.5; // rough PNG compression factor
  newSizeInfo.textContent = formatBytes(estimatedBytes);
}

// ===== Custom Dropdown Logic =====
// Move menu to body so it escapes any transform-based containing blocks
document.body.appendChild(dropdownMenu);

let dropdownOpen = false;

function openDropdown() {
  const rect = dropdownTrigger.getBoundingClientRect();
  dropdownMenu.style.top = (rect.bottom + 6) + 'px';
  dropdownMenu.style.left = rect.left + 'px';
  dropdownMenu.style.width = rect.width + 'px';
  dropdownMenu.classList.add('dropdown-menu-open');
  platformDropdown.classList.add('open');
  dropdownOpen = true;
}

function closeDropdown() {
  dropdownMenu.classList.remove('dropdown-menu-open');
  platformDropdown.classList.remove('open');
  dropdownOpen = false;
}

dropdownTrigger.addEventListener('click', (e) => {
  e.stopPropagation();
  if (dropdownOpen) {
    closeDropdown();
  } else {
    openDropdown();
  }
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  if (dropdownOpen && !platformDropdown.contains(e.target) && !dropdownMenu.contains(e.target)) {
    closeDropdown();
  }
});

// Close on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && dropdownOpen) {
    closeDropdown();
  }
});

// Handle platform selection
dropdownItems.forEach(item => {
  item.addEventListener('click', () => {
    const platform = item.dataset.platform;
    selectPlatform(platform, item);
    closeDropdown();
  });
});

function selectPlatform(platform, clickedItem) {
  currentPlatform = platform;

  // Update label
  dropdownLabel.textContent = PLATFORM_LABELS[platform];

  // Update icon in trigger - clone the SVG from the clicked item
  const existingIcon = dropdownTrigger.querySelector('.dropdown-icon');
  const newIcon = clickedItem.querySelector('.platform-icon').cloneNode(true);
  newIcon.classList.remove('platform-icon');
  newIcon.classList.add('dropdown-icon');
  newIcon.style.width = '16px';
  newIcon.style.height = '16px';
  existingIcon.replaceWith(newIcon);

  // Update selected state in menu
  dropdownItems.forEach(di => di.classList.remove('selected'));
  clickedItem.classList.add('selected');

  // Render preset cards
  renderPresetCards(platform);
}

function renderPresetCards(platform) {
  const presets = PLATFORM_PRESETS[platform];
  presetCardsGrid.innerHTML = '';

  if (!presets || presets.length === 0) return;

  presets.forEach((preset, index) => {
    const card = document.createElement('div');
    card.className = 'preset-card';
    card.dataset.w = preset.w;
    card.dataset.h = preset.h;

    // Thumbnail canvas
    const thumbWrapper = document.createElement('div');
    thumbWrapper.className = 'preset-card-thumb';

    const thumbCanvas = document.createElement('canvas');
    drawThumbnail(thumbCanvas, preset.w, preset.h);
    thumbWrapper.appendChild(thumbCanvas);

    // Info
    const info = document.createElement('div');
    info.className = 'preset-card-info';

    const name = document.createElement('span');
    name.className = 'preset-card-name';
    name.textContent = preset.name;

    const size = document.createElement('span');
    size.className = 'preset-card-size';
    size.textContent = `${preset.w} × ${preset.h}`;

    info.appendChild(name);
    info.appendChild(size);

    card.appendChild(thumbWrapper);
    card.appendChild(info);

    // Click handler
    card.addEventListener('click', () => {
      // Deactivate all
      presetCardsGrid.querySelectorAll('.preset-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      // Apply dimensions
      widthInput.value = preset.w;
      heightInput.value = preset.h;
      originalAspect = preset.w / preset.h;
      updateSizeInfo();
      updateCanvas();
    });

    presetCardsGrid.appendChild(card);
  });
}

function drawThumbnail(thumbCanvas, w, h) {
  // Scale down to fit in a small thumbnail
  const maxThumbW = 72;
  const maxThumbH = 56;
  const scale = Math.min(maxThumbW / w, maxThumbH / h);
  const tW = Math.round(w * scale);
  const tH = Math.round(h * scale);

  thumbCanvas.width = tW;
  thumbCanvas.height = tH;

  const tCtx = thumbCanvas.getContext('2d');

  if (img.src && img.complete && img.naturalWidth > 0) {
    // Draw the actual image
    const imgAspect = img.width / img.height;
    const targetAspect = tW / tH;
    let dX = 0, dY = 0, dW = tW, dH = tH;

    // Cover mode for thumbnails
    if (imgAspect > targetAspect) {
      dH = tH;
      dW = tH * imgAspect;
      dX = (tW - dW) / 2;
    } else {
      dW = tW;
      dH = tW / imgAspect;
      dY = (tH - dH) / 2;
    }

    tCtx.drawImage(img, dX, dY, dW, dH);
  } else {
    // Placeholder gradient
    const gradient = tCtx.createLinearGradient(0, 0, tW, tH);
    gradient.addColorStop(0, '#1c2545');
    gradient.addColorStop(1, '#283660');
    tCtx.fillStyle = gradient;
    tCtx.fillRect(0, 0, tW, tH);
  }
}

// ===== File Upload =====
const handleFile = (file) => {
  if (!file || !file.type.startsWith('image/')) {
    showToast('Por favor, selecciona un archivo de imagen válido');
    return;
  }
  originalFileSize = file.size;
  const reader = new FileReader();
  reader.onload = (e) => {
    img.onload = () => {
      originalAspect = img.width / img.height;
      widthInput.value = img.width;
      heightInput.value = img.height;

      // Update info - show file size
      originalSizeInfo.textContent = formatBytes(originalFileSize);
      updateSizeInfo();

      // Transition to editor
      uploadState.classList.remove('active');
      editorState.classList.add('active');

      // Reset zoom
      zoomLevel = 100;
      zoomSlider.value = 100;
      zoomValue.textContent = '100%';
      canvasContainer.style.transform = 'scale(1)';

      // Reset platform selection
      currentPlatform = 'custom';
      dropdownLabel.textContent = 'Personalizado';
      dropdownItems.forEach(di => di.classList.remove('selected'));
      // Select "Personalizado" by default
      const customItem = document.querySelector('.dropdown-item[data-platform="custom"]');
      if (customItem) customItem.classList.add('selected');

      // Re-render preset cards if a platform was selected
      renderPresetCards(currentPlatform);

      updateCanvas();
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
};

dropzone.addEventListener('click', () => fileIn.click());
fileIn.addEventListener('change', (e) => handleFile(e.target.files[0]));
dropzone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropzone.classList.add('dragover');
});
dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
dropzone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropzone.classList.remove('dragover');
  if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
});

// ===== Dimension Controls =====
widthInput.addEventListener('input', () => {
  if (isLocked) heightInput.value = Math.round(widthInput.value / originalAspect);
  updateSizeInfo();
  updateCanvas();
});

heightInput.addEventListener('input', () => {
  if (isLocked) widthInput.value = Math.round(heightInput.value * originalAspect);
  updateSizeInfo();
  updateCanvas();
});

// Lock Button
lockBtn.addEventListener('click', () => {
  isLocked = !isLocked;
  lockBtn.classList.toggle('active', isLocked);
  if (isLocked) {
    originalAspect = widthInput.value / heightInput.value;
  }
});

// ===== Mode Cards =====
modeCards.forEach(card => {
  card.addEventListener('click', () => {
    modeCards.forEach(c => c.classList.remove('active'));
    card.classList.add('active');
  });
});

radios.forEach(radio => {
  radio.addEventListener('change', (e) => {
    currentMode = e.target.value;
    // Show/hide bg section based on mode
    const bgSection = document.getElementById('bg-section');
    if (currentMode === 'contain') {
      bgSection.style.display = '';
    } else {
      bgSection.style.display = 'none';
    }
    updateCanvas();
  });
});

// ===== Color Picker =====
bgInput.addEventListener('input', (e) => {
  bgColor = e.target.value;
  colorHex.textContent = bgColor.toUpperCase();
  updateCanvas();
});

// ===== Zoom Controls =====
function setZoom(level) {
  zoomLevel = Math.max(10, Math.min(200, level));
  zoomSlider.value = zoomLevel;
  zoomValue.textContent = `${Math.round(zoomLevel)}%`;
  canvasContainer.style.transform = `scale(${zoomLevel / 100})`;
}

function autoFitZoom() {
  const canvasArea = document.querySelector('.canvas-area');
  if (!canvasArea) return;
  const areaRect = canvasArea.getBoundingClientRect();
  const padding = 48; // px padding on each side
  const availableW = areaRect.width - padding * 2;
  const availableH = areaRect.height - padding * 2;
  const cW = parseInt(widthInput.value) || 100;
  const cH = parseInt(heightInput.value) || 100;

  if (cW <= availableW && cH <= availableH) {
    // Fits at 100%, use 100
    setZoom(100);
  } else {
    // Calculate scale to fit
    const scaleX = availableW / cW;
    const scaleY = availableH / cH;
    const fitScale = Math.min(scaleX, scaleY);
    setZoom(Math.round(fitScale * 100));
  }
}

zoomSlider.addEventListener('input', () => setZoom(parseInt(zoomSlider.value)));
zoomInBtn.addEventListener('click', () => setZoom(zoomLevel + 10));
zoomOutBtn.addEventListener('click', () => setZoom(zoomLevel - 10));
zoomFit.addEventListener('click', () => autoFitZoom());

// ===== Quick Actions =====
qaResetSize.addEventListener('click', () => {
  widthInput.value = img.width;
  heightInput.value = img.height;
  originalAspect = img.width / img.height;
  updateSizeInfo();
  updateCanvas();
  showToast('Tamaño original restaurado');
});

qaDouble.addEventListener('click', () => {
  widthInput.value = parseInt(widthInput.value) * 2;
  heightInput.value = parseInt(heightInput.value) * 2;
  updateSizeInfo();
  updateCanvas();
  showToast('Tamaño duplicado');
});

qaHalf.addEventListener('click', () => {
  widthInput.value = Math.max(1, Math.round(parseInt(widthInput.value) / 2));
  heightInput.value = Math.max(1, Math.round(parseInt(heightInput.value) / 2));
  updateSizeInfo();
  updateCanvas();
  showToast('Tamaño reducido a la mitad');
});

// ===== Reset / Cancel =====
resetBtn.addEventListener('click', () => {
  editorState.classList.remove('active');
  uploadState.classList.add('active');
  fileIn.value = '';
});

// ===== Export =====
exportBtn.addEventListener('click', async () => {
  const dataURL = canvas.toDataURL('image/png');
  const sizeText = `${widthInput.value}x${heightInput.value}`;
  const exportSpan = exportBtn.querySelector('span');

  if (window.electronAPI && window.electronAPI.saveImage) {
    const oldText = exportSpan.innerText;
    exportSpan.innerText = 'Guardando...';
    exportBtn.disabled = true;

    try {
      const result = await window.electronAPI.saveImage({ dataURL, desiredName: `freesize-${sizeText}.png` });
      if (result.success) {
        showToast('¡Imagen guardada exitosamente!');
      } else if (!result.canceled) {
        showToast('Error al guardar la imagen');
      }
    } finally {
      setTimeout(() => {
        exportSpan.innerText = oldText;
        exportBtn.disabled = false;
      }, 1000);
    }
  } else {
    // Web fallback
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = `freesize-${sizeText}.png`;
    a.click();
    showToast('¡Imagen descargada!');
  }
});

// ===== Keyboard Shortcuts =====
document.addEventListener('keydown', (e) => {
  // Only in editor mode
  if (!editorState.classList.contains('active')) return;

  // Don't capture shortcuts if dropdown is open
  if (platformDropdown.classList.contains('open')) return;

  if (e.ctrlKey && e.key === 's') {
    e.preventDefault();
    exportBtn.click();
  }
  if (e.key === 'Escape') {
    resetBtn.click();
  }
  if (e.ctrlKey && e.key === '0') {
    e.preventDefault();
    setZoom(100);
  }
  if (e.ctrlKey && e.key === '=') {
    e.preventDefault();
    setZoom(zoomLevel + 10);
  }
  if (e.ctrlKey && e.key === '-') {
    e.preventDefault();
    setZoom(zoomLevel - 10);
  }
});

// ===== Canvas Rendering =====
function updateCanvas() {
  const targetW = parseInt(widthInput.value) || 100;
  const targetH = parseInt(heightInput.value) || 100;

  canvas.width = targetW;
  canvas.height = targetH;

  ctx.clearRect(0, 0, targetW, targetH);

  if (currentMode === 'contain') {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, targetW, targetH);
  }

  const imgAspect = img.width / img.height;
  const targetAspect = targetW / targetH;

  let drawX = 0, drawY = 0, drawW = targetW, drawH = targetH;

  if (currentMode === 'contain') {
    if (imgAspect > targetAspect) {
      drawW = targetW;
      drawH = targetW / imgAspect;
      drawY = (targetH - drawH) / 2;
    } else {
      drawH = targetH;
      drawW = targetH * imgAspect;
      drawX = (targetW - drawW) / 2;
    }
  } else if (currentMode === 'cover') {
    if (imgAspect > targetAspect) {
      drawH = targetH;
      drawW = targetH * imgAspect;
      drawX = (targetW - drawW) / 2;
    } else {
      drawW = targetW;
      drawH = targetW / imgAspect;
      drawY = (targetH - drawH) / 2;
    }
  }

  ctx.drawImage(img, drawX, drawY, drawW, drawH);

  // Auto-fit zoom so the image is always fully visible
  autoFitZoom();

  // Also re-render thumbnails when canvas updates (if a platform is selected)
  if (currentPlatform !== 'custom') {
    refreshThumbnails();
  }
}

function refreshThumbnails() {
  const thumbCanvases = presetCardsGrid.querySelectorAll('.preset-card-thumb canvas');
  const presets = PLATFORM_PRESETS[currentPlatform] || [];
  thumbCanvases.forEach((tc, i) => {
    if (presets[i]) {
      drawThumbnail(tc, presets[i].w, presets[i].h);
    }
  });
}

