import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import VisibilityIcon from "@material-ui/icons/Visibility";

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

export default function ViewActorsModal({ id }) {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const [actors, setActors] = React.useState(null);

  useEffect(() => {
    const getActors = async () => {
      try {
        const res = await fetch(`/api/movies/${id}/actors`);
        const json = await res.json();
        console.log(json);
        setActors(json.actors);
      } catch (error) {
        console.log(error);
      }
    };

    open && getActors();
  }, [id, open]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <h2 id="simple-modal-title">Actors List</h2>
      {actors?.length > 0 ? (
        <div>
          {actors?.map((actor) => (
            <p key={actor.id}>{actor.name}</p>
          ))}
        </div>
      ) : actors ? (
        <p>No actors</p>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );

  return (
    <div>
      <VisibilityIcon style={{ cursor: "pointer" }} onClick={handleOpen} />
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
