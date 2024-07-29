docker volume create maria
docker compose down
docker image prune -f 
docker volume prune -f
docker container prune -f
docker compose up --build