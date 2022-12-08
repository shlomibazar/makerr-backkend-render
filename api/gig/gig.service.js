const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const utilService = require('../../services/util.service')
const ObjectId = require('mongodb').ObjectId



async function query(filterBy = { txt, budget: { minPrice: 1, maxPrice: 10 }, label: '' }, sortBy) {
    console.log(filterBy);
    try {
        // const criteria = {
        //     title: { $regex: filterBy.txt, $options: 'i' }
        // }

        const criteria = _buildCriteria(filterBy)
        console.log('criteriaaaaaa',criteria)
        const collection = await dbService.getCollection('gig')
        // if (criteria.title){
        var gigs = await collection.find(criteria).toArray()
        // }
        // if (criteria.budget){
        //     var gigs = await collection.find(criteria.price)
        //     // var gigs = await collection.find({criteria.budget})
        // }
        // const gigs = collection.find({ buyerId: id }).toArray()

        return gigs
    } catch (err) {
        logger.error('cannot find gigs', err)
        throw err
    }
}

async function getById(gigId) {
    try {
        const collection = await dbService.getCollection('gig')
        const gig = collection.findOne({ _id: ObjectId(gigId) })
        return gig
    } catch (err) {
        logger.error(`while finding gig ${gigId}`, err)
        throw err
    }
}

async function remove(gigId) {
    try {
        const collection = await dbService.getCollection('gig')
        await collection.deleteOne({ _id: ObjectId(gigId) })
        return gigId
    } catch (err) {
        logger.error(`cannot remove gig ${gigId}`, err)
        throw err
    }
}

async function add(gig) {
    try {
        const collection = await dbService.getCollection('gig')
        await collection.insertOne(gig)
        return gig
    } catch (err) {
        logger.error('cannot insert gig', err)
        throw err
    }
}

async function update(gig) {
    try {
        const gigToSave = {
            // vendor: gig.vendor,
            price: gig.price
        }
        const collection = await dbService.getCollection('gig')
        await collection.updateOne({ _id: ObjectId(gig._id) }, { $set: gigToSave })
        return gig
    } catch (err) {
        logger.error(`cannot update gig ${gigId}`, err)
        throw err
    }
}

async function addGigMsg(gigId, msg) {
    try {
        msg.id = utilService.makeId()
        const collection = await dbService.getCollection('gig')
        await collection.updateOne({ _id: ObjectId(gigId) }, { $push: { msgs: msg } })
        return msg
    } catch (err) {
        logger.error(`cannot add gig msg ${gigId}`, err)
        throw err
    }
}

async function removeGigMsg(gigId, msgId) {
    try {
        const collection = await dbService.getCollection('gig')
        await collection.updateOne({ _id: ObjectId(gigId) }, { $pull: { msgs: {id: msgId} } })
        return msgId
    } catch (err) {
        logger.error(`cannot add gig msg ${gigId}`, err)
        throw err
    }
}
function _buildCriteria(filterBy) {
    var criteria = {}
    console.log('filterBy sss',filterBy)
    // by text
    // if(filterBy.txt){
    //     const {title} = JSON.parse(filterBy.txt)
    //     const regex = new RegExp(title,'i')
    //     criteria.title = { $regex: regex }
    //     console.log('filterBy.txt',filterBy.txt)
    // }
    criteria.title = { $regex: filterBy.txt, $options: 'i' }

    //by budget
    filterBy.budget = JSON.parse(filterBy.budget)
    if (filterBy.budget?.minPrice) {
        criteria.price = { $gte: filterBy.budget.minPrice, $lte: filterBy.budget.maxPrice }
    }

    //by delivert time 
    filterBy.daysToMake = JSON.parse(filterBy.daysToMake)
    console.log('filterBy.delTime',filterBy.daysToMake)
    if (filterBy.daysToMake) {
        criteria.daysToMake = { $lte: filterBy.daysToMake }
    }

    // filter by labels
    // filterBy.label = JSON.parse(filterBy.label)
    if (filterBy.label){
        console.log('filterBy.labeleeeee',filterBy.label)
            criteria.labels = { $in: [filterBy.label] }
    }
    // console.log('filterBy.labels',filterBy.labels)
    // if (filterBy.labels?.length) {
    // }
    console.log('criteria in the end',criteria)
    return criteria

}
  

module.exports = {
    remove,
    query,
    getById,
    add,
    update,
    addGigMsg,
    removeGigMsg,
}
