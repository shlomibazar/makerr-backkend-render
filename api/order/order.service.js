const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const utilService = require('../../services/util.service')
const ObjectId = require('mongodb').ObjectId



async function query() {
    try {

        const collection = await dbService.getCollection('order')
        var orders = await collection.find({}).toArray()
        // const orders = collection.find({ buyerId: id }).toArray()

        return orders
    } catch (err) {
        logger.error('cannot find orders', err)
        throw err
    }
}

async function getById(orderId) {
    try {
        const collection = await dbService.getCollection('order')
        const order = collection.findOne({ _id: ObjectId(orderId) })
        return order
    } catch (err) {
        logger.error(`while finding order ${orderId}`, err)
        throw err
    }
}

async function remove(orderId) {
    try {
        const collection = await dbService.getCollection('order')
        await collection.deleteOne({ _id: ObjectId(orderId) })
        return orderId
    } catch (err) {
        logger.error(`cannot remove order ${orderId}`, err)
        throw err
    }
}

async function add(order) {
    try {
        console.log('order adddd',order)
        const collection = await dbService.getCollection('order')
        // await collection.insertOne(order)
        await collection.insertOne(order)

        return order
    } catch (err) {
        logger.error('cannot insert order', err)
        throw err
    }
}


async function update(order) {
    try {
        console.log('order update',order)
        const orderToSave = {
            status: order.status,
        }
        const collection = await dbService.getCollection('order')
        await collection.updateOne({ _id: ObjectId(order._id) }, { $set: orderToSave })
        return order
    } catch (err) {
        logger.error(`cannot update order ${orderId}`, err)
        throw err
    }
}

async function addOrderMsg(orderId, msg) {
    try {
        msg.id = utilService.makeId()
        const collection = await dbService.getCollection('order')
        await collection.updateOne({ _id: ObjectId(orderId) }, { $push: { msgs: msg } })
        return msg
    } catch (err) {
        logger.error(`cannot add order msg ${orderId}`, err)
        throw err
    }
}

async function removeOrderMsg(orderId, msgId) {
    try {
        const collection = await dbService.getCollection('order')
        await collection.updateOne({ _id: ObjectId(orderId) }, { $pull: { msgs: {id: msgId} } })
        return msgId
    } catch (err) {
        logger.error(`cannot add order msg ${orderId}`, err)
        throw err
    }
}
function _buildCriteria(filterBy) {
    const criteria = {}
  
    // by name
    // const regex = new RegExp(filterBy.name, 'i')
    // criteria.name = { $regex: regex }
  
    // filter by inStock
    // if (filterBy.inStock) {
    //   criteria.inStock = { $eq: JSON.parse(filterBy.inStock) }
    // }
  
    // filter by labels
    // if (filterBy.labels?.length) {
    //   criteria.labels = { $in: filterBy.labels }
    // }
    // return criteria
  
  }
  

module.exports = {
    remove,
    query,
    getById,
    add,
    update,
    addOrderMsg,
    removeOrderMsg,
}
