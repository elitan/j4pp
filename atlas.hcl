variable "database_url" {
  type    = string
  default = getenv("DATABASE_URL")
}

env "local" {
  src = "file://db/schema.sql"
  url = getenv("DATABASE_URL")
  dev = "docker://postgres/17/dev?search_path=public"
}

env "stage" {
  src = "file://db/schema.sql"
  url = getenv("STAGING_DATABASE_URL")
  dev = "docker://postgres/17/dev?search_path=public"
}

env "prod" {
  src = "file://db/schema.sql"
  url = getenv("PRODUCTION_DATABASE_URL")
  dev = "docker://postgres/17/dev?search_path=public"
} 