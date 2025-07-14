 
import mongoose, { Schema, model } from 'mongoose';

const contactsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      required: true,
      enum: ['work','home', 'personal'],
      default: 'personal',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    photo: {
      type: String,
      required: false,
      default:null,
    },
  },
  {
    timestamps: true,
  },
);

export const Contact = model('Contact', contactsSchema); 