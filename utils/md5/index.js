import _md5 from './md5.js'
const md5 = function(val){
	return _md5(encodeURIComponent(String(val)))
}
export default md5