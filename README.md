
# Validación de Liveness y Movimientos Faciales

Este proyecto tiene como objetivo **validar que una persona está presente físicamente frente a la cámara** (liveness detection) y que realiza una **secuencia de movimientos específicos de rostro**, con fines de autenticación o interacción controlada.

Actualmente, el flujo consiste en:

1. Detectar la cara de la persona.
2. Mostrar un círculo alrededor de la cara y seguimiento (landmarks principales). 
3. Solicitar una secuencia de movimientos faciales:

   * Mirar hacia arriba
   * Mirar hacia abajo
   * Abrir la boca
   * Mirar a la derecha
   * Mirar a la izquierda
4. Registrar cada movimiento en un **historial visible** en la pantalla.
5. Una vez que se completan todos los movimientos, se **detiene la cámara automáticamente**.


## 3. Tecnologías utilizadas

* **HTML / CSS / JavaScript:** para la interfaz y lógica de captura.
* **MediaPipe FaceMesh (Google):** para la detección y seguimiento de landmarks faciales en tiempo real.
* **Canvas API:** para dibujar la cara y los puntos de interés en tiempo real.


## 4. Funcionalidades actuales

| Función                          | Descripción                                                                                                                          |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| **Detección de rostro**          | Detecta la cara de la persona en tiempo real usando MediaPipe FaceMesh.                                                              |
| **Landmarks faciales**           | Extrae hasta 468 puntos clave de la cara (nariz, ojos, labios, mejillas, mandíbula).                                                 |
| **Círculo de referencia**        | Dibuja un círculo verde alrededor de la cara como guía visual.                                                                       |
| **Validación de movimientos**    | Se verifica que la persona haga los movimientos solicitados en orden: mirar arriba, abajo, abrir la boca, mirar derecha e izquierda. |
| **Historial de movimientos**     | Cada movimiento validado se registra en un historial que se muestra en la interfaz.                                                  |
| **Apagado automático de cámara** | Una vez completada la secuencia, la cámara se detiene.                                                                               |


## 5. Detalles técnicos de MediaPipe FaceMesh

FaceMesh es una librería de **Google MediaPipe** que permite **detectar y seguir landmarks faciales en tiempo real** con alta precisión.

* Detecta hasta **468 puntos clave** de la cara.
* Proporciona coordenadas **normalizadas** `(x, y, z)` entre 0 y 1 para cada landmark.
* Permite **refinar puntos alrededor de ojos y labios** para gestos más finos.
* Compatible con **navegadores web** usando JavaScript y WebAssembly.

