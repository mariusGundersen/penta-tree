export default function intersect(a, b){
  if(a === null) return false;
  if(b.left >= a.right) return false;
  if(b.right <= a.left) return false;
  if(b.top >= a.bottom) return false;
  if(b.bottom <= a.top) return false;
  return true;
}