import React, { useState, useEffect } from 'react';
import {
  NavBar, 
  useStyles, 
  CardMediaUI, 
  PokedexDiv, 
  PokedexP } from './Cards'; 
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Toolbar,
    AppBar,
    TextField
  } from "@material-ui/core"; 
/* import Data from '../Data'; */
import { MenuIcon } from './Cards';
import PokeLogo from '../../images/pokemonLogo.svg';
import { PokemonSelector } from '@charkour/react-reactions';
import LinearProgressBar from '../ProgressBar';

import axios from 'axios';


const Cards = (props) => {
  const date = new Date().getFullYear();
  const classes = useStyles();
  const { history } = props;
  const [pokemonData, setPokemonData] = useState({});
  const [filter, setFilter] = useState("");
  

  useEffect(() => {
    axios
      .get(`https://pokeapi.co/api/v2/pokemon?limit=897`)
      .then((response) => {
        const { data } = response;
        const { results } = data;
        const newPokemonData = {};
        results.forEach((pokemon, index) => {
          newPokemonData[index + 1] = {
            id: index + 1,
            name: pokemon.name,
            sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
              index + 1
            }.png`,
          };
        });
        setPokemonData(newPokemonData);
      });
  }, []);

  const getPokemonCard = (pokemonId) => {
    const { id, name, sprite } = pokemonData[pokemonId];
    const clicked = () => {
      history.push(`/${id}`)
    }

    return ( 
      <Grid item xs={4} key={pokemonId}>
        <Card onClick={clicked}>
          <CardMediaUI
            className={classes.cardMedia}
            image={sprite}
          />
          <CardContent className={classes.cardContent}>
            <Typography>{`${id}. ${name}`}</Typography>
          </CardContent>
        </Card>
      </Grid>
    );
  };

  /* Map method for data with filter includes getPokemonCard */
  const pokemonMap = Object.keys(pokemonData).map(
    (pokemonId) => pokemonData[pokemonId].name.includes(filter) && getPokemonCard(pokemonId))

  /* Event handler for TextField */  
  const handleSearchChange = (event) => {
    setFilter(event.target.value);
  };

  /* Card search results. Search failed == CircularProgress visual effect */
  const pokemonCard = pokemonData ? (
    <Grid container spacing={2} className={classes.cardContainer}>
      {pokemonMap}
      </Grid>) : ( <LinearProgressBar />)

  return (
    <>
      <NavBar>
      <AppBar className={classes.AppBar}>
        <Toolbar>
          <Typography className={classes.title} variant="h6" noWrap>
          <MenuIcon src={PokeLogo} />
          </Typography>

          <div className={classes.searchContainer}>
                  <TextField
                  className={classes.searchInput}
                  onChange={handleSearchChange}
                  label="Search"
                  variant="standard"
                  />
          </div>
          <PokemonSelector reactions={['love']} />
        </Toolbar>
      </AppBar>
    </NavBar>
    <PokedexDiv>
        {pokemonCard}
    </PokedexDiv>
    <PokedexDiv>
        <PokedexP> © Milton Rodrigues - {date} </PokedexP>
    </PokedexDiv>
    </>
  );
};


export default Cards;