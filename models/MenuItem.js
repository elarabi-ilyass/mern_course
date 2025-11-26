const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    name: {

    // The data type must be a string
    type: String,

    // This field is required (cannot be missing)
    required: true,

    // Remove spaces at the start and end
    trim: true,

    // Maximum allowed length is 100 characters
    maxlength: 100,

    // Allowed characters: letters, numbers, and spaces
    pattern: /^[a-zA-Z0-9\s]+$/,

    // Message shown if pattern fails
    patternMessage: 'Name can only contain alphanumeric characters and spaces',

    // Include this field when selecting from DB
    select: true,

    // Enable full-text search on this field
    fulltext: true,

    // Automatically generate suggestions for search
    generate: true,

    // Highlight matched terms in search results
    highlight: true,

    // Allow auto-suggest feature
    suggest: true,

    // Allow sorting by this field
    sortable: true,

    // Allow faceted filtering (grouping)
    facetable: true,

    // Allow filtering (where conditions)
    filterable: true,

    // Make this field searchable
    searchable: true,

    // Allow aggregation on this field (count, group, etc.)
    aggregatable: true,

    // Create a database index for faster search
    index: true,

    // Not unique (multiple documents can have the same name)
    unique: false,

    // Do not use sparse indexing
    sparse: false,

    // Value can be changed after creation
    immutable: false,

    // Default value if none is provided
    default: 'New Menu Item',

    // Custom validation rule
    validate: {
      // Validator function: value must be non-empty
      validator: function(v) {
        return v && v.length > 0;
      },
      // Error message if validation fails
      message: 'Name cannot be empty'
    },

    // Field cannot be null
    nullable: false,

    // Field can be read
    readOnly: false,

    // Field can be written/updated
    writeOnly: false,

    // Do not hide this field from JSON outputs
    hidden: false,

    // Make field visible in API/schema definitions
    visible: true,

    // Alias: optional second name for the field
    alias: 'menuItemName',

    // Example value for documentation / API UI
    example: 'Caesar Salad',
  },

  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['Appetizer', 'Main Course', 'Dessert','Glace' ,'Beverage', 'Side Dish']
  },
  isVegetarian: {
    type: Boolean,
    default: false
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  preparationTime: {
    type: Number, // in minutes
    default: 15
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  }
}, {
  timestamps: true
});

// Index for better query performance
menuItemSchema.index({ restaurant: 1, category: 1 });

module.exports = mongoose.model('MenuItem', menuItemSchema);