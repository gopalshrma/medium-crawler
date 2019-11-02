const mongoose = require('mongoose');
const db = require('../config/db');

const url_schema = new mongoose.Schema(
    { 
        error: {
            type: Object,
            required: true
        }
    },
    {
        timestamps: true,
        strict: true
    }
);

module.exports = db.model('url', url_schema);