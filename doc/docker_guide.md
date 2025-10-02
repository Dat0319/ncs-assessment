```bash
docker remove db-ncs-mysql -f

# docker run --name db-ncs-postgresql \
#   --restart=always \
#   -p 5433:5432 \
#   -e POSTGRES_PASSWORD=Book@123 \
#   -e POSTGRES_USER=postgres \
#   -e POSTGRES_DB=ncs \
#   -e PGDATA=/var/lib/postgresql/data/pgdata \
#   -d postgres:14 \
#   # -v postgres_data:/var/lib/postgresql/data \
#   -c max_connections=1000 \
#   -c shared_buffers=256MB \
#   -c effective_cache_size=1GB \
#   -c maintenance_work_mem=64MB \
#   -c checkpoint_completion_target=0.9 \
#   -c wal_buffers=16MB \
#   -c default_statistics_target=100

# docker remove db-ncs-mysql -f
# docker run --name db-ncs-postgresql \
#   --restart=always \
#   -p 5432:5432 \
#   -e POSTGRES_PASSWORD=Book@123 \
#   -e POSTGRES_USER=postgres \
#   -e POSTGRES_DB=ncs \
#   -e PGDATA=/var/lib/postgresql/data/pgdata \
#   -d postgres:14 \
#   -c max_connections=1000 \
#   -c shared_buffers=256MB \
#   -c effective_cache_size=1GB \
#   -c maintenance_work_mem=64MB \
#   -c checkpoint_completion_target=0.9 \
#   -c wal_buffers=16MB \
#   -c default_statistics_target=100

# REDIS
docker run -d \
  --name db-ncs-redis \
  -p 6379:6379 \
  -v redis_data:/data \
  --restart unless-stopped \
  -e REDIS_PASSWORD='mM4bFqYObi4jRgZ5pRs2AFUluAG65jhN' \
  redis:latest

```

```bash
# Remove docker container db
docker stop db-ncs-mysql && docker rm db-ncs-mysql

# Remove docker container
docker stop ncs-app-container && docker rm ncs-app-container
docker rmi ncs-app:1.0.0

# Build the Docker image
docker build -t ncs-app:1.0.0 .
# Run the Docker container
docker run -d --name ncs-app-container -p 8080:8080 ncs-app:1.0.0
# Verify that the container is running
docker ps

# view docker log file
docker logs -f ncs-app-container

```
