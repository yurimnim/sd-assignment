const solution = (num) => {

    // 피보나치 0과 1을 저장할 객체를 생성
     let count = { 0: 0, 1: 0 };
     let memo = {};

     // 피보나치 함수를 재귀로 구현
     const fibonacci = (n) => {
         if (n === 0) {
             count[0]++;
             return 0;
         } else if (n === 1) {
                count[1]++;
                return 1;
            } else {
                if (memo[n]) {
                    return memo[n];
                }
                memo[n] = fibonacci(n - 1) + fibonacci(n - 2);
                return memo[n];
            }
        };

        fibonacci(num);
        return count; 
     };

