export default function(value) {
  const today = new Date().toISOString().split('T')[0];
  return value === today;
}
