import slugg from 'slugg'
import shortid from 'shortid'

export default function slug(arg){
    let slug = slugg(arg) + "-" + shortid.generate();
    return slug.toLowerCase();
}