// import fetch from 'node-fetch'

// const baseFacebookUrl = 'https://graph.facebook.com/me?'


// async function fetchFacebookUser(input: FetchFacebookUserInput): Promise<any> {
//     const fields = input.fields.reduce(
//         (prev, curr, index, arr) => {
//             let allFields = prev + curr;
            
//             if (index < arr.length - 1 && arr.length > 1) {
//               allFields += ',';
//             }

//             return allFields;
//           }, ''
//     )
//     return fetch(baseFacebookUrl +
//       ("access_token=" + input.token + "&") +
//       ("fields=" + fields))
// }


//   export interface FetchFacebookUserInput {
//     token: string,
//     fields: string[]
// }