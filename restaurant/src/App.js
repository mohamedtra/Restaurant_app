import React, {Component} from 'react';

// Dependencies
import _ from 'lodash';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlus, faEdit, faTrash} from '@fortawesome/free-solid-svg-icons';

// Components
import FormulaireInsertion from './components/formulaireInsertion';
import FormulaireModification from './components/formulaireModification';
import Pagination from './components/pagination';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            restaurants: [],
            displayNumber: 5,
            currentPage: 0,
            query: '',
            filteredrestaurants: [],
            cRestaurants: null,
            elementCount: null,
            modifMod: false,
            insertMod: false,
            colMod: false,
            showMessage: false,
            message: '',
            selectedForModification: null
        }
    }

    componentDidMount() {
        this.countRestaurants('/api/restaurants/count').then(() => {
            this.getDataFromServer(`/api/restaurants?page=${this.state.currentPage}&pagesize=${this.state.displayNumber}`);
        });
    }

    getDataFromServer = url => {
        console.log("--- GETTING DATA ---");
        return fetch(url)
            .then(response => {
                response.json().then(res => {
                    this.setState(prevState => ({
                        ...prevState,
                        restaurants: res.data,
                        filteredrestaurants: res.data
                    }));
                })
            })
            .catch(err => {
                console.log("erreur dans le get : " + err)
            });
    };

    removeRestaurant = id => {
        const url = `/api/restaurants/${id}`;
        fetch(url, {method: "DELETE"})
            .then(() => this.countRestaurants('/api/restaurants/count'))
            .then(() => this.getDataFromServer(`/api/restaurants?page=${this.state.currentPage}&pagesize=${this.state.displayNumber}`))
            .then(() => this.setState(prevState => ({
                message: 'Ce restaurant a été supprimé',
                showMessage: true
            }), () => setTimeout(() => this.setState({
                showMessage: false
            }), 3000)))
            .catch(function (err) {
                console.log(err);
            });
    };

    showRestaurant = rest => {
        this.setState({
            selectedForModification: rest,
            colMod: true,
            insertMod: false,
        }, () => setTimeout(() => this.setState({
            modifMod: true
        }), 300));
    };

    confirmUpdateRestaurant = formData => {
        const url = `/api/restaurants/${formData.get("_id")}`;
        fetch(url, {
            method: "PUT",
            body: formData
        })
            .then(() => this.getDataFromServer(`/api/restaurants?page=${this.state.currentPage}&pagesize=${this.state.displayNumber}`))
            .then(() => this.setState(prevState => ({
                colMod: false,
                modifMod: false,
                selectedForModification: {
                    name: formData.get("nom"),
                    cuisine: formData.get("cuisine")
                },
                message: 'Ce restaurant a été modifié',
                showMessage: true
            }), () => setTimeout(() => this.setState({
                showMessage: false
            }), 3000)))
            .catch(function (err) {
                console.log(err);
            });
    };

    showInsertForm = () => {
        this.setState({
            colMod: true,
            modifMod: false
        }, () => setTimeout(() => this.setState({insertMod: true}), 300));
    };

    addRestaurant = formData => {
        const url = "/api/restaurants";
        fetch(url, {
            method: "POST",
            body: formData
        })
            .then((responseJSON) => {
                responseJSON.json()
                    .then(res => {
                        this.setState(prevState => ({
                            colMod: false,
                            insertMod: false,
                            filteredrestaurants: [{
                                _id: res.result,
                                name: formData.get("nom"),
                                cuisine: formData.get("cuisine"),
                            }, ...prevState.filteredrestaurants],
                            message: 'Ce restaurant a été ajouté',
                            showMessage: true
                        }), () => setTimeout(() => this.setState({
                            showMessage: false
                        }), 3000));
                    });
            })
            .catch(function (err) {
                console.log(err);
            });
    };

    countRestaurants = (gurl) => {
        let url = gurl;
        return fetch(url)
            .then(response => {
                console.log(url, response);
                response.json().then(res => {
                    this.setState(prevState => ({
                        elementCount: res.data,
                        cRestaurants: Math.ceil(res.data / prevState.displayNumber)
                    }));
                });
            }).catch(function (err) {
                console.log(err);
            });
    };

    search = _.debounce(
        function () {
            let url = `/api/restaurants?page=${this.state.currentPage}&pagesize=${this.state.displayNumber}&name=${this.state.query}`;
            fetch(url)
                .then(response => {
                    response.json().then(res => {
                        this.setState(prevState => ({
                            filteredrestaurants: res.data,
                            cRestaurants: res.count ? Math.ceil(res.count / prevState.displayNumber) : prevState.cRestaurants
                        }));
                    })
                })
                .catch(err => {
                    console.log("erreur dans le get : " + err)
                });
        },
        300
    );

    navigate = currentPage => {
        const url = this.state.query.length > 0 ?
            `/api/restaurants?page=${currentPage}&pagesize=${this.state.displayNumber}&name=${this.state.query}` :
            `/api/restaurants?page=${currentPage}&pagesize=${this.state.displayNumber}`;

        this.setState({currentPage}, () => this.getDataFromServer(url));
    };

    // Handlers
    handleDisplayNumberChange = event => {
        const displayNumber = event.target.value;
        const url = `/api/restaurants?page=${this.state.currentPage}&pagesize=${displayNumber}`;
        this.getDataFromServer(url)
            .then(this.setState(prevSatate => ({
                displayNumber,
                cRestaurants: Math.ceil(prevSatate.elementCount / displayNumber)
            })));
    }

    handleSearchInputChange = event => {
        const query = event.target.value;
        this.setState({
            query
        }, () => {
            if (!this.state.query.length) {
                this.setState(prevState => ({
                    filteredrestaurants: prevState.restaurants,
                    cRestaurants: Math.ceil(prevState.elementCount / prevState.displayNumber)
                }));
            } else {
                this.search();
            }
        });
    }

    render() {
        return (
            <div className="App">
                <div className="container" style={{position: "relative"}}>
                    <br/>
                    <h2>Table des restaurants</h2>
                    <button
                        type="button"
                        className="btn btn-dark mb-3"
                        id="createButton"
                        onClick={this.showInsertForm}>
                        <FontAwesomeIcon icon={faPlus}/>
                    </button>
                    {this.state.showMessage ? (
                        <div style={{
                            position: "absolute",
                            top: "15px",
                            zIndex: "100",
                            right: "15px",
                            left: "15px",
                            transition: "0.2s"
                        }} id="succesAlert" className="alert alert-success" role="alert">
                            <h6 className="alert-heading">Opération réussie</h6>
                            <p>{this.state.message}</p>
                        </div>
                    ) : null}
                    <div className="row">
                        <div id="tableArea" className={this.state.colMod ? 'col-lg-8' : 'col-lg-12'}
                             style={{transition: "0.2s"}}>
                            <div className="input-group mb-3">
                                <div className="input-group-prepend">
                                    <label className="input-group-text" htmlFor="elementPageDropDown">Elements par
                                        page
                                    </label>
                                </div>
                                <select
                                    value={this.state.displayNumber}
                                    onChange={this.handleDisplayNumberChange}
                                    className="custom-select"
                                    id="elementPageDropDown">
                                    <option value="5">5</option>
                                    <option value="10">10</option>
                                    <option value="15">15</option>
                                </select>
                            </div>
                            <div className="input-group mb-3">
                                <input
                                    id="searchInput"
                                    className="form-control"
                                    placeholder="Chercher par nom"
                                    value={this.state.query}
                                    onChange={this.handleSearchInputChange}/>
                            </div>
                            <table className="table table-bordered" id="myTable">
                                <thead className="thead-dark">
                                    <tr>
                                        <th>Nom</th>
                                        <th>Cuisine</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>{this.state.filteredrestaurants.map((restaurant, index) => (
                                    <tr key={index}>
                                        <td>{restaurant.name}</td>
                                        <td>{restaurant.cuisine}</td>
                                        <td>
                                            <button
                                                className="btn btn-dark"
                                                onClick={() => this.showRestaurant(restaurant)}>
                                                <FontAwesomeIcon icon={faEdit}/>
                                            </button>
                                            <button
                                                className="btn btn-dark"
                                                onClick={() => this.removeRestaurant(restaurant._id)}>
                                                <FontAwesomeIcon icon={faTrash}/>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                            <br/>
                            <Pagination onButtonClick={this.navigate} lastPage={this.state.cRestaurants}/>
                        </div>
                        {this.state.modifMod ? <FormulaireModification
                            onUpdateRestaurant={this.confirmUpdateRestaurant}
                            restaurant={this.state.selectedForModification}/> : null}
                        {this.state.insertMod ? <FormulaireInsertion onAddResstaurant={this.addRestaurant}/> : null}
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
