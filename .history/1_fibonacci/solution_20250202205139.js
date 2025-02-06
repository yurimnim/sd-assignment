const solution = (num) => {
     let count = { 0: 0, 1: 0 };

     const fibonacci = (n) => {
          count[n] = count[n] || fibonacci(n - 1) + fibonacci(n - 2);
          return count[n];
     };


}