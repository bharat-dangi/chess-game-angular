## Instructions to run the Project
1. First of all, clone the project.
2. You should have Angular 16 cli installed.
3. Use node version greater or equal to 18.
4. Run `npm install -f`
5. This `-f` flag is used due to version mismatch of `ngx-chess-board` package and problem in latest package.
6. Create a file for envs as `src/environment/environment.ts`
7. Paste this on `environment.ts`
```
export const environment = {
  production: false,
  firebaseApiKey: '',
  firebaseAuthDomain: '',
  firebaseProjectId: '',
  firebaseBucket: '',
  firebaseMessageId: '',
  firebaseAppId: '',
  databaseURL: '',
};
```
8. Fill with your firebase values if you want to use online mode.
9. If you don't want to use online mode, leave it as it is.
10. At last, run `ng serve` and enjoy the chess game!
