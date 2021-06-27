docker container stop elementalzeal
docker container rm elementalzeal
docker image rm elementalzeal
docker build -t elementalzeal -f docker/Dockerfile .
docker run -d -p 80:80 --name elementalzeal elementalzeal