# Smart Drum Glove - 3D Web Studio

Wearable MIDI drum controller using an ESP32 + 4 flex sensors + MPU6050 with a real-time 3D spatial hand visualization, responsive drum triggers, and low-latency WebSocket telemetry.

---

## Architecture Overview

```
                      +-----------------------------+
                      |   ESP32 Smart Drum Glove    |
                      | 4 Flex Sensors (0-4095 ADC) |
                      |    MPU6050 6-DoF IMU        |
                      +--------------+--------------+
                                     |
                       USB Serial / WiFi UDP (5005/5006)
                                     v
+------------------------------------+------------------------------------+
| Python Backend (server.py)                                              |
| - GloveWorker (rh_worker & lh_worker)                                  |
| - SerialReader / UdpReader                                              |
| - MidiEngine (mido + python-rtmidi GM Ch 10)                           |
| - GestureEngine & CalibrationManager                                    |
| - FastAPI + Uvicorn WebSocket Bridge (ws://localhost:8765/ws)          |
| - Thread-safe Qt Signal -> Asyncio Queue Event Loop                     |
+------------------------------------+------------------------------------+
                                     |
                         WebSocket JSON Stream
                                     v
+------------------------------------+------------------------------------+
| Frontend Dashboard (frontend/)                                          |
| - React 18 + Vite + TypeScript + TailwindCSS                            |
| - React Three Fiber (R3F) & Three.js 3D Hand Component                  |
| - Real-time finger bending lerp (f1..f4 -> index..pinky)                |
| - IMU Complementary Filter (alpha = 0.98) for roll/pitch/yaw            |
| - Amber (#ffb46b) emissive flash on drum hit events                     |
| - 14-button reactive drum pad grid & MIDI control                       |
| - Live engine settings sliders & auto-scrolling activity log            |
+-------------------------------------------------------------------------+
```

---

## Prerequisites

- **Python 3.10+** (tested on 3.12)
- **Node.js 18+** & **npm** (tested on Node v20)
- Virtual MIDI loopback device (e.g. `snd-virmidi` on Linux, `loopMIDI` on Windows, or standard DAW input)

---

## Installation

### 1. Python Backend Dependencies

```bash
# In the project root (drum-first)
source venv/bin/activate    # or: python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
```

### 2. Frontend Dependencies

```bash
cd frontend
npm install
npm run build              # builds static bundle into frontend/dist
cd ..
```

---

## Running the Application

### Option A: Development Mode (Hot Reloading Frontend + Backend)

**Terminal 1 — Run Python WebSocket Server:**
```bash
source venv/bin/activate
python server.py
```
> Server runs on `http://localhost:8765` and `ws://localhost:8765/ws`.

**Terminal 2 — Run Frontend Dev Server:**
```bash
cd frontend
npm run dev
```
> Open your browser at **`http://localhost:5173`**.

---

### Option B: Unified Production Mode (FastAPI serves both Web App and WebSocket)

If `frontend/dist` is built (`npm run build` inside `frontend/`):
```bash
source venv/bin/activate
python server.py
```
> Open your browser directly at **`http://localhost:8765`**. FastAPI automatically serves the SPA and bridges the WebSocket!

---

## Hardware & Firmware Setup

1. Open Arduino IDE and install the **esp32 by Espressif** board package.
2. Open `esp32/glove/last-glove.ino`.
3. Select **ESP32 Dev Module** and upload.
4. Pinout:
   - **FLEX 1 (Index)**: GPIO34
   - **FLEX 2 (Middle)**: GPIO35
   - **FLEX 3 (Ring)**: GPIO32
   - **FLEX 4 (Pinky)**: GPIO33
   - **MPU6050 (I2C)**: SDA = GPIO21, SCL = GPIO22 (Address 0x68)
5. Sensor CSV Format @ 115200 baud / UDP:
   `F1,F2,F3,F4,AX,AY,AZ,GX,GY,GZ`

---

## Using the Dashboard

1. **Glove Connection (Left Column)**:
   - Select **RH (Right)** or **LH (Left)** glove.
   - Choose **USB Serial** (pick port from dropdown) or **Wireless UDP** (port 5005 for RH, 5006 for LH).
   - Click **Connect**.
2. **MIDI Setup (Right Column)**:
   - In **MIDI Engine Output**, pick your virtual MIDI or DAW port and click **Open**.
3. **Calibration**:
   - Hold your hand flat, open, and still.
   - Click **CALIBRATE** and wait for 100% completion.
   - Click **SUGGEST** to automatically populate recommended flex thresholds.
4. **Live 3D Hand (Center Column)**:
   - Move your hand and bend your fingers to see the 3D model mirror your movement in real time.
   - Use your mouse to rotate (drag), zoom (scroll), and pan (right-click).
   - When a drum hit fires or test note is triggered, the hand emits an amber flash for 150ms.
5. **Testing Drum Hits**:
   - Click any of the 14 pads on the right grid (Kick, Snare, Hi-Hat, etc.) to trigger test notes.
