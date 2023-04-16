export function trim(s){ 
  return ( s || '' ).replace( /^\s+|\s+$/g, '' ); 
}