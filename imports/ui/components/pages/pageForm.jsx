import React, {useEffect, useState} from 'react';
import {PagesCollection} from "../../../api/pages";
import {Link, useHistory, useParams} from "react-router-dom";
import {Categories} from "../../../api/categories";
import {EditorState} from 'draft-js';
import {Editor} from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {stateToHTML} from "draft-js-export-html";
import {stateFromHTML} from 'draft-js-import-html';
import {TeamsCollection} from "../../../api/teams";
import {Meta} from "../Meta";
import {Metadata} from "../../../api/metadata";

export const PageForm = () => {
    let {id} = useParams();
    const [page, setPage] = useState({
        _id: 0,
        content: null,
        createdAt: 0,
        title: ''
    });
    const [title, setTitle] = useState("");
    const [metaFields, setMetaFields] = useState([]);
    const [metaFieldsValues, setMetaFieldsValues] = useState(['', '', '', '']);
    // let metaFields = [];
    const [categoryId, setCategoryId] = useState("");
    const [teamId, setTeamId] = useState("");
    const [editorState, setEditorState] = React.useState(
        () => EditorState.createEmpty(),
    );
    const [createdAt, setCreatedAt] = useState({});
    const [titleError, setTitleError] = useState("");
    const [categoryIdError, setCategoryIdError] = useState("");
    const [teamIdError, setTeamIdError] = useState("");
    const [contentError, setContentError] = useState("");
    const [targetGroupError, setTargetGroupError] = useState("");
    const [usecaseError, setUsecaseError] = useState("");
    const [contactPersonError, setContactPersonError] = useState("");
    const [metadataError, setMetadataIdError] = useState("");
    const history = useHistory();
    useEffect(() => {
        if (id) {
            const p = PagesCollection.findOne({_id: id});
            if (p) {
                setPage({
                    _id: p._id,
                    content: p.content,
                    createdAt: p.createdAt,
                    updatedAt: p.updatedAt,
                    title: p.title
                });
                setCreatedAt(p.createdAt);
                setTitle(p.title);
                setCategoryId(p.categoryId);
                setTeamId(p.teamId);
                const meta = Metadata.findOne({_id: p.metadataId});
                if (meta) {
                    setMetaFieldsValues([meta.targetGroup, meta.usecase, meta.contactPerson, meta.link]);
                }
                setEditorState(EditorState.createWithContent(stateFromHTML(p.content)));
            }
        } else {
            Meteor.setTimeout(() => { //i know this is a bad practice, but it fixes a bug where if you refresh this page, the collection can't be loaded directly.
                const category = Categories.findOne({}, {sort: {createdAt: 1}, limit: 1});
                const team = TeamsCollection.findOne({}, {sort: {createdAt: 1}, limit: 1});
                setCategoryId(category._id);
                setTeamId(team._id);
                setMetaFields(category.meta);
            }, 1000);

        }

    }, []);
    useEffect(() => {
        if (categoryId && categoryId !== '') {
            setMetaFields(Categories.findOne({_id: categoryId}).meta);
        }
    }, [categoryId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const createdDate = new Date();
        const contentState = editorState.getCurrentContent();
        const cleanText = stateToHTML(contentState).replace(/<\/?[^>]+(>|$)/g, "");
        setTitleError("");
        setCategoryIdError("");
        setContentError("");
        setTeamIdError("");
        setTargetGroupError('');
        setUsecaseError('');
        setContactPersonError('');

        const $metadataId = Metadata.insert({
            targetGroup: metaFieldsValues[0],
            usecase: metaFieldsValues[1],
            contactPerson: metaFieldsValues[2],
            link: metaFieldsValues[3],
        });

        await Meteor.call("pagesCollection.validatePage", {
            title: title.trim(),
            content: cleanText,
            categoryId: categoryId,
            teamId: teamId,
            metadataId: $metadataId,
            createdAt: createdDate,
            updatedAt: new Date()

        }, (error, result) => {
            if (Array.isArray(result)) {
                result.forEach(m => {
                    if (m.field === "title") {
                        setTitleError(m.message);
                    } else if (m.field === "content") {
                        setContentError(m.message);
                    } else if (m.field === "categoryId") {
                        setCategoryIdError(m.message);
                    } else if (m.field === "teamId") {
                        setTeamIdError(m.message);
                    } else if (m.field === "targetGroup") {
                        setTargetGroupError("Target Group" + m.message);
                    } else if (m.field === "usecase") {
                        setUsecaseError("Usecase" + m.message);
                    } else if (m.field === "contactPerson") {
                        setContactPersonError("Contact Person" + m.message);
                    } else if (m.field === "metadataId") {
                        setMetadataIdError("Metadata " + m.message);
                    }
                });
            } else {
                if (!error) {
                    if (id) {
                        PagesCollection.update({_id: id}, {
                            title: title.trim(),
                            categoryId: categoryId,
                            teamId: teamId,
                            content: stateToHTML(contentState),
                            metadataId: $metadataId,
                            createdAt: createdAt,
                            updatedAt: new Date(),
                            deletedAt: null
                        })
                    } else {
                        PagesCollection.insert({
                            title: title.trim(),
                            categoryId: categoryId,
                            teamId: teamId,
                            content: stateToHTML(contentState),
                            createdAt: createdDate,
                            metadataId: $metadataId,
                            updatedAt: null,
                            deletedAt: null
                        });
                    }
                    history.push("/pages");
                }

            }
        });
    };
    return (
        <form className="mt-3" onSubmit={handleSubmit}>
            <div className="col-4">
                <label htmlFor="pageTitle">Title</label>
                <div className="input-group">
                    <input
                        className="form-control"
                        id="pageTitle"
                        type="text"
                        placeholder="Page Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <div className="error-message">
                        {titleError}
                    </div>
                </div>
            </div>
            <div className="form-group col-4">
                <label htmlFor="pageCategory">Page Category</label>
                <select
                    className="form-control"
                    id="pageCategory"
                    name='category'
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}>
                    {Categories.find().map(c =>
                        <option key={c._id} value={c._id}>{c.title}</option>
                    )};
                </select>
                <div className="error-message">
                    {categoryIdError}
                </div>
            </div>
            <div className="form-group col-4">
                <label htmlFor="pageTeam">Team</label>
                <select
                    className="form-control"
                    id="pageTeam"
                    name='team'
                    value={teamId}
                    onChange={(e) => setTeamId(e.target.value)}>
                    {TeamsCollection.find().map(t =>
                        <option key={t._id} value={t._id}>{t.title}</option>
                    )};
                </select>
                <div className="error-message">
                    {teamIdError}
                </div>
            </div>
            <div className="form-group col-4">
                <label htmlFor="pageTeam">Meta Data</label>
                <div className="error-message">
                    {targetGroupError}
                </div>
                <div className="error-message">
                    {usecaseError}
                </div>
                <div className="error-message">
                    {contactPersonError}
                </div>
                {
                    metaFields.map((mf, index) => {
                        return <div className="form-group">
                            <label htmlFor={mf.fieldName + "_id"}>{mf.fieldName}</label>
                            <input
                                className="form-control"
                                id={mf.fieldName + "_id"}
                                type="text"
                                placeholder={mf.fieldName}
                                value={metaFieldsValues[index]}
                                onChange={(e) => {
                                    let newArr = [...metaFieldsValues]; // copying the old meta array
                                    newArr[index] = e.target.value;
                                    setMetaFieldsValues(newArr);
                                }
                                }
                            />
                        </div>;
                    })
                }
                {/*<div className="error-message">*/}
                {/*    error*/}
                {/*</div>*/}
            </div>

            <div className="form-group col-10">
                <label>Page Content</label>
                <div className="error-message">
                    {contentError}
                </div>
                <Editor editorState={editorState} wrapperClassName="rich-editor demo-wrapper"
                        editorClassName="demo-editor"
                        onEditorStateChange={setEditorState} placeholder="The message goes here..."/>
            </div>
            <div className="form-group col-4">
                <button className="btn btn-primary" type="submit">{id ? 'Update Page' : 'Add Page'}</button>
            </div>
        </form>
    );
};
