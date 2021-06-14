import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import EditIcon from "@material-ui/icons/Edit";
import { Button, Input } from "@material-ui/core";

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function UpdateModal({ movie, movieUpdateHandler }) {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);

  const [name, setName] = useState("");
  const [year, setYear] = useState("");

  useEffect(() => {
    console.log(movie);
    setName(movie.name);
    setYear(movie.year);
  }, [movie]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleUpdate = () => {
    movieUpdateHandler(movie.id, name, year);
    handleClose();
  };

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <h2 id="simple-modal-title">Delete Movie</h2>

      <Input
        name="name"
        value={name}
        onChange={({ target }) => setName(target.value)}
        type="text"
      />
      <br></br>
      <Input
        name="year"
        value={year}
        onChange={({ target }) => setYear(target.value)}
        type="number"
      />
      <br></br>

      <Button
        onClick={handleUpdate}
        type="button"
        variant="contained"
        color="secondary"
      >
        Update
      </Button>
      <Button onClick={handleClose} type="button" variant="contained">
        Cancel
      </Button>
    </div>
  );

  return (
    <div>
      <EditIcon style={{ cursor: "pointer" }} onClick={handleOpen} />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
  );
}
