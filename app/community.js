const community = {
  win_record: async function (req, db) {
    const User = db.collection("user");
    let result = await User.find().toArray();
    result = result.filter(account => account.user != req.user);
    let records = [];
    result.map(account => {
      account.archive.record.map(r => r.user = account.user);
      records.push(...account.archive.record);
    });
    records = records.filter(r => r.name.includes("通关"));
    return records;
  }
}
module.exports = community;