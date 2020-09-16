import React, {useState, useEffect} from 'react';
import {useParams} from "react-router-dom";
import {EditorState, convertFromRaw} from 'draft-js';
import {Editor} from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {PagesCollection} from "../../../api/pages";
import {stateToHTML} from "draft-js-export-html";
import {Categories} from "../../../api/categories";
import {TeamsCollection} from "../../../api/teams";
import {Metadata} from "../../../api/metadata";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faEye, faTrash} from "@fortawesome/free-solid-svg-icons";
import {useHistory} from "react-router-dom";

export const PageView = () => {
    let {id} = useParams();
    const history = useHistory();
    const [page, setPage] = useState({
        _id: 0,
        content: null,
        createdAt: 0,
        title: '',
        category: {title: ""},
        team: {title: ""}
    });
    // useEffect(() => {
    //     const p = PagesCollection.findOne({_id: id});
    //     if (p) {
    //         setPage({
    //             _id: p._id,
    //             content: p.content,
    //             createdAt: p.createdAt,
    //             title: p.title,
    //             category: Categories.findOne({_id: p.categoryId})
    //         });
    //     }
    // }, []);
    useEffect(() => {
        const p = PagesCollection.findOne({_id: id});
        if (p) {
            const category = Categories.findOne({_id: p.categoryId});
            const team = TeamsCollection.findOne({_id: p.teamId});
            const metadata = Metadata.findOne({_id: p.metadataId});
            setPage({
                _id: p._id,
                content: p.content,
                createdAt: p.createdAt,
                title: p.title,
                category: category,
                metadata: metadata,
                team: team
            });
        }
    }, [id]);
    return (
        <div className="border mt-3 rounded-lg p-3 page-view">
            <div className="blog-header">
                <div className="container">
                    <h1>Title: {page.title}</h1>
                    <p className='page-category-subtitle'>Category: {page.category.title}</p>
                    <p className='page-category-subtitle'>Team: {page.team.title}</p>

                    <button type="button" className="btn btn-default" onClick={() => {
                        history.push("/pages/update/" + id);
                    }}>
                        Edit: <FontAwesomeIcon aria-hidden="true" icon={faEdit}/>
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
                                history.push("/pages/delete/" + id);
                            }
                        });
                    }}>
                       Delete: <FontAwesomeIcon aria-hidden="true" icon={faTrash}/>
                    </button>
                </div>
            </div>

            <div className="container border-bottom mb-4 pb-4">
                <h4>Metadata</h4>
                <div>Target Group: {page.metadata?.targetGroup}</div>
                <div>Usecase: {page.metadata?.usecase}</div>
                <div>Contact Person: {page.metadata?.contactPerson}</div>
                {page.category.title === "Tool" ? <div>Link: {page.metadata?.link}</div> : null}

            </div>
            <div className="container mt-2">
                <div className='border-bottom pb-3 mb-3'>
                    <h4>Page Content</h4>
                </div>
                <div>

                    <div dangerouslySetInnerHTML={{__html: page.content}}/>
                </div>
            </div>
        </div>
    );
};
