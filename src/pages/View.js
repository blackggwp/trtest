import React, { useState, useEffect } from "react";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { TextField } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import axios from "axios";
import config from "../config";

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    cursor: "pointer",
  },
  cardMedia: {
    paddingTop: "56.25%", // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}));

export default function View(props) {
  const [model, setModel] = useState({
    title: "",
    desc: "",
    image: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [helperText, setHelperText] = useState("");
  const classes = useStyles();

  useEffect(() => {
    const fetchPosts = async () => {
      setIsError(false);
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${config.apiUrl}/read/${props.match.params.id}`
        );
        // console.log(response);
        setModel({
          ...model,
          title: response.data.title,
          desc: response.data.desc,
          image: response.data.image,
        });
        setIsLoading(false);
      } catch (isError) {
        props.history.push("/");
        setIsError(true);
        console.log(isError);
      }
    };
    fetchPosts();
  }, []);

  const handleUpdate = async () => {
    const response = await axios.put(
      `${config.apiUrl}/update/${props.match.params.id}`,
      model
    );
    console.log(response);
    if (response) {
      setIsError(false);
      setHelperText("Update Successfully");
    } else {
      setIsError(true);
      setHelperText("Incorrect update post");
    }
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            View Post Detail
          </Typography>
        </Toolbar>
      </AppBar>
      <main>
        {isError && <div>Post not found ...</div>}

        {isLoading ? (
          <div>Loading ...</div>
        ) : (
          <Container className={classes.cardGrid} maxWidth="md">
            {/* End hero unit */}
            <Grid>
              <Grid item>
                <form noValidate autoComplete="off">
                  <Card className={classes.card}>
                    <CardMedia
                      className={classes.cardMedia}
                      image="https://source.unsplash.com/randomdd"
                      title="https://source.unsplash.com/randomdd"
                    />
                    <CardContent className={classes.cardContent}>
                      <TextField
                        error={isError}
                        fullWidth
                        id="title"
                        type="text"
                        label="title"
                        placeholder="title"
                        margin="normal"
                        value={model.title || ""}
                        onChange={(e) =>
                          setModel({ ...model, title: e.target.value })
                        }
                      />
                      <TextField
                        error={isError}
                        fullWidth
                        id="desc"
                        type="text"
                        label="description"
                        placeholder="desc"
                        margin="normal"
                        value={model.desc || ""}
                        onChange={(e) =>
                          setModel({ ...model, desc: e.target.value })
                        }
                      />
                      <TextField
                        error={isError}
                        fullWidth
                        id="post_image"
                        type="text"
                        label="image"
                        placeholder="image"
                        margin="normal"
                        value={model.image || ""}
                        onChange={(e) =>
                          setModel({ ...model, image: e.target.value })
                        }
                      />
                    </CardContent>
                    <CardActions>
                      <Button
                        variant="contained"
                        size="large"
                        color="primary"
                        onClick={() => handleUpdate()}
                      >
                        Update
                      </Button>
                    </CardActions>
                  </Card>
                </form>
              </Grid>
            </Grid>
            {helperText !== "" && !isError && (
              <div className={classes.root}>
                <Alert severity="success">{helperText}</Alert>
              </div>
            )}
            <Button
              style={{ margin: 20 }}
              variant="contained"
              size="large"
              color="default"
              onClick={() => props.history.push("/")}
            >
              Back
            </Button>
          </Container>
        )}
      </main>
    </React.Fragment>
  );
}
