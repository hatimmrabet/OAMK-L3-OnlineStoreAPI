# OnlineStoreAPI

API d'une application de vente en ligne avec Node.js

Lien API: [herokuapp](https://graded-exercice-api.herokuapp.com/)

Documentation : [stoplight](https://hatimmrabet2.stoplight.io/docs/graded-exercice/YXBpOjU2OTU1Njc-e-shopping-api)

    eShopping API for a platform of selling and buying used items
    /users             [GET, POST]
    /users/{username}  [GET]
    /users/login       [GET]
    --- Private endpoints
    /items                 [GET, POST]
    /items/{itemID}        [GET, PUT, DELETE]
    /items/{itemID}/images [POST]
    /items/{itemID}/images/{imageID} [PUT]
    --- Public endpoints
    /items/search-by/category/{categoryName}           [GET]
    /items/search-by/location/{contryCode}/{cityName}  [GET]
    /items/search-by/date/{startDate}/{endDate}        [GET]
