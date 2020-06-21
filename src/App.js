import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'
import Post from './pages/Post'
import View from './pages/View';
import CreatePost from './pages/CreatePost';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Post} />
        <Route path="/view/:id" component={View} />
        <Route exact path="/create" component={CreatePost} />
        <Redirect to="/" />
      </Switch>
    </Router>
  );
}

export default App;
