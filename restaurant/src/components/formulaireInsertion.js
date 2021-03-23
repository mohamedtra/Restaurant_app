import React, {Component, createRef} from 'react';

export default class FormulaireInsertion extends Component {
    constructor(props) {
        super(props);
        this.formRef = createRef();
    }

    handleAddRestaurant = event => {
        event.preventDefault();
        this.props.onAddResstaurant(new FormData(this.formRef.current));
    }

    render() {
        return (
            <div className="col-lg-4" style={{transition: "1s"}}>
                <div className="card">
                    <div className="card-body">
                        <form ref={this.formRef}>
                            <div className="form-group">
                                <label htmlFor="restaurantInput">Nom</label>
                                <input
                                    className="form-control"
                                    id="restaurantInputI"
                                    type="text"
                                    name="nom"
                                    required
                                    placeholder="Michel's restaurant"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="cuisineInput">Cuisine</label>
                                <input
                                    className="form-control"
                                    id="cuisineInputI"
                                    type="text"
                                    name="cuisine"
                                    required
                                    placeholder="Michel's cuisine"
                                />
                            </div>
                            <button className="btn btn-dark" onClick={this.handleAddRestaurant}>Créer restaurant
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}
