atlas schema apply \
  -u "postgres://postgres:password@ai:9001/postgres?sslmode=disable" \
  --to file://schema.sql \
  --dev-url "docker+postgres://ankane/pgvector/dev"
