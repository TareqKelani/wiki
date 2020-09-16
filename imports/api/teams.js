import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';


export const TeamsCollection = new Mongo.Collection('teams');

TeamsCollection.schema = new SimpleSchema({
    title: {type: String},
    description: {type: String},
    createdAt: {type: Date}
});
