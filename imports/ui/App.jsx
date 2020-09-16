import React from 'react';
import {Header} from './components/Header';
import {SideBarMenu} from "./components/SideBarMenu";
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Pages from "./components/Pages";
import Index from "./components/Index";
import {PagesCollection} from "../api/pages";
import {useTracker} from "meteor/react-meteor-data";
import {PageForm} from "./components/pages/pageForm";
import {PageView} from "./components/pages/pageView";
import {DeletePage} from "./components/pages/deletePage";

export const App = () => {
    const pages = useTracker(() => PagesCollection.find({}, {sort: {createdAt: -1}}).fetch());

    return (
        <div>
            <BrowserRouter>
                <Header/>
                <div className="container-fluid">
                    <div className="row">
                        <SideBarMenu pages={pages}/>
                        <div className="col-md-9 ml-sm-auto col-lg-10 px-md-4">
                            <Switch>
                                <Route path="/pages/update/:id" component={() => <PageForm/>}/>
                                <Route path="/pages/delete/:id" component={() => <DeletePage/>}/>
                                <Route path="/pages/new" component={() => <PageForm/>}/>
                                <Route path="/pages/:id" exact component={() => <PageView/>}/>
                                <Route path="/pagesList" component={() => <Pages pages={pages}/>}/>
                                <Route path="/" component={() => <Pages pages={pages}/>}/>


                            </Switch>
                        </div>
                    </div>
                </div>
            </BrowserRouter>
        </div>
    );
};
