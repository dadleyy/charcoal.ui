import resource from "charcoal/services/resource";
import config from "charcoal/config/environment";

export default resource(`${config.api_root}/games`);
