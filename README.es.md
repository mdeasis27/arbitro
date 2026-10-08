# Arbitro

<!-- community-badges -->
[![CI](https://github.com/mdeasis27/arbitro/actions/workflows/ci.yml/badge.svg)](https://github.com/mdeasis27/arbitro/actions/workflows/ci.yml) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
<!-- /community-badges -->

[English](README.md) · [Probar demo](https://arbitro-manueldeasis27-2515s-projects.vercel.app/es/app) · [Caso de estudio](https://manueldeasis.com/es/projects/arbitro) · [Código](https://github.com/mdeasis27/arbitro)

![Interfaz interactiva local real](docs/images/cover.png)

Introduce etiquetas y confianza de candidatos y cambia el umbral de escalamiento.

## Dos situaciones para comparar

**Consenso:** Tres votos de aprobar con confianza 0.90, 0.80, 0.70; umbral 0.60. Boletas alineadas se resuelven localmente.

![Consenso](docs/images/scenario-a.es.png)

**Desacuerdo:** Aprobar / denegar / revisión con 0.90 / 0.55 / 0.55; umbral 0.80. Boletas divergentes se escalan a revisión.

![Desacuerdo](docs/images/scenario-b.es.png)

## Caso de uso de negocio

Recomendaciones candidatas pueden discrepar sin una resolución automática segura.

**Quién lo usa:** Operador de decisiones que atiende casos ambiguos.

**La decisión:** Resolver un caso localmente o enviarlo a revisión humana.

Elige consenso o desacuerdo, inspecciona boletas locales y etiquetas de confianza, y resuelve o escala el caso.

### Prueba la decisión

**Consenso:** Tres votos de aprobar con confianza 0.90, 0.80, 0.70; umbral 0.60. Boletas alineadas se resuelven localmente.

**Desacuerdo:** Aprobar / denegar / revisión con 0.90 / 0.55 / 0.55; umbral 0.80. Boletas divergentes se escalan a revisión.

Elige un escenario, modifica sus controles y ejecuta el cálculo local. Avanza por la visualización paso a paso o revela todo. Reinicia antes de comparar el segundo escenario.

## Cómo probarlo

Abre `/en/app` (inglés, por defecto) o `/es/app` (español). Cambia los datos del escenario y ejecuta el cálculo. Inspecciona la decisión, evidencia y traza calculada. La reproducción revela pasos locales ya completados; no mide un modelo en vivo. Reiniciar empieza un escenario local nuevo. Cambiar de idioma reinicia el escenario; la interfaz muestra un aviso de reinicio.

La demo principal no requiere cuenta, clave de API ni base de datos. Los enlaces públicos apuntan al despliegue existente; el rediseño local está pendiente de publicación.

## Instalación y verificación local

Requiere Node.js 22 y pnpm 10.

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm test
node node_modules/typescript/bin/tsc --noEmit --incremental false
pnpm lint
pnpm build
```

Abre `http://localhost:3000/en/app`. La validación registrada cubre pruebas, lint, TypeScript y builds de producción. Consulta los [resultados de comandos](docs/quality/decision-lab-verification.json) y las [comprobaciones de componentes en navegador](docs/quality/decision-lab-browser.json). Estas pruebas usan componentes React y CSS de producción con navegación de idioma controlada; no certifican rutas de Next ni el despliegue público.

## Arquitectura

- `app/[lang]/`: experiencia web por idioma.
- `lib/experience/`: adaptador local tipado, validación y trazas.
- `design-system/`: tokens visuales, controles de idioma y presentación de ejecución y reproducción.
- `app/api/`: integraciones opcionales de servidor; la demo principal no las requiere.

Tecnología: Next.js 16, TypeScript, Python, Vitest, pytest, Tailwind CSS v4.

## Evidencia y límites

Boletas candidatas convergen en un nodo de arbitraje y una rama de revisión.

Distribuciones de votos y ramas de revisión; la confianza suministrada no es probabilidad calibrada.

Muestra por qué un desacuerdo ambiguo se escala en vez de ocultarse tras una sola respuesta.

**Límites:** Las etiquetas de confianza son valores de escenario y no probabilidades calibradas. Estos prototipos de portafolio no afirman impacto medido en producción.

Los datos son ejemplos ficticios o anónimos. Las integraciones opcionales requieren sus propias credenciales y configuración. Los secretos pertenecen al gestor configurado, nunca a archivos locales de secretos ni Git. Usa el flujo existente `infisical run -- <command>` si necesitas integraciones en vivo. La demo local no publica ni despliega automáticamente.

![Captura real de la demo en español](docs/images/demo.es.png)

<!-- community-section -->
## Licencia y contribución

Publicado bajo la [licencia MIT](LICENSE). Se aceptan issues y pull requests: lee antes [CONTRIBUTING.md](CONTRIBUTING.md) y el [Código de Conducta](CODE_OF_CONDUCT.md). Para reportar una vulnerabilidad, consulta [SECURITY.md](SECURITY.md).
<!-- /community-section -->
