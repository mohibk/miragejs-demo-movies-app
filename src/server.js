import { createServer, Model, hasMany, belongsTo } from "miragejs";

createServer({
  models: {
    movie: Model.extend({
      actors: hasMany(),
    }),
    actor: Model.extend({
      movie: belongsTo(),
    }),
  },

  seeds(server) {
    const matt = server.create("actor", { name: "Matthew McConaughey" });
    const nat = server.create("actor", { name: "Natalie Portman" });
    const anne = server.create("actor", { name: "Anne Hathaway" });
    const jess = server.create("actor", { name: "Jessica Chastain" });
    const leo = server.create("actor", { name: "Leornado Dicaprio" });
    const rachel = server.create("actor", { name: "Rachel Brosnahain" });

    server.create("movie", {
      name: "Inception",
      year: 2010,
      actors: [nat, rachel],
    });
    server.create("movie", {
      name: "Interstellar",
      year: 2014,
      actors: [jess, leo],
    });
    server.create("movie", {
      name: "Dunkirk",
      year: 2017,
      actors: [matt, anne],
    });
  },

  routes() {
    this.namespace = "api";

    this.get("/movies", (schema, request) => {
      return schema.movies.all();
    });

    this.get("/movies/:id", (schema, request) => {
      let id = request.params.id;

      return schema.movies.find(id);
    });

    this.post("/movies", (schema, request) => {
      let attrs = JSON.parse(request.requestBody);

      return schema.movies.create(attrs);
    });

    this.patch("/movies/:id", (schema, request) => {
      let newAttrs = JSON.parse(request.requestBody);
      let id = request.params.id;
      let movie = schema.movies.find(id);

      return movie.update(newAttrs);
    });

    this.delete("/movies/:id", (schema, request) => {
      let id = request.params.id;

      return schema.movies.find(id).destroy();
    });

    this.get("/movies/:id/actors", (schema, request) => {
      let movie = schema.movies.find(request.params.id);

      return movie.actors;
    });
  },
});
