const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReportSchema = new Schema({
    post: { type: Schema.Types.ObjectId, required: true },
    author: { type: Schema.Types.ObjectId },
    name: { type: String },
    avatar: { type: String },
    text: { type: String },
    reports: [
        {
            user: { type: Schema.Types.ObjectId, required: true },
            subject: { type: String, required: true },
            detail: { type: String },
        }
    ],
})

module.exports = mongoose.model('Report', ReportSchema)