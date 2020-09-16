import {Meteor} from 'meteor/meteor';
import {Categories} from "../imports/api/categories";
import {PagesCollection} from "../imports/api/pages";
import {TeamsCollection} from "../imports/api/teams";
import {Metadata} from "../imports/api/metadata";
import {Meta} from "../imports/api/meta";

function insertCategory(obj) {
    // Categories.schema.validate(obj);
    Categories.insert(obj);
}

function insertTeam(obj) {
    TeamsCollection.schema.validate(obj);
    TeamsCollection.insert(obj);
}

function insertPage(obj) {
    PagesCollection.insert(obj);
}

Meteor.startup(() => {
    // Categories.remove({});
    const targetMeta = new Meta("Target Group", false);
    const usecaseMeta = new Meta("Usecase", false);
    const contactPersonMeta = new Meta("Contact person", false);
    const linkMeta = new Meta("Link", true);
    if (Categories.find().count() === 0) {
        [
            {
                title: 'Tool',
                meta: [
                    targetMeta,
                    usecaseMeta,
                    contactPersonMeta,
                    linkMeta

                ],
                createdAt: new Date()
            },
            {
                title: 'Process',
                meta: [
                    targetMeta,
                    usecaseMeta,
                    contactPersonMeta,
                ],
                createdAt: new Date()
            },
            {
                title: 'Template',
                meta: [
                    targetMeta,
                    usecaseMeta,
                    contactPersonMeta,
                ],
                createdAt: new Date()
            },
            {
                title: 'Resource',
                meta: [
                    targetMeta,
                    usecaseMeta,
                    contactPersonMeta,
                ],
                createdAt: new Date()
            },
        ].forEach(insertCategory);
    }

    // PagesCollection.remove({});
    // TeamsCollection.remove({});

    if (TeamsCollection.find({}).count() === 0) {
        [
            {
                title: "Development",
                description: "Development team",
                createdAt: new Date
            },
            {
                title: "Marketing",
                description: "Marketing team",
                createdAt: new Date
            },
            {
                title: "Sales",
                description: "Sales team",
                createdAt: new Date
            },
        ].forEach(insertTeam);
    }
    // Metadata.remove({});
});
