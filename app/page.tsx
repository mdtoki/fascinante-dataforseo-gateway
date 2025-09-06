import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Fascinante Digital
              </h1>
              <span className="ml-3 rounded-full bg-primary-100 px-2 py-1 text-xs font-medium text-primary-800">
                API Gateway
              </span>
            </div>
            <nav className="hidden space-x-8 md:flex">
              <Link
                href="/api/docs"
                className="text-gray-500 hover:text-gray-900"
              >
                Documentación
              </Link>
              <Link
                href="/api/health"
                className="text-gray-500 hover:text-gray-900"
              >
                Estado
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
              DataForSEO API Gateway
            </h2>
            <p className="mx-auto mt-3 max-w-md text-base text-gray-500 sm:text-lg md:mt-5 md:max-w-3xl md:text-xl">
              API Gateway PRO ELITE para DataForSEO con Next.js 15. Acceso
              escalable y seguro a herramientas de SEO y análisis de datos.
            </p>
            <div className="mx-auto mt-5 max-w-md sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Link
                  href="/api/docs"
                  className="flex w-full items-center justify-center rounded-md border border-transparent bg-primary-600 px-8 py-3 text-base font-medium text-white hover:bg-primary-700 md:px-10 md:py-4 md:text-lg"
                >
                  Ver Documentación
                </Link>
              </div>
              <div className="mt-3 rounded-md shadow sm:ml-3 sm:mt-0">
                <Link
                  href="/api/health"
                  className="flex w-full items-center justify-center rounded-md border border-transparent bg-white px-8 py-3 text-base font-medium text-primary-600 hover:bg-gray-50 md:px-10 md:py-4 md:text-lg"
                >
                  Estado del Sistema
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-gray-900">
              Características PRO ELITE
            </h3>
            <p className="mt-4 text-lg text-gray-500">
              Todo lo que necesitas para un análisis SEO profesional
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="card">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary-500 text-white">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">
                    Alta Performance
                  </h4>
                  <p className="text-gray-500">
                    Rate limiting inteligente y caching optimizado para máxima
                    velocidad.
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary-500 text-white">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">
                    Seguridad Avanzada
                  </h4>
                  <p className="text-gray-500">
                    Autenticación JWT y validación de API keys con monitoreo en
                    tiempo real.
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary-500 text-white">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">
                    Analytics Detallados
                  </h4>
                  <p className="text-gray-500">
                    Métricas completas de uso, costos y rendimiento para
                    optimización.
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary-500 text-white">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">
                    IA Integrada
                  </h4>
                  <p className="text-gray-500">
                    Acceso directo a ChatGPT, Claude, Gemini y otros modelos de
                    IA.
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary-500 text-white">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">
                    Análisis SERP
                  </h4>
                  <p className="text-gray-500">
                    Análisis completo de resultados de búsqueda en Google, Bing
                    y Yahoo.
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary-500 text-white">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">
                    Backlinks & Links
                  </h4>
                  <p className="text-gray-500">
                    Análisis completo de backlinks, dominios de referencia y
                    autoridad.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* API Endpoints Preview */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-gray-900">
              Endpoints Disponibles
            </h3>
            <p className="mt-4 text-lg text-gray-500">
              Acceso completo a todas las funcionalidades de DataForSEO
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg bg-white p-6 shadow">
              <h4 className="mb-2 text-lg font-medium text-gray-900">
                SERP Analysis
              </h4>
              <p className="mb-4 text-sm text-gray-500">
                Análisis de resultados de búsqueda
              </p>
              <code className="rounded bg-gray-100 px-2 py-1 text-xs">
                POST /v3/serp/google/organic/live/advanced
              </code>
            </div>

            <div className="rounded-lg bg-white p-6 shadow">
              <h4 className="mb-2 text-lg font-medium text-gray-900">
                AI Content
              </h4>
              <p className="mb-4 text-sm text-gray-500">
                Generación de contenido con IA
              </p>
              <code className="rounded bg-gray-100 px-2 py-1 text-xs">
                POST /v3/ai_optimization/chat_gpt/llm_responses/live
              </code>
            </div>

            <div className="rounded-lg bg-white p-6 shadow">
              <h4 className="mb-2 text-lg font-medium text-gray-900">
                Keyword Research
              </h4>
              <p className="mb-4 text-sm text-gray-500">
                Investigación de palabras clave
              </p>
              <code className="rounded bg-gray-100 px-2 py-1 text-xs">
                POST /v3/keywords_data/google_ads/search_volume/live
              </code>
            </div>

            <div className="rounded-lg bg-white p-6 shadow">
              <h4 className="mb-2 text-lg font-medium text-gray-900">
                Keyword Ideas
              </h4>
              <p className="mb-4 text-sm text-gray-500">
                Ideas de palabras clave
              </p>
              <code className="rounded bg-gray-100 px-2 py-1 text-xs">
                POST /v3/dataforseo_labs/google/keyword_ideas/live
              </code>
            </div>

            <div className="rounded-lg bg-white p-6 shadow">
              <h4 className="mb-2 text-lg font-medium text-gray-900">
                Backlinks
              </h4>
              <p className="mb-4 text-sm text-gray-500">
                Análisis de backlinks
              </p>
              <code className="rounded bg-gray-100 px-2 py-1 text-xs">
                POST /v3/backlinks/summary/live
              </code>
            </div>

            <div className="rounded-lg bg-white p-6 shadow">
              <h4 className="mb-2 text-lg font-medium text-gray-900">
                Domain Analysis
              </h4>
              <p className="mb-4 text-sm text-gray-500">Análisis de dominios</p>
              <code className="rounded bg-gray-100 px-2 py-1 text-xs">
                POST /v3/dataforseo_labs/google/domain_rank_overview/live
              </code>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-lg font-medium text-white">
              Fascinante Digital
            </h3>
            <p className="mt-2 text-gray-400">
              API Gateway PRO ELITE para DataForSEO
            </p>
            <p className="mt-1 text-sm text-gray-500">
              © 2025 Fascinante Digital. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
