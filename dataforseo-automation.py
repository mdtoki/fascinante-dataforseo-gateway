#!/usr/bin/env python3
"""
DataForSEO Automation Script - Pro Elite Configuration
Minimiza el uso de web dashboards mediante CLI/SDK
"""

import json
import time
import sys
from pathlib import Path
from typing import Dict, List, Optional, Any
from dataforseo_client import configuration as dfs_config, api_client as dfs_api_provider
from dataforseo_client.api.ai_optimization_api import AiOptimizationApi
from dataforseo_client.api.serp_api import SerpApi
from dataforseo_client.api.on_page_api import OnPageApi
from dataforseo_client.rest import ApiException

class DataForSEOElite:
    """Clase principal para automatización elite de DataForSEO"""
    
    def __init__(self, config_path: str = "dataforseo-config.json"):
        """Inicializar con configuración"""
        self.config = self._load_config(config_path)
        self.setup_api_client()
    
    def _load_config(self, config_path: str) -> Dict[str, Any]:
        """Cargar configuración desde archivo JSON"""
        try:
            with open(config_path, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            print(f"❌ Error: Archivo de configuración {config_path} no encontrado")
            sys.exit(1)
        except json.JSONDecodeError:
            print(f"❌ Error: Archivo de configuración {config_path} inválido")
            sys.exit(1)
    
    def setup_api_client(self):
        """Configurar cliente API con credenciales"""
        username = self.config['api_credentials']['username']
        password = self.config['api_credentials']['password']
        
        if username == "YOUR_DATAFORSEO_USERNAME" or password == "YOUR_DATAFORSEO_PASSWORD":
            print("⚠️  ADVERTENCIA: Configura tus credenciales en dataforseo-config.json")
            print("   - Username: Tu usuario de DataForSEO")
            print("   - Password: Tu contraseña de DataForSEO")
            return
        
        self.configuration = dfs_config.Configuration(
            username=username,
            password=password
        )
        
        self.api_client = dfs_api_provider.ApiClient(self.configuration)
        self.ai_optimization_api = AiOptimizationApi(self.api_client)
        self.serp_api = SerpApi(self.api_client)
        self.on_page_api = OnPageApi(self.api_client)
        
        print("✅ Cliente DataForSEO configurado correctamente")
    
    def test_connection(self) -> bool:
        """Probar conexión con DataForSEO API"""
        try:
            # Probar con endpoint simple
            response = self.ai_optimization_api.chat_gpt_llm_responses_models()
            print("✅ Conexión con DataForSEO API exitosa")
            return True
        except ApiException as e:
            print(f"❌ Error de conexión: {e}")
            return False
        except Exception as e:
            print(f"❌ Error inesperado: {e}")
            return False
    
    def get_ai_models(self, provider: str = "chatgpt") -> List[Dict]:
        """Obtener modelos AI disponibles"""
        try:
            if provider == "chatgpt":
                response = self.ai_optimization_api.chat_gpt_llm_responses_models()
            elif provider == "claude":
                response = self.ai_optimization_api.claude_llm_responses_models()
            elif provider == "gemini":
                response = self.ai_optimization_api.gemini_llm_responses_models()
            elif provider == "perplexity":
                response = self.ai_optimization_api.perplexity_llm_responses_models()
            else:
                raise ValueError(f"Proveedor {provider} no soportado")
            
            return response.tasks if hasattr(response, 'tasks') else []
        except ApiException as e:
            print(f"❌ Error obteniendo modelos {provider}: {e}")
            return []
    
    def generate_ai_content(self, prompt: str, model: str = "gpt-4.1-mini", 
                          provider: str = "chatgpt") -> Optional[str]:
        """Generar contenido usando AI"""
        try:
            from dataforseo_client.models.ai_optimization_chat_gpt_llm_responses_live_request_info import AiOptimizationChatGptLlmResponsesLiveRequestInfo
            
            request_info = AiOptimizationChatGptLlmResponsesLiveRequestInfo(
                user_prompt=prompt,
                model_name=model,
                max_output_tokens=self.config['ai_optimization']['default_params']['max_output_tokens'],
                temperature=self.config['ai_optimization']['default_params']['temperature'],
                top_p=self.config['ai_optimization']['default_params']['top_p'],
                web_search=self.config['ai_optimization']['default_params']['web_search']
            )
            
            response = self.ai_optimization_api.chat_gpt_llm_responses_live([request_info])
            
            if response.tasks and len(response.tasks) > 0:
                task = response.tasks[0]
                if hasattr(task, 'result') and task.result:
                    return task.result[0].ai_response if task.result[0].ai_response else "Sin respuesta"
            
            return None
        except ApiException as e:
            print(f"❌ Error generando contenido AI: {e}")
            return None
    
    def analyze_serp(self, keyword: str, location: str = "United States") -> Optional[Dict]:
        """Analizar SERP para una palabra clave"""
        try:
            from dataforseo_client.models.serp_google_organic_task_post_request_info import SerpGoogleOrganicTaskPostRequestInfo
            
            request_info = SerpGoogleOrganicTaskPostRequestInfo(
                keyword=keyword,
                location_name=location,
                language_name="English",
                depth=self.config['default_settings']['depth'],
                priority=self.config['default_settings']['priority']
            )
            
            response = self.serp_api.google_organic_task_post([request_info])
            
            if response.tasks and len(response.tasks) > 0:
                task = response.tasks[0]
                return {
                    'task_id': task.id,
                    'status': task.status,
                    'cost': task.cost,
                    'created_at': task.created_at
                }
            
            return None
        except ApiException as e:
            print(f"❌ Error analizando SERP: {e}")
            return None
    
    def get_task_results(self, task_id: str) -> Optional[Dict]:
        """Obtener resultados de una tarea"""
        try:
            response = self.serp_api.google_organic_task_get_advanced(task_id)
            
            if response.tasks and len(response.tasks) > 0:
                task = response.tasks[0]
                return {
                    'status': task.status,
                    'result': task.result if hasattr(task, 'result') else None
                }
            
            return None
        except ApiException as e:
            print(f"❌ Error obteniendo resultados: {e}")
            return None
    
    def batch_analyze_keywords(self, keywords: List[str]) -> List[Dict]:
        """Analizar múltiples palabras clave en lote"""
        results = []
        
        for keyword in keywords:
            print(f"🔍 Analizando: {keyword}")
            result = self.analyze_serp(keyword)
            if result:
                results.append({
                    'keyword': keyword,
                    'task_id': result['task_id'],
                    'status': result['status']
                })
            
            # Rate limiting
            time.sleep(1)
        
        return results
    
    def generate_seo_report(self, domain: str) -> str:
        """Generar reporte SEO completo"""
        prompt = f"""
        Genera un reporte SEO completo para el dominio: {domain}
        
        Incluye:
        1. Análisis de palabras clave principales
        2. Competidores principales
        3. Oportunidades de mejora
        4. Recomendaciones técnicas
        5. Estrategia de contenido
        
        Formato: Markdown estructurado
        """
        
        return self.generate_ai_content(prompt, "gpt-4.1-mini", "chatgpt")

def main():
    """Función principal para demostrar uso"""
    print("🚀 DataForSEO Elite Automation")
    print("=" * 50)
    
    # Inicializar cliente
    dfs = DataForSEOElite()
    
    # Probar conexión
    if not dfs.test_connection():
        print("❌ No se pudo conectar a DataForSEO API")
        return
    
    # Mostrar modelos disponibles
    print("\n📋 Modelos AI disponibles:")
    models = dfs.get_ai_models("chatgpt")
    for model in models[:5]:  # Mostrar solo los primeros 5
        print(f"  - {model}")
    
    # Ejemplo de generación de contenido
    print("\n🤖 Generando contenido AI...")
    content = dfs.generate_ai_content("Escribe un título SEO para una página sobre marketing digital")
    if content:
        print(f"✅ Contenido generado: {content}")
    
    # Ejemplo de análisis SERP
    print("\n🔍 Analizando SERP...")
    serp_result = dfs.analyze_serp("marketing digital")
    if serp_result:
        print(f"✅ Tarea SERP creada: {serp_result['task_id']}")
    
    print("\n✅ Automatización DataForSEO configurada correctamente")

if __name__ == "__main__":
    main()
