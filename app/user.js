const user = {
  upload: async function (req, db) {
    const User = db.collection("user");
    await User.updateOne({ user: req.user }, { $set: { 
      archive: req.info.archive,
      explore: req.info.explore,
      data: req.info.data,
     } });
    return { msg: "OK" }
  },
  login: async function (req, db) {
    const User = db.collection("user");
    let result = await User.findOne({ user: req.info.user });
    if (result == null) {
      User.insertOne(req.info);
      result = req.info;
    }
    return result;
  }
}

module.exports = user