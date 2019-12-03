module.exports = function RegistrationFactory(pool) {
    var regNumbers1 = [];
    var store;
    var response;
    var response2;
    var response3;
    var final = [];
    var regex = /[A-Z]{2}\s[0-9]{3}\s[0-9]{3}/i;

    async function checkDuplicates() {
        return store.rows
    }

    async function addRegistration(loc) {
        console.log(loc, 'test');

        var upCase2 = loc;
        var upCase2 = loc.toUpperCase().trim();
        var myTest = regex.test(upCase2);
        store = await pool.query('select * from regNumbers WHERE registration = $1', [upCase2])

        console.log(upCase2)
        if (upCase2.length > 0 && upCase2.length <= 10 && myTest === true) {

            if (upCase2.startsWith("CA ") || upCase2.startsWith("CY ") || upCase2.startsWith("CF ")) {
                console.log("log 1");

                if (regNumbers1.includes(upCase2) === false) {
                    console.log("log 2");
                    regNumbers1.push(upCase2);
                    console.log(regNumbers1, "line 47");

                    if (store.rows.length === 0) {
                        console.log("log 3");
                        if (regNumbers1[upCase2] === undefined) {
                            regNumbers1[upCase2] = 0;
                            check = await pool.query('select distinct registration, allTowns_id from regNumbers')
                        }

                        if (upCase2.startsWith('CA ')) {
                            await pool.query('insert into regNumbers (registration, allTowns_id) values ($1, $2)', [upCase2, 3]);
                            response = await pool.query('SELECT allTowns.towns, regNumbers.registration FROM allTowns INNER JOIN regNumbers ON allTowns.id = regNumbers.allTowns_id WHERE allTowns.id = 3;')
                            console.log(response.rows)
                            final = response.rows
                        }

                        if (upCase2.startsWith('CY ')) {
                            await pool.query('insert into regNumbers (registration, allTowns_id) values ($1, $2)', [upCase2, 1]);
                            response2 = await pool.query('SELECT allTowns.towns, regNumbers.registration FROM allTowns INNER JOIN regNumbers ON allTowns.id = regNumbers.allTowns_id WHERE allTowns.id = 1;')
                            final = response2.rows
                        }

                        if (upCase2.startsWith('CF ')) {
                            await pool.query('insert into regNumbers (registration, allTowns_id) values ($1, $2)', [upCase2, 2]);
                            response3 = await pool.query('SELECT allTowns.towns, regNumbers.registration FROM allTowns INNER JOIN regNumbers ON allTowns.id = regNumbers.allTowns_id WHERE allTowns.id = 2;')
                            final = response3.rows
                        }
                    } else {
                        response = store
                    }
                }
            }
        }
        regNumbers1 = response.rows
    }
    async function getRegistration() {
        store = await pool.query('select * from regNumbers')
        return store.rows
    }

    async function filter(reg) {

        if (reg === '') {
            check = await pool.query('select distinct registration, allTowns_id from regNumbers')
            final = check.rows
        }
        if (reg === 'CA ') {
            await pool.query('insert into regNumbers (registration, allTowns_id) values ($1, $2)', [upCase2, 3]);
            response = await pool.query('SELECT allTowns.towns, regNumbers.registration FROM allTowns INNER JOIN regNumbers ON allTowns.id = regNumbers.allTowns_id WHERE allTowns.id = 3;')
            final = response.rows
        }

        if (reg === 'CY ') {
            await pool.query('insert into regNumbers (registration, allTowns_id) values ($1, $2)', [upCase2, 1]);
            response2 = await pool.query('SELECT allTowns.towns, regNumbers.registration FROM allTowns INNER JOIN regNumbers ON allTowns.id = regNumbers.allTowns_id WHERE allTowns.id = 1;')
            final = response2.rows
        }
        if (reg === 'CF ') {
            await pool.query('insert into regNumbers (registration, allTowns_id) values ($1, $2)', [upCase2, 2]);
            response3 = await pool.query('SELECT allTowns.towns, regNumbers.registration FROM allTowns INNER JOIN regNumbers ON allTowns.id = regNumbers.allTowns_id WHERE allTowns.id = 2;')
            final = response3.rows
        }
    }

    async function finalResult() {
        return final
    }
    async function resetDb() {
        regNumbers1 = [];
        final = [];
        let reset = await pool.query('TRUNCATE table regNumbers restart identity')
        return reset.rows

    }
    return {

        registration: addRegistration,
        getRegistration,
        filter,
        checkExist: checkDuplicates,
        finalResult,
        resetDb
    }
}