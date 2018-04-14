// import * as steem from 'steem'
// import { Promise } from 'es6-promise'

// export function getAccounts(accountNames: string[]): Promise<any[]> {
//     return new Promise<any>((resolve: any, reject: any) => {
//         steem.api.getAccounts(accountNames, (err: any, result: any) => {
//             if (err == null)
//                 resolve(result);
//             else
//                 reject(err);
//         });
//     });
// }

// export function getAccountVotes(accountName: string): Promise<any[]> {
//     return new Promise<any>((resolve: any, reject: any) => {
//         steem.api.getAccountVotes(accountName, (err: any, result: any) => {
//             if (err == null)
//                 resolve(result);
//             else
//                 reject(err);
//         });
//     });
// }