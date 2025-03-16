import mongoose from "mongoose"

const memberSchema = new mongoose.Schema({
    first_name : {
        type: String,
        required: true
    },
    last_name : {
        type: String,
        required: true
    },
    date_of_birth : {
        type: Date,
        required: true
    },
    address: {
        type: String,
        requried: true
    },
    phone_number : {
        type: Number,
        requried: true
    },
    email : {
        type: String,
        requried: true
    },
    gender: {
        type: String,
        required: true
    },
    salutation: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    is_active : {
        type: Boolean,
        default: false
    },
    updated_date: {
        type: Date,
        default: Date.now
      }
    });

const Member = mongoose.model("Member", memberSchema);
export default Member;