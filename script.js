// ===== Selección de elementos del DOM =====
const videoElement = document.querySelector('.video_entrada'); // Video de la cámara
const canvasElement = document.querySelector('.canvas_salida'); // Canvas donde dibujamos
const canvasCtx = canvasElement.getContext('2d'); // Contexto 2D del canvas
const historialEl = document.getElementById("historial"); // Contenedor del historial de movimientos
const estadoEl = document.getElementById("estado"); // Contenedor para mostrar la instrucción actual

let historialMovimientos = []; 
let pasoActual = 0; 

// ===== Secuencia de movimientos a validar =====
const pasosValidacion = [
  {nombre: "Sube la cabeza", detect: (noseY) => noseY < 0.40}, 
  {nombre: "Baja la cabeza", detect: (noseY) => noseY > 0.75}, 
  {nombre: "Abre la boca", detect: (lipDistance) => lipDistance > 0.05}, 
  {nombre: "Mira a la derecha", detect: (noseX) => noseX > 0.60}, 
  {nombre: "Mira a la izquierda", detect: (noseX) => noseX < 0.30}, 
];

// ===== Función para agregar movimientos al historial =====
function agregarAlHistorial(texto) {
  historialMovimientos.push(texto); 
  const div = document.createElement("div"); 
  div.textContent = texto; // Texto del movimiento
  div.className = "movimiento";
  historialEl.appendChild(div);
  historialEl.scrollTop = historialEl.scrollHeight; 
}

// ===== Función para detectar si el usuario realizó el movimiento correcto =====
function detectarMovimiento(landmarks) {
  const nose = landmarks[1];       // Punta de la nariz
  const upperLip = landmarks[13];  // Labio superior
  const lowerLip = landmarks[14];  // Labio inferior

  const noseX = nose.x;
  const noseY = nose.y;
  const lipDistance = Math.abs(lowerLip.y - upperLip.y);

  const paso = pasosValidacion[pasoActual]; 

  if (!paso) return null;

  let detectado = false;

  // Dependiendo del tipo de movimiento, usamos la coordenada correcta
  if (paso.nombre.includes("cabeza")) detectado = paso.detect(noseY);
  else if (paso.nombre.includes("boca")) detectado = paso.detect(lipDistance);
  else if (paso.nombre.includes("derecha") || paso.nombre.includes("izquierda")) detectado = paso.detect(noseX);

  // Si se detecta el movimiento correcto
  if (detectado) {
    agregarAlHistorial(`${paso.nombre} ✅`); 
    pasoActual++; 
    if (pasoActual >= pasosValidacion.length) {
      estadoEl.textContent = "Validación completada. Cámara detenida.";
      videoElement.style.display = 'none';
      canvasElement.style.display = 'none';
      camara.stop(); 
    } else {
      estadoEl.textContent = `Ahora: ${pasosValidacion[pasoActual].nombre}`;
    }
  }

  return detectado ? paso.nombre : null; 
}

// ===== Función que se llama cada vez que MediaPipe devuelve resultados =====
function onResults(results) {

  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

  // Si se detecta al menos una cara
  if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
    const landmarks = results.multiFaceLandmarks[0]; // Tomar la primera cara

    // Calcular centro de la cara y un radio aproximado
    const nose = landmarks[1];
    const leftCheek = landmarks[234];  // Punto izquierdo
    const rightCheek = landmarks[454]; // Punto derecho

    const centerX = nose.x * canvasElement.width;
    const centerY = nose.y * canvasElement.height;
    const radius = Math.hypot(
      (leftCheek.x - rightCheek.x) * canvasElement.width,
      (leftCheek.y - rightCheek.y) * canvasElement.height
    ) / 2;

    // Dibujar un círculo verde alrededor de la cara
    canvasCtx.beginPath();
    canvasCtx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    canvasCtx.strokeStyle = "#00ff00";
    canvasCtx.lineWidth = 2;
    canvasCtx.stroke();

    if(pasoActual == 0){
      estadoEl.textContent = `Ahora: ${pasosValidacion[pasoActual].nombre}`;
    }

    detectarMovimiento(landmarks);
  }

  canvasCtx.restore();
}

// ===== Configuración de FaceMesh de MediaPipe =====
const faceMesh = new FaceMesh({
  locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
});

faceMesh.setOptions({
  maxNumFaces: 1,    
  refineLandmarks: true,     
  minDetectionConfidence: 0.8,
  minTrackingConfidence: 0.5
});

faceMesh.onResults(onResults);

// ===== Configuración de la cámara =====
const camara = new Camera(videoElement, {
  onFrame: async () => { 
    await faceMesh.send({image: videoElement});
  },
  width: 540,
  height: 380
});

estadoEl.textContent = "Buscando cara...";
camara.start(); 
