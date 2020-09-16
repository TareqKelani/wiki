import React from 'react';
import {Page} from "./pages/page";
import {Link} from "react-router-dom";

class Pages extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    render() {
        return (
            <div>
                <Link to='/pages/new'>
                    <button className="btn btn-primary btn-sm mt-3">
                        Add Page
                    </button>
                </Link>
                <div className="card-deck pt-3">
                    {this.props.pages.filter((p) => {
                        return !p.deletedAt;
                    }).map(page => {
                        return <Page page={page} key={page._id}/>;
                    })}
                </div>
                {/*<button type="button" className="btn btn-primary btn-sm mt-3">Add Page</button>*/}


            </div>
        );
    }
}

export default Pages;
