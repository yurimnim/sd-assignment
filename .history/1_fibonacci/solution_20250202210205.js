const solution = (num) => {

    // 피보나치 0과 1의 호출 횟수를 저장할 객체를 생성
     let count = { 0: 0, 1: 0 };

     // 이전 결과를 저장할 객체를 생성
     let memo = {};

     // 피보나치 함수를 재귀로 구현
     const fibonacci = (n) => {
         if (n === 0) {
             count[0]++;
             return 0;
         } else if (n === 1) {
                count[1]++;
                return 1;
        } 
        //캐시에 저장된 값이 있으면 반환    
        if (memo[n] !== undefined) return memo[n];
        memo[n] = fibonacci(n - 1) + fibonacci(n - 2);
        return memo[n];
        };

        fibonacci(num);
        return count;
    };

