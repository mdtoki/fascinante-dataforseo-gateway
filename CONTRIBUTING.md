# 🤝 Guía de Contribución

¡Gracias por tu interés en contribuir al DataForSEO API Gateway PRO ELITE! 

## 🚀 Cómo Contribuir

### 1. **Fork y Clone**
```bash
# Fork el repositorio en GitHub
git clone https://github.com/tu-usuario/fascinante-dataforseo-gateway.git
cd fascinante-dataforseo-gateway
```

### 2. **Configurar el Entorno**
```bash
# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp env.local.example .env.local
# Editar .env.local con tus credenciales
```

### 3. **Crear Feature Branch**
```bash
git checkout -b feature/nueva-funcionalidad
# o
git checkout -b fix/correccion-bug
```

### 4. **Desarrollar**
- Sigue las convenciones de código existentes
- Añade tests para nuevas funcionalidades
- Actualiza la documentación si es necesario
- Asegúrate de que todos los tests pasen

### 5. **Testing**
```bash
# Ejecutar tests
pnpm test

# Verificar tipos
pnpm type-check

# Linting
pnpm lint

# Build
pnpm build
```

### 6. **Commit y Push**
```bash
git add .
git commit -m "feat: añadir nueva funcionalidad X"
git push origin feature/nueva-funcionalidad
```

### 7. **Crear Pull Request**
- Ve a GitHub y crea un Pull Request
- Describe claramente los cambios
- Menciona cualquier issue relacionado

## 📋 Convenciones

### **Commits**
Usa [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` nueva funcionalidad
- `fix:` corrección de bug
- `docs:` cambios en documentación
- `style:` formato, espacios, etc.
- `refactor:` refactoring de código
- `test:` añadir o modificar tests
- `chore:` tareas de mantenimiento

### **Código**
- **TypeScript**: Usa tipos estrictos
- **ESLint**: Sigue las reglas configuradas
- **Prettier**: Formato automático
- **Naming**: camelCase para variables, PascalCase para componentes

### **Estructura de Archivos**
```
app/
├── api/           # API routes
├── globals.css    # Estilos globales
├── layout.tsx     # Layout principal
└── page.tsx       # Página principal

lib/
├── auth.ts        # Autenticación
├── cache.ts       # Sistema de cache
├── analytics.ts   # Analytics
└── utils.ts       # Utilidades
```

## 🧪 Testing

### **Tipos de Tests**
- **Unit tests**: Funciones individuales
- **Integration tests**: APIs y endpoints
- **E2E tests**: Flujos completos

### **Ejecutar Tests**
```bash
# Todos los tests
pnpm test

# Tests específicos
pnpm test -- --grep "auth"

# Coverage
pnpm test:coverage
```

## 📚 Documentación

### **Actualizar Documentación**
- README.md para cambios principales
- Comentarios en código para funciones complejas
- OpenAPI docs se generan automáticamente

### **Ejemplos de Uso**
Añade ejemplos en:
- README.md
- Comentarios en código
- Archivos de ejemplo en `/examples`

## 🐛 Reportar Bugs

### **Template de Bug Report**
```markdown
## 🐛 Descripción del Bug
Descripción clara del problema.

## 🔄 Pasos para Reproducir
1. Ve a '...'
2. Haz click en '...'
3. Scroll hasta '...'
4. Ve el error

## 🎯 Comportamiento Esperado
Qué debería pasar.

## 📸 Screenshots
Si aplica, añade screenshots.

## 🖥️ Entorno
- OS: [e.g. macOS, Windows, Linux]
- Browser: [e.g. Chrome, Safari]
- Version: [e.g. 22]

## 📋 Información Adicional
Cualquier otra información relevante.
```

## ✨ Sugerir Features

### **Template de Feature Request**
```markdown
## 🚀 Descripción de la Feature
Descripción clara de la funcionalidad deseada.

## 💡 Motivación
Por qué esta feature sería útil.

## 📋 Descripción Detallada
Cómo debería funcionar.

## 🎯 Casos de Uso
Ejemplos específicos de uso.

## 📋 Consideraciones Adicionales
Cualquier consideración técnica o de diseño.
```

## 🏷️ Labels

Usamos estas labels:
- `bug`: Algo no funciona
- `enhancement`: Nueva funcionalidad
- `documentation`: Mejoras en docs
- `good first issue`: Bueno para principiantes
- `help wanted`: Necesita ayuda extra
- `priority: high`: Alta prioridad
- `priority: low`: Baja prioridad

## 📞 Contacto

- **Email**: info@fascinantedigital.com
- **GitHub**: [@alexanderovie](https://github.com/alexanderovie)
- **Website**: [fascinantedigital.com](https://fascinantedigital.com)

## 🙏 Reconocimientos

¡Gracias a todos los contribuidores que hacen este proyecto posible!

---

**¡Gracias por contribuir! 🎉**
