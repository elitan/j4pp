locals {
  envfile_raw = file(".env")
  # Join lines that don't start with a letter (continuation lines)
  envfile_clean = replace(local.envfile_raw, "\n([^A-Z#])", "$1")
  envfile = {
    for line in split("\n", local.envfile_clean) : 
      split("=", line)[0] => join("=", slice(split("=", line), 1, length(split("=", line))))
    if !startswith(line, "#") && length(split("=", line)) > 1 && trimspace(line) != ""
  }
}

env "local" {
  src = "file://db/schema.sql"
  url = try(local.envfile["DATABASE_URL"], getenv("DATABASE_URL"))
  dev = "docker://postgres/17/dev"
  schemas = ["public"]
}

env "stage" {
  src = "file://db/schema.sql"
  url = try(local.envfile["STAGING_DATABASE_URL"], getenv("STAGING_DATABASE_URL"))
  dev = "docker://postgres/17/dev"
  schemas = ["public"]
}

env "prod" {
  src = "file://db/schema.sql"
  url = try(local.envfile["PRODUCTION_DATABASE_URL"], getenv("PRODUCTION_DATABASE_URL"))
  dev = "docker://postgres/17/dev"
  schemas = ["public"]
} 