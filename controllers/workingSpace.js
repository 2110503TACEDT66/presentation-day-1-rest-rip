const WorkingSpace = require('../models/WorkingSpace');
// const vacCenter = require('../models/VacCenter');


exports.getWorkingSpaces = async (req, res, next) => {
    try{
        let query;
       
        const reqQuery = {...req.query};
      
        const removeFields = ['select','sort','page','limit'] ;

        removeFields.forEach(param => delete reqQuery[param]);
        // console.log(reqQuery);

        let queryStr = JSON.stringify(req.query);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
        // const hospitals = await Hospital.find(req.query);
        // console.log(req.query);
        //   console.log("here");
          
        if(req.user && req.user.role === 'admin'){
            console.log("here");
            query = WorkingSpace.find(JSON.parse(queryStr)).populate('reservation');
        }else{
            console.log("workingSpace not admin or no authorization");
            query = WorkingSpace.find(JSON.parse(queryStr));
        }


        if(req.query.select){
            const fields = req.query.select.split(',').join(' ');
            query = query.select(fields);
        }

        if(req.query.sort){
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('name');
        }

        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit,10) || 25;
        const startIndex = (page-1) * limit;
        const endIndex = page * limit;
        const total = await WorkingSpace.countDocuments();

        query = query.skip(startIndex).limit(limit);

        const workingSpaces = await query; 

        const pagination = {};
        if (endIndex < total){
            pagination.next = {
                page: page+1,
                limit
            }
        }

        if(startIndex > 0){
            pagination.prev = {
                page : page - 1,
                limit
            }
        }

        res.status(200).json({success:true, count : workingSpaces.length, pagination, data : workingSpaces});
        
    }catch(err){
        res.status(400).json({success : false});
    }

};

exports.getWorkingSpace = async(req, res, next) => {
    try{
        const workingSpaces = await WorkingSpace.findById(req.params.id);
        if(!workingSpaces){
            return res.status(400).json({success : false});
        }
        res.status(200).json({success:true, count : workingSpaces.length, data : workingSpaces});
    }catch(err){
        res.status(400).json({success : false});
    }

};

exports.createWorkingSpace = async (req, res, next) => {
        const workingSpaces = await WorkingSpace.create(req.body);
        res.status(201).json({
            success:true, 
            data:workingSpaces
        });
};

exports.updateWorkingSpace = async(req, res, next) => {
    try{
        const workingSpaces = await WorkingSpace.findByIdAndUpdate(req.params.id, req.body, {
            new : true,
            runValidators : true
        });

        if(!workingSpaces){
            return res.status(400).json({success : false});
        }
        res.status(200).json({success:true, data : workingSpaces});
    }catch(err){
        res.status(400).json({success : false});
    }

};

exports.deleteWorkingSpace = async (req, res, next) => {
    try{
        const workingSpaces = await WorkingSpace.findById(req.params.id);
        if(!workingSpaces){
            return res.status(400).json({success : false, message : `not found ${req.params.id}`});
        }
        await workingSpaces.deleteOne();
        res.status(200).json({success:true, count : workingSpaces.length, data : workingSpaces});
    }catch(err){
        res.status(400).json({success : false});
    }
};

// exports.getVacCenters = (req,res,next) => {
//     vacCenter.getAll((err, data) => {
//         if(err)
//             res.status(500).send({
//             message:
//                 err.message || "Some error occured while retrieving Vaccine Centers."
//         });
//         else res.send(data);
//     });
// };

