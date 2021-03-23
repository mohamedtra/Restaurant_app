import React, {Component, createRef} from 'react';

export default class FormulaireModification extends Component {
    constructor(props) {
        super(props);
        this.formRef = createRef();
    }

    handleUpdateRestaurant = event => {
        event.preventDefault();
        this.props.onUpdateRestaurant(new FormData(this.formRef.current))
    }

    render() {
        return (
            <div className="col-lg-4" style={{transition: "1s"}}>
                <div className="card">
                    <div className="card-body">
                        <form ref={this.formRef}>
                            <div className="form-group">
                                <label htmlFor="idInput">Id :</label>
                                <input
                                    className="form-control"
                                    id="idInput"
                                    type="text"
                                    name="_id"
                                    required
                                    placeholder="Id du restaurant à modifier"
                                    defaultValue={this.props.restaurant._id || "56b9f89be0adc7f00f348cf6"}/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="restaurantInput">Nom</label>
                                <input
                                    className="form-control"
                                    id="restaurantInput"
                                    type="text"
                                    name="nom"
                                    required
                                    placeholder="Michel's restaurant"
                                    defaultValue={this.props.restaurant.name}/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="cuisineInput">Cuisine</label>
                                <input
                                    className="form-control"
                                    id="cuisineInput"
                                    type="text"
                                    name="cuisine"
                                    required
                                    placeholder="Michel's cuisine"
                                    defaultValue={this.props.restaurant.cuisine}/>
                            </div>
                            <button
                                className="btn btn-dark"
                                onClick={this.handleUpdateRestaurant}
                            >Modifier ce restaurant
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}
