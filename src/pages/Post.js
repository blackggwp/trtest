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

export default function Post(props) {
  const classes = useStyles();
  const [posts, setPost] = useState([]);
  const [pagination, setPagination] = useState({
    skip: 0,
    row: 4,
    current: 1
  })
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPosts = async (current=1) => {
    setIsError(false);
    setIsLoading(true);
    
    let skip =
    current === 1 ? 0 : (current - 1) * pagination.row
    try {
      const response = await axios.get(`${config.apiUrl}/read?skip=${skip}&top=${pagination.row}`);
      // console.log(response);
      setPost([...posts, ...response.data]);

      setPagination({...pagination,
        current: current
      })

      setIsLoading(false);
    } catch (error) {
      setIsError(true);
      console.error(error);
    }
  };

  const loadmore = (e) => {
    fetchPosts(pagination.current + 1)
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  const delPost = async (id) => {
    const response = await axios
      .delete(`${config.apiUrl}/delete/${id}`)
      .then(function () {
        fetchPosts();
      });
  };

  return (
    <>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            Instagram
          </Typography>
        </Toolbar>
      </AppBar>
      <main>
        {isError && <div>Post not found ...</div>}

        {isLoading ? (
          <div>Loading ...</div>
        ) : (
          <Container className={classes.cardGrid} maxWidth="md">
            <Button
            style={{marginBottom: 20}}
              variant="contained"
              size="large"
              color="primary"
              onClick={() => props.history.push("/create")}
            >
              Add Post
            </Button>

            <Grid container spacing={4}>
              {posts !== [] &&
                posts.map((card, idx) => (
                  <Grid item key={idx} xs={12} sm={6} md={4}>
                    <Card className={classes.card}>
                      {card.image ? (
                        <CardMedia
                          className={classes.cardMedia}
                          image={card.image}
                          title={card.image}
                        />
                      ) : (
                        <CardMedia
                          className={classes.cardMedia}
                          image="https://source.unsplash.com/random"
                          title={card.image}
                        />
                      )}
                      <CardContent className={classes.cardContent}>
                        <Typography gutterBottom variant="h5" component="h2">
                          {card.title}
                        </Typography>
                        <Typography>{card.desc}</Typography>
                      </CardContent>
                      <CardActions>
                        <Button
                          size="small"
                          color="primary"
                          onClick={() =>
                            props.history.push(`/view/${card.post_id}`)
                          }
                        >
                          View
                        </Button>
                        <Button
                          size="small"
                          color="secondary"
                          onClick={() => delPost(card.post_id)}
                        >
                          Delete
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
            </Grid>
            <Grid container style={{marginTop: 20}}>
              <Grid item xs={12}>
              <Button
                  fullWidth
                  variant="contained"
                  color="default"
                  onClick={loadmore}
                >
                  load more +
                </Button>
              </Grid>
              </Grid>
          </Container>
        )}
      </main>
    </>
  );
}
