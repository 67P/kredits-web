
function foo() {
  setTimeout(foo, 2000);
  throw new Error('hallo');

  console.log('still here');
}

setTimeout(foo, 1000);
