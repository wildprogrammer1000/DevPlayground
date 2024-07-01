docker compose down &&
docker image prune -f && 
docker container prune -f &&
docker compose up --build