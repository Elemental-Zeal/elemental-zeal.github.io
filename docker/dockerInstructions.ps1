# Tear down the site and clean up.
docker container stop elementalzeal
docker container rm elementalzeal
docker image rm elementalzeal

# Build the site new.
docker build -t elementalzeal -f docker/Dockerfile .

# See list of created images
docker images

# Run the site.
docker run -d -p 80:80 --name elementalzeal elementalzeal

# Navigate to localhost:80 in browser