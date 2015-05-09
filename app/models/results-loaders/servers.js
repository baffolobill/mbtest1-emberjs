import BaseResultsLoader from "./base";
import Server from "../server";

var ServersResultsLoader = BaseResultsLoader.extend({
    resultsType: Server,
});

export default ServersResultsLoader;
