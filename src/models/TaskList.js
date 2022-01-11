import { BSON } from 'realm-web'

class TaskList {
  constructor (db) {
    this.db = db
    this.collection = db.collection('tasks')
  }

  create (props) {
    return this.collection.insertOne(props)
  }

  deleteById (id) {
    return this.collection.deleteOne({ _id: BSON.ObjectID(id) })
  }

  findAll (props = {}) {
    return this.collection.find(props)
  }

  findById (id) {
    return this.collection.findOne({ _id: BSON.ObjectID(id) })
  }

  updateById (id, props) {
    return this.collection.updateOne ({ _id: BSON.ObjectID(id) }, props)
  }

  watch (filter, ids) {
    return this.collection.watch(filter, ids)
  }
}

export default TaskList
