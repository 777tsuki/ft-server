const Koa = require('koa');
const { MongoClient } = require('mongodb');

const handle = {
  user: require("./user"),
  community: require("./community")
}

// 响应
const app = new Koa();
app.use(async (ctx, next) => {
  console.log(ctx.url);
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  if (ctx.request.method == "POST") {
    const mongoClient = new MongoClient("mongodb://localhost:27017/");
    mongoClient.connect();
    const db = mongoClient.db('fantasy_tales');
    let c = await db.listCollections({ name: "user" }).toArray();
    if (c.length != 1) db.createCollection("user")
    let res = await handle[ctx.request.url.split("/")[1]][ctx.request.url.split("/")[2]](await parseData(ctx), db);
    // await mongoClient.close();
    console.log(ctx.url+2);
    ctx.response.status = 200;
    ctx.response.body = res;
  }
});
app.on('error', err => {
  // console.log('server error', err)
});

app.listen(3000);
console.log(`服务端启动好了亲(${3000})`);

function parseData(ctx) {
  return new Promise((resolve, reject) => {
    try {
      let str = ''
      ctx.req.on('data', (data) => {
        str += data;
      })
      ctx.req.addListener('end', () => {
        resolve(JSON.parse(str))
      })
    } catch (err) {
      reject(err)
    }
  });
}