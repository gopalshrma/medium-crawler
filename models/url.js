const mongoose = require('mongoose');
const db = require('../config/db');

const url_schema = new mongoose.Schema(
    { 
        url: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        count: {
            type: Number,
            required: true,
            default: 1
        },
        params: [{
            type: String,
            required: true
        }],
        scraped: {
            type: Boolean,
            required: true,
            default: false
        }
    },
    {
        timestamps: true,
        strictL: true
    }
);

module.exports = db.model('url', url_schema);