import { EHandler, Handler } from "../../utils/types";
import model, { MErr } from "../../model";

const get_MetaData: Handler = async (req, res, next) => {
    const { r } = res;

    const [{ code }, meta] = await model.metaData.getMetadata();
    if (code === MErr.NO_ERROR) {
        r.status.OK().message("Successful").data(meta).send();
        return;
    }
    r.pb.ISE().send();

};


export default [get_MetaData as EHandler];
