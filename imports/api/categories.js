import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import {Meta} from "./meta";

export const Categories = new Mongo.Collection('categories');


Categories.schema = new SimpleSchema({
    title: {type: String},
    meta: {type: Array},
    'meta.$': {
        type: Meta,
    },
    createdAt: {type: Date}
});

// Meteor.methods({
//     'categories.addCategory'({title, createdAt}) {
//         Categories.schema.validate({title, createdAt});
//         Categories.insert({title, createdAt});
//     }
// });


