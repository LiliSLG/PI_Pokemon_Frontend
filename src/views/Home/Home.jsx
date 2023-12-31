import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import style from "./Home.module.css";
import { CardsContainer, TableView } from "../../components";
import { handleSetFooterAppStatus } from "../../handlers/handleFooterMessages";
import { FilterBar, SearchBar, APIToolBar } from "../../components/bars";
import {
  getPokemonByName,
  pokemonApplyFilters,
  pokemonApplyMultipleFilters,
  resetFilters,
  getPokemonByNames,
  getPokemonByNamesHELP,
} from "../../redux/actions";
import { Tooltip } from "../../components";

const Home = () => {
  const dispatch = useDispatch();

  const [isTableView, setIsTableView] = useState(false);

  const toggleView = () => {
    setIsTableView(!isTableView);
  };

  const filteredPokemons = useSelector(
    (state) => state.pokemon.filteredPokemons
  );
  const totalPokemonsFilter = useSelector(
    (state) => state.pokemon.filteredPokemons.length
  );

  const [displayedPokemons, setDisplayedPokemons] = useState([]);

  const filterTypeOptions = useSelector((state) => state.pokemon.types);

  const [filterByName, setFilterByName] = useState("");
  const [filterByOrigin, setFilterByOrigin] = useState("");
  const [filterByType, setFilterByType] = useState("");
  const [filterByX, setFilterByX] = useState("");
  const [filterByXoperator, setFilterByXoperator] = useState(">=");
  const [filterByXvalue, setfilterByXvalue] = useState("");
  const [filterByXOK, setFilterByXOK] = useState({});
  // const [refresh, setRefresh] = useState(false);

  // const handleAPIPaginate = (pageNumber) => {
  //   setCurrentPage(pageNumber);
  // };

  const handleResetFilters = () => {
    dispatch(resetFilters());
    setFilterByName("");
    setFilterByOrigin("");
    setFilterByType("");
    setFilterByX("");
    setFilterByXoperator(">=");
    setfilterByXvalue("");
    setFilterByXOK({});
  };

  useEffect(() => {
    setDisplayedPokemons(filteredPokemons);
  }, [totalPokemonsFilter]);

  // useEffect(() => {
  //   setFilteredCards(pokemons);
  //   resetFilters();
  // }, [pokemons.length]);

  // useEffect(() => {
  //   setRefresh(false);
  // }, [refresh]);



  const handleClickSearch = () => {
    if (filterByName !== "") {
      //busco en la api
      dispatch(getPokemonByName(filterByName));
      // setRefresh(true);
    }
  };

  const handleChangeSearch = (searchTerm) => {
    setFilterByName(searchTerm);
    dispatch(pokemonApplyFilters("filterByName", searchTerm));
    // setRefresh(true);
  };

  const handleOrder = (orderTerm) => {
    dispatch(pokemonApplyFilters("orderByName", orderTerm));
  };

  const filterOrigenOptions = [
    { id: "api", name: "🩶 From API" },
    { id: "copy", name: "💚 My API Poks" },
    { id: "bdd", name: "❤️ My created Poks" },
    { id: "all", name: "All" },
  ];

  const handleFilterOriginChange = (event) => {
    const selectedValue = event.target.value;
    setFilterByOrigin(selectedValue);
    dispatch(pokemonApplyFilters("filterByOrigin", selectedValue));
    // setRefresh(true);
  };

  const handleFilterTypeChange = (event) => {
    const selectedValue = event.target.value;
    setFilterByType(selectedValue);
    const indexType = filterTypeOptions.findIndex(
      (type) => type.id === selectedValue
    );
    dispatch(pokemonApplyFilters("filterByType", selectedValue));
    // setRefresh(true);
  };

  const multipleFilterOptions = [
    { id: "height", name: "Height" },
    { id: "weight", name: "Weight" },
    { id: "hp", name: "Hit Points" },
    { id: "attack", name: "Attack" },
    { id: "defense", name: "Defense" },
    { id: "speed", name: "Speed" },
  ];

  const handleMultipleFilterChange = (event) => {
    const selectedField = event.target.name;
    const selectedValue = event.target.value;
    // let filtros = { ...filterByXOK };
    // filtros[selectedField] = selectedValue;
    // setFilterByXOK(filtros);
    // if (selectedField === "filterSelect")
    //   setFilterByX(filterByXOK.filterSelect);
    // if (selectedField === "operator")
    //   setFilterByXoperator(filterByXOK.operator);
    // if (selectedField === "compareValue")
    //   setfilterByXvalue(filterByXOK.compareValue);
    // setFilterByXOK(filtros);
    if (selectedField === "filterSelect") {
      setFilterByX(selectedValue);
    }
    if (selectedField === "operator") {
      setFilterByXoperator(selectedValue);
    }
    if (selectedField === "compareValue") {
      setfilterByXvalue(selectedValue);
    }
    if (filterByX && filterByXoperator && filterByXvalue) {
      if (selectedField === "compareValue") {
        //para que me mande el valor completo
        dispatch(
          pokemonApplyMultipleFilters({
            filterByX,
            filterByXoperator,
            filterByXvalue: selectedValue,
          })
        );
      } else {
        dispatch(
          pokemonApplyMultipleFilters({
            filterByX,
            filterByXoperator,
            filterByXvalue,
          })
        );
      }
    }

    // filterByXOK, setFilterByXOK
  };

  return (
    <div>
      <div className={style.container}>
        <div className={style.navsContainer}>
          <div className={style.searchContainer}>
            <SearchBar
              handleOrder={handleOrder}
              handleClickSearch={handleClickSearch}
              handleChangeSearch={handleChangeSearch}
              searchTerm={filterByName}
            />
          </div>
          <div className={style.filtersContainer}>
            <FilterBar
              key="origen"
              options={filterOrigenOptions}
              tittleOption="Origin"
              selectedOption={filterByOrigin}
              isMultiple={false}
              onFilterChange={handleFilterOriginChange}
            />
            <FilterBar
              key="type"
              options={[...filterTypeOptions, { id: "all", name: "All" }]}
              tittleOption="Type"
              selectedOption={filterByType}
              isMultiple={false}
              onFilterChange={handleFilterTypeChange}
            />
            <FilterBar
              key="multipleFilter"
              options={multipleFilterOptions}
              tittleOption="..."
              selectedOption={filterByX}
              isMultiple={true}
              operator={filterByXoperator}
              compareValue={filterByXvalue}
              onFilterChange={handleMultipleFilterChange}
            />
            <div className={style.buttonContainer}>
              <button
                onClick={handleResetFilters}
                className={style.cleanButton}
              >
                <Tooltip text="Clean filters">Clean </Tooltip>
              </button>
            </div>
          </div>
          <Tooltip text="Toggle view">
            {isTableView ? (
              <button className={style.createButton} onClick={toggleView}>
                📅 Cards
              </button>
            ) : (
              <button className={style.createButton} onClick={toggleView}>
                📄 List
              </button>
            )}
          </Tooltip>
          <div className={style.buttonContainer}>
            <Link to="/create">
              <Tooltip text="Create a new Pokemon">
                <button className={style.createButton}>New Pok</button>
              </Tooltip>
            </Link>
          </div>
        </div>
      </div>
      <div>
        <APIToolBar />
      </div>
      {isTableView ? (
        <TableView pokemonData={displayedPokemons} />
      ) : (
        <div>
          <CardsContainer cards={displayedPokemons} />
        </div>
      )}
    </div>
  );
};
export default Home;
