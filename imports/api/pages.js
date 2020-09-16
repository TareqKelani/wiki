import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import {Categories} from "./categories";
import {TeamsCollection} from "./teams";
import {Metadata} from "./metadata";


export const PagesCollection = new Mongo.Collection('pages');


PagesCollection.schema = new SimpleSchema({
    title: {type: String},
    content: {type: Object},
    categoryId: {type: String},
    teamId: {type: String},
    metadataId: {type: String},
    createdAt: {type: Date},
    updatedAt: {type: Date},
    deletedAt: {type: Date},
});
Meteor.methods({
    'pagesCollection.validatePage'({title, content, categoryId, teamId, metadataId, createdAt, updatedAt, deletedAt}) {
        const simpleSchema = new SimpleSchema({
            title: {type: String, required: true},
            content: {type: String, required: true},
            categoryId: {type: String, required: true},
            teamId: {type: String, required: true},
            metadataId: {type: String, required: false},
            createdAt: {type: Date, required: true},
            updatedAt: {type: Date, optional: true},
            deletedAt: {type: Date, optional: true},
        });
        const validationContext = simpleSchema.newContext();
        validationContext.validate({title, content, categoryId, teamId, metadataId, createdAt, updatedAt, deletedAt});
        let messages = [];
        if (title.length === 0) {
            validationContext.addValidationErrors([{name: 'title', type: 'required'}]);
        }
        if (content.length === 0) {
            validationContext.addValidationErrors([{name: 'content', type: 'required'}]);

        }
        const category = Categories.findOne({_id: categoryId});
        if (categoryId) {
            if (!category) {
                validationContext.addValidationErrors([{name: 'categoryId', type: 'required'}]);
            }
        }
        const team = TeamsCollection.findOne({_id: teamId});
        if (teamId) {
            if (!team) {
                validationContext.addValidationErrors([{name: 'teamId', type: 'required'}]);
            }
        }
        let o = true;

        if (metadataId) {
            const metadata = Metadata.findOne({_id: metadataId});
            if (metadata) {
                if (metadata.targetGroup.length === 0) {
                    validationContext.addValidationErrors([{name: 'targetGroup', type: 'required'}]);
                    o = false;
                }
                if (metadata.usecase.length === 0) {
                    validationContext.addValidationErrors([{name: 'usecase', type: 'required'}]);
                    o = false;
                }
                if (metadata.contactPerson.length === 0) {
                    validationContext.addValidationErrors([{
                        name: 'contactPerson',
                        type: 'required'
                    }]);
                    o = false;
                }
            } else {
                validationContext.addValidationErrors([{name: 'metadataId', type: 'required'}]);
                o = false;
            }
            if (!o) {
                Metadata.remove({_id: metadataId});
            }
        } else {
            validationContext.addValidationErrors([{name: 'metadataId', type: 'required'}]);
            o = false;
        }


        if (!validationContext.isValid()) {
            validationContext.validationErrors().forEach(e => {
                messages.push({
                    field: e.name,
                    message: validationContext.keyErrorMessage(e.name)
                });

            });
            return messages;
        }
    }
});

Meteor.methods({
    'pagesCollection.addPage'({title, content, categoryId, teamId, createdAt, updatedAt, deletedAt}) {
        new SimpleSchema({
            title: {type: String, required: true, min: 3},
            content: {type: Object, required: true},
            categoryId: {type: String, required: true},
            teamId: {type: String, required: true},
            createdAt: {type: Date, required: true},
            updatedAt: {type: Date},
            deletedAt: {type: Date},
        }).validate({title, content, categoryId, teamId, createdAt, updatedAt, deletedAt});
        PagesCollection.insert({title, content, categoryId, teamId, createdAt, updatedAt, deletedAt});
    }
});

Meteor.methods({
    'pagesCollection.findPage'({searchText}) {
        const arr = PagesCollection.find({}).fetch();
        let result = [];

        arr.filter((p) => {
            return !p.deletedAt;
        }).forEach((p) => {
            const category = Categories.findOne({_id: p.categoryId});
            const team = TeamsCollection.findOne({_id: p.teamId});
            const meta = Metadata.findOne({_id: p.metadataId});
            searchText = searchText.toLowerCase();
            if (p.title.toLowerCase().includes(searchText) || p.content.toLowerCase().includes(searchText) || category.title.toLowerCase().includes(searchText) || team.title.toLowerCase().includes(searchText)
                || meta.targetGroup.toLowerCase().includes(searchText) || meta.usecase.toLowerCase().includes(searchText) || meta.contactPerson.toLowerCase().includes(searchText) || (category.title.toLowerCase() === 'tool' && meta.link.toLowerCase().includes(searchText))
            ) {
                result.push(p);
            }
        });
        return result;
    }
})
;
