import React from 'react';
import {Categories} from "../../../api/categories";
import {useHistory} from "react-router-dom";
import {stateToHTML} from "draft-js-export-html";

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEye, faEdit, faTrash} from '@fortawesome/free-solid-svg-icons';
import {convertFromRaw} from "draft-js";
import {TeamsCollection} from "../../../api/teams";

export const Page = ({page}) => {
    const history = useHistory();
    const content = page.content;
    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">{page.title}</h5>
                <h6 className="card-subtitle mb-2 text-muted">Category: {Categories.findOne({_id: page.categoryId})?.title}</h6>
                <h6 className="card-subtitle mb-2 text-muted">Team: {TeamsCollection.findOne({_id: page.teamId})?.title}</h6>

                <p className="card-text"
                   dangerouslySetInnerHTML={{__html: content.length > 100 ? content.slice(0, 100) + ",<br/>..." : content}}
                >
                </p>


            </div>
            <div className="card-footer">
                <button type="button" className="btn btn-default" onClick={() => {
                    history.push("/pages/" + page._id);
                }}>
                    <FontAwesomeIcon aria-hidden="true" icon={faEye}/>
                </button>
                <button type="button" className="btn btn-default" onClick={() => {
                    history.push("/pages/update/" + page._id);
                }}>
                    <FontAwesomeIcon aria-hidden="true" icon={faEdit}/>
                </button>
                <button type="button" className="btn btn-default" onClick={() => {

                    // if (confirm('Are you sure you want to go to that link?'))
                    //     history.push("/pages/remove/" + page._id);
                    new Confirmation({
                        message: "Are you sure you want to delete " + page.title + " ?",
                        title: "Delete confirmation",
                        cancelText: "Cancel",
                        okText: "Ok",
                        success: true, // whether the button should be green or red
                        focus: "cancel" // which button to autofocus, "cancel" (default) or "ok", or "none"
                    }, function (ok) {
                        // ok is true if the user clicked on "ok", false otherwise
                        if (ok) {
                            history.push("/pages/delete/" + page._id);
                        }
                    });
                }}>
                    <FontAwesomeIcon aria-hidden="true" icon={faTrash}/>
                </button>
                <br/>
                <small className="text-muted">
                    {page.updatedAt ?
                        <div>Updated
                            at {new Date(page.updatedAt).toDateString()} - {new Date(page.updatedAt).getHours()}:{new Date(page.updatedAt).getMinutes()}</div> :
                        <div>Added
                            at {new Date(page.createdAt).toDateString()} - {new Date(page.createdAt).getHours()}:{new Date(page.createdAt).getMinutes()}</div>
                    }
                </small>
            </div>
        </div>
    );
};
