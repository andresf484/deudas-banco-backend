const srpassword = require('secure-random-password');

const random_secret_key = function random_secret_key() {

        /**/

        let min = 20;
        let max = 40;
    
        //Return integer between min and max (min is inclusive, max is Exclusive)
        const random_number = Math.floor(
            Math.random() * (max - min) + min
        );
        //console.log(random_number);
    
        // Combinar con bcrypt
        const random_string = srpassword.randomString({ 
            characters: [
                srpassword.lower, 
                srpassword.upper, 
                srpassword.digits, 
                /*srpassword.symbols*/
                { characters: srpassword.symbols, exactly: 10 },
            ], /*length: 8*/ length: random_number });
        //console.log(random_password);
    
        /**/

        return random_string;

}

module.exports = {
    random_secret_key
}