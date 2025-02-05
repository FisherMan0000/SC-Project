////0.
// function bubble() {
//     let numbers = [77,56,98,42,53,67,11];
//     let length = numbers.length
//     let temp;
//     for(let i = 0; i < length; i++ ){
//         for(let j=0; j < length-1-i; j++ )
//         if(numbers[j] > numbers[j+1]){
//             temp = numbers[j]
//             numbers[j] = numbers[j+1]
//             numbers[j+1] = temp
//         }
//     }
//     console.log("bubble: "+numbers)
// }
// function select() {
//     let numbers = [77,56,98,42,53,67,11];
//     let length = numbers.length
//     let temp;
//     for(let i =0; i < length; i++){
//         let minIndex = i;
//         for(let j = i+1; j < length; j++){
//             if(numbers[j] < numbers[minIndex]){
//                 minIndex = j;
//             }
//         }
//         if(minIndex !== i){
//             temp = numbers[i];
//             numbers[i] = numbers[minIndex];
//             numbers[minIndex] = temp
//         }
//     }
//     console.log("select: "+ numbers)
// }
// bubble()
// select()



////1.
// function calculator(){
//     let operator = prompt("Enter operater as (+ - * /): ");
//     let num1 = parseFloat(prompt("Enter FirstNumber: "));
//     let num2 = parseFloat(prompt("Enter SecondNumber: "));
//     let result;
//     if(operator == '+'){
//         result = num1 + num2;
//     } else if(operator == '-'){
//         result = num1 - num2;
//     } else if(operator == '*'){
//         result = num1 * num2;
//     } else if((operator == '/') && (num2 != 0)){
//         result = num1 / num2;
//     } else{
//         console.log("Check your 'Operator' OR 'Number'");
//     }
//     console.log(`${num1} ${operator} ${num2} = ${result}`)
// }
// calculator();



// //2.
// function countChar(str) {
//     let upper = 0;
//     let lower = 0;
//     let num = 0;
//     let special = 0;
//     for (let char of str) {
//         if (char >= 'A' && char <= 'Z') {
//             upper++;
//         } else if (char >= 'a' && char <= 'z') {
//             lower++;
//         } else if (char >= '0' && char <= '9') {
//             num++
//         } else {
//             special++;
//         }
//     }
//     console.log(`upper: ${upper}, lower: ${lower}, num: ${num}, special: ${special}`)
// }
// countChar("JoJo");



// //3.
// function averageArrey(arr){
//     let length = arr.length;
//     let sum = 0;
//     if(arr.length === 0){
//         console.log("Error: Array is empty!");
//     }
//     for(let i = 0; i < length; i++){
//         sum+=arr[i];
//     }
//     let average = sum/arr.length;
//     console.log(`Average you array: ${average}`);
// }
// averageArrey([]);



// // //4.
// function reverse(str){
//     let reverse = "";
//     for(let i = str.length - 1; i >= 0; i--){
//         reverse += str[i];
//     }
//     console.log(`Reverse: ${reverse}`);
// }
// reverse("Hello");



// // //5.
// function max(arr){
//     let max = arr[0];
//     for(let i = 0; i < arr.length; i++){
//         if(arr[i] < arr[i+1]){
//             max = arr[i+1];
//         }
//     }
//     console.log(`Max: ${max}`);
// }
// max([10,20,30,40]);



// // //6.
// function factorial(num){
//     let sum = 1;
//     for(let i = num; i >=1; i--){
//         sum *=i;
//     }
//     console.log(`Factorial: ${sum}`);
// }
// factorial(10);



// // //7.
// function binarysearch(arr, target){
//     let left = 0;
//     let right = arr.length - 1;
//     while(left <= right){
//         let mid = Math.floor((left + right)/2);
//         if(arr[mid] === target){
//             console.log(`You Index: ${mid}`);
//             return;
//         }else if(arr[mid] > target){
//             right = mid - 1;
//         }else{
//             left = mid + 1;
//         }
//     }
//     console.log("NOT FOUND!!!");
// }
// binarysearch([1, 3, 5, 7, 9, 11, 13, 15], 5);



// // //8.
// function bubblebinasearch(score) {
//     let allScore = [61, 35, 32, 90, 25, 93, 40, 2, 55, 58,
//         1, 67, 58, 8, 77, 4, 89, 90, 75, 65,
//         27, 51, 38, 38, 93, 4, 84, 43, 98, 98,
//         90, 50, 3, 66, 80, 49, 55, 48, 71, 31,
//         69, 1, 57, 81, 78, 60, 73, 72, 4, 69,
//         94, 96, 34, 39, 72];
//     let length = allScore.length;
//     let temp;
//     for(let i = 0; i < length; i++){
//         for(let j = 0; j < length-1-i; j++){
//             if(allScore[j] < allScore[j+1]){
//                 temp = allScore[j];
//                 allScore[j] = allScore[j+1];
//                 allScore[j+1] = temp;
//             }
//         } 
//     }
//     console.log(`Score: ${allScore}`);
//     findrank(score, allScore);
// }
// function findrank(score, allScore){
//     let left = 0;
//     let right = allScore.length - 1;
//     while(left <= right){
//         let mid = Math.floor((left+right)/2);
//         if(allScore[mid] === score){
//             console.log(`RANK: ${mid+1}`);
//             return;
//         }else if(allScore[mid] < score){
//             right = mid-1;
//         }else{
//             left = mid+1;
//         }
//     }
// }
// bubblebinasearch(84)