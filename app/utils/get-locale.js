export default function() {
  return (navigator.languages && navigator.languages.length) ?
    navigator.languages[0] :
    navigator.language;
}
