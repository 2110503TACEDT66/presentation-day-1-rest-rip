const mongoose = require('mongoose');

const workinSpaceSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true, 'Please add a name'],
        unique : true,
        trim : true,
        maxLength : [50, 'Name can not be more than 50 characters']
    },
    address : {
        type : String,
        required : [true, 'Please add an address']
    },
    district : {
        type : String,
        required : [true, 'Please add district']
    },
    province : {
        type : String,
        required : [true, 'Please add a province']
    },
    postalcode : {
        type : String,
        required : [true, 'Please add a postalcode'],
        maxLength : [5, 'Postal code can not be more than 5 digits']
    },
    tel : {
        type: String
    },
    region : {
        type : String,
        required : [true, 'Please add a region']
    }

    
}, {
    toJSON : {virtuals : true},
    toObject : {virtuals : true}
});

workinSpaceSchema.pre('deleteOne', {document : true, query: false}, async function(next){
    console.log(`Reservation being removed from working space ${this._id}`);
    await this.model('Reservation').deleteMany({workingSpace: this._id});
    next();
});

workinSpaceSchema.virtual('reservation',{
    ref : 'Reservation',
    localField : '_id',
    foreignField : 'workingSpace',
    justOne : false
});

module.exports = mongoose.model('WorkingSpace', workinSpaceSchema);