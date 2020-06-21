import React, { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import CardHeader from "@material-ui/core/CardHeader";
import { makeStyles } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";
import axios from "axios";
import config from "../config";

export default function CreatePost(props) {
  const [title, settitle] = useState("");
  const [description, setdescription] = useState("");
  const [post_image, setpost_image] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [helperText, setHelperText] = useState("");
  const [error, setError] = useState(false);

  const useStyles = makeStyles((theme) => ({
    root: {
      width: "100%",
      "& > * + *": {
        marginTop: theme.spacing(2),
      },
    },
  }));
  const classes = useStyles();

  useEffect(() => {
    if (title.trim() && description.trim() && post_image.trim()) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [title, description, post_image]);

  const handleCreate = async () => {
    if (title.length > 1 && description.length > 1 && post_image.length > 1) {
      const postData = { title: title, desc: description, image: post_image };
      const response = await axios.post(`${config.apiUrl}/create`, postData);
      // console.log(response);
      if (response) {
        setError(false);
        setHelperText("Create Successfully");
      } else {
        setError(true);
        setHelperText("Incorrect create post");
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.keyCode === 13 || e.which === 13) {
      isButtonDisabled || handleCreate();
    }
  };

  return (
    <>
      <form noValidate autoComplete="off">
        <Card>
          <CardHeader title="Create Post" />
          <CardContent>
            <div>
              <TextField
                error={error}
                fullWidth
                id="title"
                type="text"
                label="title"
                placeholder="title"
                margin="normal"
                onChange={(e) => settitle(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e)}
              />
              <TextField
                error={error}
                fullWidth
                id="description"
                type="text"
                label="description"
                placeholder="description"
                margin="normal"
                helperText={helperText}
                onChange={(e) => setdescription(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e)}
              />
              <TextField
                error={error}
                fullWidth
                id="post_image"
                type="text"
                label="post image"
                placeholder="Url"
                margin="normal"
                helperText={helperText}
                onChange={(e) => setpost_image(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e)}
              />
            </div>
          </CardContent>
          <CardActions>
            <Button
              variant="contained"
              size="large"
              color="secondary"
              onClick={() => handleCreate()}
              disabled={isButtonDisabled}
            >
              Create
            </Button>
          </CardActions>
        </Card>
      </form>
      <br />
      <Button
        variant="contained"
        size="large"
        color="primary"
        onClick={() => props.history.push("/")}
      >
        Back
      </Button>

      {helperText !== "" && !error && (
        <div className={classes.root}>
          <Alert severity="success">{helperText}</Alert>
        </div>
      )}
    </>
  );
}
