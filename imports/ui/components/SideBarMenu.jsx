import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import {PagesCollection} from "../../api/pages";
import {Meteor} from "meteor/meteor";

export const SideBarMenu = (props) => {
    const {pages} = props;
    const [searchText, setSearchText] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        setSearchResults(pages);
    }, [pages]);
    useEffect(() => {

        if (searchText.trim() === '') {
            const arr = PagesCollection.find({}, {sort: {createdAt: -1}}).fetch();
            setSearchResults(arr);
        } else {

            Meteor.call("pagesCollection.findPage", {searchText: searchText}, (err, res) => {
                if (res) {
                    setSearchResults(res);
                }
            });
        }
    }, [searchText]);

    return (
        <nav id="sidebarMenu" className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
            <div className="sidebar-sticky pt-3 sidebar-scrolly">
                <ul className="nav flex-column">
                    {searchResults.filter((p) => {
                        return !p.deletedAt;
                    }).map(page => {
                        return <li key={page._id} className="nav-item">
                            <Link className="nav-link active"
                                  to={`/pages/${page._id}`}> {page.title}</Link>
                        </li>;
                    })}
                </ul>
                <div className="nav-footer">
                    <input
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="form-control"
                        type="text"
                        placeholder="Search"
                    />
                </div>
            </div>

        </nav>
    );
};
