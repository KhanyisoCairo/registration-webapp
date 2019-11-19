module.exports = function RegistrationFactory(pool) {
    var regNumbers1 = [];
    var newReg1;
    var regex = /[A-Z]{2}\s[0-9]{3}\s[0-9]{3}/i;

    // async function clear() {

    //     regNumbers1 = [];
    // }

    // async function showError() {
    //     return "Please enter valid registration"
    // }

    async function checkDuplicates(testNum) {
        return regNumbers1.includes(testNum.toUpperCase());
    }
    // async function initialize() {
    //     var initial = [];
    //     initial = ["CA 321541", "CF 321541"];
    //     return initial;
    // }


    async function validate(plate) {
        return regex.test(plate);
    }

    async function addRegistration(loc) {
        console.log(loc, 'test');

        var upCase2 = loc;
        let response;
        var upCase2 = loc.toUpperCase().trim();
        var myTest = regex.test(upCase2);
        store = await pool.query('select * from regNumbers WHERE registration = $1', [upCase2])

        console.log(upCase2)
        if (upCase2.length > 0 && upCase2.length <= 10 && myTest === true) {

            if (upCase2.startsWith("CA ") || upCase2.startsWith("CY ") || upCase2.startsWith("CF ")) {
                if (regNumbers1.includes(upCase2) === false) {
                    regNumbers1.push(upCase2);
                
                if (store.rows.length === 0) {
                    if (regNumbers1[upCase2] === undefined) {
                        regNumbers1[upCase2] = 0;
                        check = await pool.query('select distinct registration, allTowns_id from regNumbers')
                    }

                    if (upCase2.startsWith('CA ')) {
                        await pool.query('insert into regNumbers (registration, allTowns_id) values ($1, $2)', [upCase2, 3]);
                        response = await pool.query('SELECT allTowns.towns, regNumbers.registration FROM allTowns INNER JOIN regNumbers ON allTowns.id = regNumbers.allTowns_id WHERE allTowns.id = 3;')

                    }

                    if (upCase2.startsWith('CY ')) {
                        await pool.query('insert into regNumbers (registration, allTowns_id) values ($1, $2)', [upCase2, 1]);
                        response = await pool.query('SELECT allTowns.towns, regNumbers.registration FROM allTowns INNER JOIN regNumbers ON allTowns.id = regNumbers.allTowns_id WHERE allTowns.id = 1;')

                    }

                    if (upCase2.startsWith('CF ')) {
                        await pool.query('insert into regNumbers (registration, allTowns_id) values ($1, $2)', [upCase2, 2]);
                        response = await pool.query('SELECT allTowns.towns, regNumbers.registration FROM allTowns INNER JOIN regNumbers ON allTowns.id = regNumbers.allTowns_id WHERE allTowns.id = 2;')

                    }
                }
            }
            }
        }
        regNumbers1 = response.rows
    }

    async function getRegistration() {
        // console.log(regNumbers1);
        return regNumbers1

    }

    async function filter(reg) {
        var filterTown = [];
        if (reg === undefined || reg === "") {
            return regNumbers1;
        }
        for (var i = 0; i < regNumbers1.length; i++) {
            if (regNumbers1[i].startsWith(reg)) {
                filterTown.push(regNumbers1[i]);
            }
        }
        return filterTown;
    }

    async function eachReg() {
        return newReg1;
    }

    return {

        registration: addRegistration,
        getRegistration,
        filter,
        eachReg,
        // showError,
        checkExist: checkDuplicates,
        // validate,
        // initialize,
        // clear
    }
}