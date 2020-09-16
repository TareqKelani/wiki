import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const Metadata = new Mongo.Collection('metadata');


Metadata.schema = new SimpleSchema({
    targetGroup: {type: String},
    usecase: {type: String},
    contactPerson: {type: String},
    link: {type: String},
});
