import { useEffect, useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Input from "@material-ui/core/Input";
import { Button } from "@material-ui/core";
import DeleteModal from "./components/delete-modal";
// import UpdateModal from "./components/update-modal";
import EditIcon from "@material-ui/icons/Edit";
import ViewActorsModal from "./components/movie-actors";

const useStyles = makeStyles({
  form: {
    margin: "0 auto",
    width: 768,
  },
  tableContainer: {
    margin: "0 auto",
    width: 768,
  },
  table: {
    margin: "3rem 0",
  },
  input: {
    margin: "3rem",
  },
  actions: {
    display: "flex",
    justifyContent: "space-around",
  },
});

export default function App() {
  const [movies, setMovies] = useState(null);
  const [movieId, setMovieId] = useState("");
  const [name, setName] = useState("");
  const [year, setYear] = useState("");
  const [updatingMovie, setUpdatingMovie] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    fetch("/api/movies")
      .then((res) => res.json())
      .then((json) => setMovies(json.movies));
  }, []);

  const createMovie = async () => {
    try {
      const res = await fetch("/api/movies", {
        method: "POST",
        body: JSON.stringify({ name, year }),
      });

      const json = await res.json();

      setMovies([...movies, json.movie]);
      setName("");
      setYear("");

      console.log(json);
    } catch (error) {
      console.log(error);
    }
  };

  const udateMovie = async () => {
    try {
      const res = await fetch(`/api/movies/${movieId}`, {
        method: "PATCH",
        body: JSON.stringify({ name, year }),
      });

      const moviesCopy = [...movies];
      const json = await res.json();
      const index = movies.findIndex((movie) => movie.id === movieId);
      moviesCopy[index] = json.movie;

      setMovies(moviesCopy);
      setName("");
      setYear("");
      setMovieId("");
      setUpdatingMovie(false);

      console.log(json);
    } catch (error) {
      console.log(error);
    }
  };

  const formSubmitHandler = async (e) => {
    e.preventDefault();
    if (updatingMovie) {
      udateMovie();
    } else {
      createMovie();
    }
  };

  const setMovieToUpdate = (id) => {
    const movie = movies.find((movie) => movie.id === id);
    setMovieId(id);
    setUpdatingMovie(true);
    setName(movie.name);
    setYear(movie.year);
  };

  const movieDeleteHandler = async (id) => {
    try {
      await fetch(`/api/movies/${id}`, {
        method: "DELETE",
      });
      setMovies(movies.filter((movie) => movie.id !== id));
    } catch (error) {
      console.log(error);
    }
    console.log("deleted", id);
  };

  // const movieUpdateHandler = async (movieId, name, year) => {
  //   try {
  //     const res = await fetch(`/api/movies/${movieId}`, {
  //       method: "PATCH",
  //       body: JSON.stringify({ name, year }),
  //     });

  //     const json = res.json();
  //     console.log(json);

  //     let moviesCopy = [...movies];

  //     const index = movies.findIndex((m) => m.id === movieId);
  //     moviesCopy[index] = json.movie;

  //     console.log(moviesCopy);
  //     // setMovies(moviesCopy);
  //     setName("");
  //     setYear("");
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  return (
    <>
      <form className={classes.form} onSubmit={formSubmitHandler}>
        <Input
          name="name"
          value={name}
          onChange={({ target }) => setName(target.value)}
          className={classes.input}
          type="text"
        />
        <Input
          name="year"
          value={year}
          onChange={({ target }) => setYear(target.value)}
          className={classes.input}
          type="number"
        />
        <Button type="submit" variant="contained" color="primary">
          {updatingMovie ? "Update" : "Create"}
        </Button>
      </form>
      {movies?.length > 0 ? (
        <TableContainer className={classes.tableContainer} component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>No</TableCell>
                <TableCell>Movie</TableCell>
                <TableCell>Year</TableCell>
                <TableCell className={classes.actions}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {movies?.map((movie) => (
                <TableRow key={movie?.id}>
                  <TableCell component="th" scope="row">
                    {movie?.id}
                  </TableCell>
                  <TableCell>{movie?.name}</TableCell>
                  <TableCell>{movie?.year}</TableCell>
                  <TableCell className={classes.actions}>
                    <DeleteModal
                      color="secondary"
                      movieDeleteHandler={movieDeleteHandler}
                      id={movie.id}
                    />
                    {/* <UpdateModal
                    style={{ cursor: "pointer" }}
                    color="primary"
                    movie={movie}
                    movieUpdateHandler={movieUpdateHandler}
                  /> */}
                    <EditIcon
                      style={{ cursor: "pointer" }}
                      onClick={() => setMovieToUpdate(movie.id)}
                    />
                    <ViewActorsModal id={movie.id} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : movies ? (
        <p>No movies</p>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
}

// export default App;
