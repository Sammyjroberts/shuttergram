/**
 * Created by deanroberts on 7/5/17.
 */

class CtrlHelpers {
    static sendJSONError(res, err, errorCode) {
        res.status = errorCode || 400;
        res.json({error: err.toString()});
    }
    static sendJSONResponse(res, content, code) {
        res.status = code || 200;
        res.json({data: content});
    }
}
module.exports = CtrlHelpers;