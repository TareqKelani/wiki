import React, {useEffect} from 'react';
import {useParams} from "react-router-dom";
import {PagesCollection} from "../../../api/pages";
import {useHistory} from "react-router-dom";

export const DeletePage = () => {
    let {id} = useParams();
    const history = useHistory();

    useEffect(() => {
        PagesCollection.update({_id: id}, {deletedAt: new Date()});
        history.push("/pages/");
    }, []);
    return <div></div>;
};
