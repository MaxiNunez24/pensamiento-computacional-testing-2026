# 🎬 Guión + checklist — Videos de setup de Git y GitHub (por SO)

> Videos complementarios de la clase de **Git y GitHub**. Se graban **dos**: uno en **Windows 11** y
> uno en **Linux**. Cubren la parte **OS-específica** (instalar + configurar + autenticarse), que en la
> clase presencial se ve por arriba. Objetivo: que los alumnos lleguen al miércoles con Git instalado
> y sepan conectar con GitHub. Van a la carpeta de la clase grabada.

---

## ✅ Antes de grabar (checklist de grabación)

- [ ] **OBS**: escena de captura de pantalla (webcam en una esquina, opcional). Probar **micrófono**.
- [ ] **Legibilidad**: subir el tamaño de fuente de la terminal **y** del editor (que se lea en un
      celu). Zoom del navegador ~125–150 %.
- [ ] **Entorno limpio**: para el tramo de **instalación** necesitás una máquina/VM **sin Git**.
  - Windows: si la notebook ya tiene Git (de la clase de hoy), usá una **VM limpia** de Win11, u otra
    máquina, o desinstalá y reinstalá. Si no, mostrá el instalador aclarando *"esto es lo que ven la
    primera vez"*.
  - Linux: una VM/container limpio (`docker run -it ubuntu bash`) o, si ya lo tenés, corré igual el
    `apt install` (te dirá que ya está) y aclarás *"si no lo tenés, este comando lo instala"*.
- [ ] **Privacidad**: cerrá notificaciones. **No muestres tu PAT/token en pantalla** ni datos privados.
      Usá un **repo de prueba** (borrable) y, si querés, una cuenta/email de demo.
- [ ] **A mano**: cuenta de GitHub logueada (o para crear en vivo) y el link `git-scm.com`.
- [ ] **Formato**: cortito y por pasos (que puedan pausar y seguir). Ideal 5–10 min cada uno.

---

## 🪟 Guión — Windows 11

1. **Instalar Git** → [git-scm.com/download/win](https://git-scm.com/download/win). Ejecutar el
   instalador, "Siguiente" hasta el final (mencionar que trae **Git Bash** y el **Git Credential
   Manager**).
2. **Verificar**: abrir **Git Bash** (o PowerShell) → `git --version`.
3. **Configurar (una sola vez)**:
   ```bash
   git config --global user.name "Tu Nombre"
   git config --global user.email "tu@email.com"
   git config --global init.defaultBranch main
   git config --list        # verificar
   ```
4. **Repo local desde cero**: crear una carpeta, entrar, y:
   ```bash
   git init
   # crear un archivo (ej. hola.py) con algo adentro
   git status
   git add hola.py
   git commit -m "Primer commit"
   git log --oneline
   ```
5. **GitHub**: crear la cuenta (o mostrar login) → botón **New repository** → nombre, **Public**, **sin**
   README → **Create**.
6. **Conectar y subir**:
   ```bash
   git remote add origin https://github.com/tu-usuario/tu-repo.git
   git push -u origin main
   ```
7. **⭐ El momento clave — autenticación**: se abre una **ventana del navegador** (Git Credential
   Manager) para iniciar sesión en GitHub → **Authorize**. Mostrar que **queda guardado**: un segundo
   `git push` ya **no** pide nada.
8. **Cierre**: refrescar la página del repo en GitHub y ver el código subido. 🎉

---

## 🐧 Guión — Linux (Debian/Ubuntu)

Mismos pasos que Windows, con estas diferencias:

1. **Instalar**:
   ```bash
   sudo apt update && sudo apt install git
   ```
2. **Verificar / configurar / repo local**: **idéntico** a Windows (pasos 2 a 6 de arriba). Los
   comandos de Git son los mismos en todos los sistemas.
7. **⭐ Autenticación en Linux** (acá cambia): no hay una ventana emergente como en Windows. La forma
   simple y estándar hoy:
   - Crear un **Personal Access Token (PAT)** en GitHub → **Settings → Developer settings → Personal
     access tokens → Tokens (classic) → Generate new token**, tildando **`repo`**. (No mostrar el token
     en cámara.)
   - Al hacer `git push`, en **Username** poné tu usuario y en **Password** pegás el **PAT**.
   - Para que no lo pida cada vez: `git config --global credential.helper store` (lo guarda) o
     `cache` (lo recuerda un rato). *(Mencionar que existe el Git Credential Manager también para
     Linux, pero con el PAT + `store` alcanza para el curso.)*
8. **Cierre**: igual — ver el repo en GitHub con el código.

---

## 🧠 No te olvides (errores comunes que conviene mostrar/nombrar)

- La **contraseña de GitHub NO sirve** para `push` (desde 2021): es token/credencial. Es el tropiezo #1.
- Si `git push -u origin main` falla con *"src refspec main does not match"*: la rama local no se llama
  `main` (quedó `master`). Se arregla con `git branch -M main` o el `init.defaultBranch main` de arriba.
- `git remote add origin ...` una sola vez; si te equivocaste, `git remote set-url origin ...`.
- Recordar el **`.gitignore`** (aunque sea, nombrarlo): no subir tokens, `.env`, `__pycache__/`.
- Cerrar el video invitándolos a **subir su carpeta del curso** antes del miércoles.
