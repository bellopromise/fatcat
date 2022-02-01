
HOW TO RUN THE APPLICATION

- Move to the project directory on the terminal
- Run docker-compose up "fatcat_db"
- Run docker-compose up "fatcat_api"
- Run "docker exec -it fatcat_api sh"
- Run "npx sequelize-cli db:migrate" to migrate
- Run "npx sequelize-cli db:seed:all" to run the seeds
- Good to go!

URLs FOR ROUTES

- GET api/v1/buildings --> to get the list of all buildings
- POST api/v1/buildings --> to create a building
- GET api/v1/buildings/:id --> to get a particular building
- DELETE api/v1/buildings/:id --> to delete building

- GET api/v1/units --> to get the list of all units
- POST api/v1/units --> to create a unit
- GET api/v1/units/:id --> to get a particular unit
- PATCH api/v1/units/:id --> to feed unit
- DELETE api/v1/units/:id --> to delete unit
