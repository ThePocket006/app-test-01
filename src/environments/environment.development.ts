export const environment = {
    production: false,
    "build": {
        "builder": "@angular-devkit/build-angular:browser",
        "options": {
           "allowedCommonJsDependencies": [
              "lodash"
           ]
         }
      }
};
