import React from 'react';
import {Link, NavLink} from "react-router-dom";

export const Header = () => (
    <nav className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
        <Link to="/pagesList" className="navbar-brand col-md-3 col-lg-2 mr-0 px-3">Wiki</Link>
        {/*<button className="navbar-toggler position-absolute d-md-none collapsed" type="button"*/}
        {/*        data-toggle="collapse" data-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false"*/}
        {/*        aria-label="Toggle navigation">*/}
        {/*    <span className="navbar-toggler-icon"></span>*/}
        {/*</button>*/}
        {/*<Link to="/pages" className="col-md-3 col-lg-2 mr-0 px-3">Pages</Link>*/}
        <ul className="navbar-nav mr-auto ml-2">
            <li className="nav-item">
                {/*<a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>*/}
                {/*<Link to="/pages" className="nav-link">Pages</Link>*/}
                <NavLink to="/pagesList" className="nav-link" activeClassName="active">Pages</NavLink>
            </li>

        </ul>

        <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap">
                {/*<a className="nav-link" href="#">Sign out</a>*/}
            </li>
        </ul>
    </nav>
);