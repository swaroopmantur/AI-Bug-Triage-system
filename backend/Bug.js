const mongoose = require("mongoose");

const bugSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    category: {
    type: String,
    default: "Other"
},

priority: {
    type: String,
    default: "Medium"
},

    severity: {
        type: String,
        default: "Medium"
    },

    status: {
        type: String,
        default: "Open"
    }
});

const Bug = mongoose.model("Bug", bugSchema);

module.exports = Bug;