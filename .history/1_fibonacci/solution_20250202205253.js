const solution = (num) => {
     let count = { 0: 0, 1: 0 };

     const fibonacci = (n) => {
         if (n === 0) {
             count[0]++;
             return 0;
         } else if (n === 1) {
                count[1]++;
                return 1;
            } else {
                return fibonacci(n - 1) + fibonacci(n - 2);
            }
        };

        fibonacci(num);
        return count; 
     };

