import { PORT, DEV_BASE_URL, PRD_BASE_URL} from "./constants";

// Set baseURL depending on enviornment
var env = process.env.NODE_ENV;
if (env === 'production') {
    baseURL = PRD_BASE_URL;
}else{
    baseURL = DEV_BASE_URL;
}
