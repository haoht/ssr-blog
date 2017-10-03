/**
 * Created by unsad on 2017/5/10.
 */
module.exports = function generateActions(model) {
  return {
    findAll: async function(ctx, next) {
      // next();
      let error, result;
      try {
        let conditions = {};
        let select = {};
        let query = ctx.request.query;
        if (query.conditions) {
          conditions = JSON.parse(query.conditions);
        }
        let builder = model.find(conditions);
        if (query.select) {
          select = JSON.parse(query.select);
          builder = builder.select(select);
        }
        ['limit', 'skip', 'sort', 'count'].forEach(function(key) {
          if (query[key]) {
            let arg = query[key];
            if (key === 'limit' || key === 'skip') {
              arg = parseInt(arg);
            }
            if (key === 'sort') {
              arg = {"_id": "desc"};
            }
            if (key !== 'count') {
              builder[key](arg);
            } else {
              builder[key]();
            }
          }
        });
        result = await builder.exec();
        return ctx.body = result;
      } catch (_error) {
        error = _error;
        return ctx.body = error;
      }
    },
    findById: async function(ctx, next) {
      // await next;
      let error, result;
      try {
        let select = {};
        let query = ctx.request.query;
        let builder = model.findById(ctx.params.id);
        if (query.select) {
          select = JSON.parse(query.select);
          builder = builder.select(select);
        }
        result = await builder.exec();
        let arr = ['prev', 'next'];
        for (let i = 0; i < arr.length; i++) {
          let key = arr[i];
          if (query[key]) {
            result = await result[key]();
          }
        }
        return ctx.body = result;
      } catch (_error) {
        error = _error;
        return ctx.body = error;
      }
    },
    deleteById: async function(ctx, next) {
      // await next;
      let error, result;
      try {
        result = await model.findByIdAndRemove(ctx.params.id).exec();
        return ctx.body = result;
      } catch (_error) {
        error = _error;
        return ctx.body = error;
      }
    },
    replaceById: async function(ctx, next) {
     // await next;
      let error, newDocument, result;
      try {
        await model.findByIdAndRemove(ctx.params.id).exec();
        newDocument = ctx.request.body;
        newDocument._id = ctx.params.id;
        result = await model.create(newDocument);
        return ctx.body = result;
      } catch (_error) {
        error = _error;
        return ctx.body = error;
      }
    },
    updateById: async function(ctx, next) {
      // await next;
      let error, result;
      try {
        result = await model.findByIdAndUpdate(ctx.params.id, ctx.request.body, {new: true}).exec();
        return ctx.body = result;
      } catch (_error) {
        error = _error;
        return ctx.body = error;
      }
    },
    create: async function(ctx, next) {
      await next;
      let error, result;
      try {
        result = await model.create(ctx.request.body);
        ctx.status = 201;
        return ctx.body = result;
      } catch (_error) {
        error = _error;
        return ctx.body = error;
      }
    }
  }
};