"""
Generates docs/openapi.json matching NestJS Swagger DocumentBuilder spec v1.1.0
"""
import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent
DOCS_DIR = BASE_DIR / "docs"

openapi_spec = {
    "openapi": "3.0.0",
    "info": {
        "title": "EduAtlas API",
        "description": "Education Intelligence and Data Visualization Platform API contracts. Provides curated snapshot data for Indonesian educational institutions (300 schools, 22 provinces, 27 universities), geography, performance indicators, academic calendar, domain cards, and analytics mart.",
        "version": "1.1.0",
        "contact": {
            "name": "EduAtlas Engineering & Data Team"
        }
    },
    "servers": [
        {"url": "http://localhost:4000/api/v1", "description": "Local Development Server"}
    ],
    "tags": [
        {"name": "Snapshots", "description": "Historical education data snapshots & versioning"},
        {"name": "Overview", "description": "National summary KPIs and macro level distributions"},
        {"name": "Schools", "description": "School catalog, filtering, and accreditation metrics"},
        {"name": "Universities", "description": "Higher education institutions and academic programs"},
        {"name": "Students", "description": "Student demographics and enrollment metrics"},
        {"name": "Teachers", "description": "Teacher distribution and student-to-teacher ratio (STR)"},
        {"name": "Geography", "description": "Regional map coordinates, islands, and province performance"},
        {"name": "Analytics", "description": "Multi-year enrollment, graduation, and radar chart metrics"},
        {"name": "Calendar", "description": "Academic calendar milestones, exams, and national events"},
        {"name": "Cards", "description": "Aggregated domain cards for data sources, imports, and partnerships"},
        {"name": "Page Cards", "description": "Individual card summaries and filters per dashboard page"},
        {"name": "Reports", "description": "Analytical summary narratives and exportable datasets"},
        {"name": "Health", "description": "System health checks and database connectivity"}
    ],
    "paths": {
        "/health": {
            "get": {
                "tags": ["Health"],
                "summary": "System Health Check",
                "responses": {
                    "200": {
                        "description": "System status and DB connectivity info",
                        "content": {"application/json": {"schema": {"$ref": "#/components/schemas/StandardResponse"}}}
                    }
                }
            }
        },
        "/education/snapshots": {
            "get": {
                "tags": ["Snapshots"],
                "summary": "List all historical snapshots",
                "responses": {"200": {"description": "Array of snapshot metadata", "content": {"application/json": {"schema": {"$ref": "#/components/schemas/StandardResponse"}}}}}
            }
        },
        "/education/snapshots/latest": {
            "get": {
                "tags": ["Snapshots"],
                "summary": "Get latest active snapshot",
                "responses": {"200": {"description": "Latest snapshot", "content": {"application/json": {"schema": {"$ref": "#/components/schemas/StandardResponse"}}}}}
            }
        },
        "/education/overview": {
            "get": {
                "tags": ["Overview"],
                "summary": "Get National Education Overview",
                "parameters": [
                    {"name": "period", "in": "query", "required": False, "schema": {"type": "string", "default": "2026"}},
                    {"name": "regionId", "in": "query", "required": False, "schema": {"type": "string"}}
                ],
                "responses": {"200": {"description": "National summary KPIs and distributions", "content": {"application/json": {"schema": {"$ref": "#/components/schemas/StandardResponse"}}}}}
            }
        },
        "/education/schools": {
            "get": {
                "tags": ["Schools"],
                "summary": "Query school catalog with filtering & pagination",
                "parameters": [
                    {"name": "page", "in": "query", "schema": {"type": "integer", "default": 1}},
                    {"name": "limit", "in": "query", "schema": {"type": "integer", "default": 20}},
                    {"name": "search", "in": "query", "schema": {"type": "string"}},
                    {"name": "regionId", "in": "query", "schema": {"type": "string"}},
                    {"name": "educationLevel", "in": "query", "schema": {"type": "string", "enum": ["SD", "SMP", "SMA", "SMK"]}},
                    {"name": "ownership", "in": "query", "schema": {"type": "string", "enum": ["Negeri", "Swasta"]}},
                    {"name": "accreditation", "in": "query", "schema": {"type": "string", "enum": ["A", "B", "C"]}}
                ],
                "responses": {"200": {"description": "Paginated school records", "content": {"application/json": {"schema": {"$ref": "#/components/schemas/StandardResponse"}}}}}
            }
        },
        "/education/schools/{id}": {
            "get": {
                "tags": ["Schools"],
                "summary": "Get detailed school profile by ID",
                "parameters": [{"name": "id", "in": "path", "required": True, "schema": {"type": "string"}}],
                "responses": {"200": {"description": "School details", "content": {"application/json": {"schema": {"$ref": "#/components/schemas/StandardResponse"}}}}}
            }
        },
        "/education/universities": {
            "get": {
                "tags": ["Universities"],
                "summary": "List higher education institutions",
                "parameters": [
                    {"name": "page", "in": "query", "schema": {"type": "integer", "default": 1}},
                    {"name": "limit", "in": "query", "schema": {"type": "integer", "default": 20}},
                    {"name": "search", "in": "query", "schema": {"type": "string"}},
                    {"name": "type", "in": "query", "schema": {"type": "string", "enum": ["PTN", "PTS"]}}
                ],
                "responses": {"200": {"description": "List of universities", "content": {"application/json": {"schema": {"$ref": "#/components/schemas/StandardResponse"}}}}}
            }
        },
        "/education/regions": {
            "get": {
                "tags": ["Geography"],
                "summary": "Get all provinces with education metrics",
                "responses": {"200": {"description": "Provinces list and scores", "content": {"application/json": {"schema": {"$ref": "#/components/schemas/StandardResponse"}}}}}
            }
        },
        "/education/regions/map": {
            "get": {
                "tags": ["Geography"],
                "summary": "GeoJSON map features and markers",
                "parameters": [
                    {"name": "institutionType", "in": "query", "schema": {"type": "string", "enum": ["all", "schools", "universities"]}}
                ],
                "responses": {"200": {"description": "Map coordinates and GeoJSON features", "content": {"application/json": {"schema": {"$ref": "#/components/schemas/StandardResponse"}}}}}
            }
        },
        "/education/calendar": {
            "get": {
                "tags": ["Calendar"],
                "summary": "List academic calendar events",
                "parameters": [
                    {"name": "category", "in": "query", "schema": {"type": "string", "enum": ["Akademik", "Ujian", "Libur", "Pendaftaran"]}},
                    {"name": "status", "in": "query", "schema": {"type": "string", "enum": ["Upcoming", "Ongoing", "Completed"]}}
                ],
                "responses": {"200": {"description": "Calendar events list", "content": {"application/json": {"schema": {"$ref": "#/components/schemas/StandardResponse"}}}}}
            }
        },
        "/cards": {
            "get": {
                "tags": ["Cards"],
                "summary": "Get aggregate domain cards for operational tables",
                "responses": {"200": {"description": "Domain operational card metrics", "content": {"application/json": {"schema": {"$ref": "#/components/schemas/StandardResponse"}}}}}
            }
        },
        "/pages": {
            "get": {
                "tags": ["Page Cards"],
                "summary": "List all 12 registered dashboard pages",
                "responses": {"200": {"description": "Dashboard page catalog", "content": {"application/json": {"schema": {"$ref": "#/components/schemas/StandardResponse"}}}}}
            }
        },
        "/pages/{page}/cards": {
            "get": {
                "tags": ["Page Cards"],
                "summary": "Get card metrics for a specific page",
                "parameters": [{"name": "page", "in": "path", "required": True, "schema": {"type": "string"}}],
                "responses": {"200": {"description": "Page cards collection", "content": {"application/json": {"schema": {"$ref": "#/components/schemas/StandardResponse"}}}}}
            }
        },
        "/pages/{page}/cards/{cardId}": {
            "get": {
                "tags": ["Page Cards"],
                "summary": "Query an individual card metric",
                "parameters": [
                    {"name": "page", "in": "path", "required": True, "schema": {"type": "string"}},
                    {"name": "cardId", "in": "path", "required": True, "schema": {"type": "string"}}
                ],
                "responses": {"200": {"description": "Single card detail with provenance", "content": {"application/json": {"schema": {"$ref": "#/components/schemas/StandardResponse"}}}}}
            }
        }
    },
    "components": {
        "schemas": {
            "StandardResponse": {
                "type": "object",
                "properties": {
                    "data": {"type": "object", "description": "Payload response data"},
                    "meta": {
                        "type": "object",
                        "properties": {
                            "snapshotId": {"type": "string", "example": "snp-2026-11-22"},
                            "period": {"type": "string", "example": "2026"},
                            "source": {"type": "string", "example": "EduAtlas Data Lake Pipeline"},
                            "isDemoData": {"type": "boolean", "example": True}
                        }
                    }
                }
            }
        }
    }
}

out_file = DOCS_DIR / "openapi.json"
with open(out_file, "w", encoding="utf-8") as f:
    json.dump(openapi_spec, f, indent=2, ensure_ascii=False)

print(f"[V] OpenAPI 3.0 specification successfully generated at: {out_file}")
