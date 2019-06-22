const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
  try {
    return await db.collection('index_picture').where({
      imodel: event.imodel
    })
    .update({
      data: {
        pictureId: event.updateData
      },
    })
  } catch(e) {
    console.error(e)
  }
}