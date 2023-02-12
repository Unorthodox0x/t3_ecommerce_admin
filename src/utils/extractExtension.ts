export default function extractExtention(fname:string):string {
    return fname.slice((fname.lastIndexOf(".") - 1 >>> 0) + 2);
};