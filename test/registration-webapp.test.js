let assert = require("assert");
let RegistrationFactory = require("../regNumbers");


const pg = require("pg");
const Pool = pg.Pool;

const connectionString = process.env.DATABASE_URL || 'postgresql://codex:kingdelaan@localhost/registration';

const pool = new Pool({
    connectionString
});
describe('The database greeted-webapp', function () {

    beforeEach(async function () {
        // clean the tables before each test run
        await pool.query("delete from regNumbers;");
        // await pool.query("delete from greet_count;");
    });

    it('should  Add to list when you enter registration number ', async function () {
        var getReg = RegistrationFactory();
        await getReg.registration("CA 44865");


        assert.deepEqual(await getReg.getRegistration(), ['CA 44865']);
    });
    it('should  add different numbers to the list when you enter different registration numbers', async function () {
        var getReg = RegistrationFactory();
        await getReg.registration("CA 321541");
        await getReg.registration("CF 321541");

        assert.deepEqual(await getReg.getRegistration(), ["CA 321541", "CF 321541"]);
    });
    // it('should be able to initialize from a list', function () {
    //     var getReg = RegistrationFactory(["CA 321541", "CF 321541"]);
    //     assert.deepEqual( getReg.initialize(), ["CA 321541", "CF 321541"]);
    // });
    it('should not Add to list if the registration  number already exixst    ', async function () {
        var getReg = RegistrationFactory();
        await getReg.registration("CJ 55165");
        await getReg.registration("CF 66622");
        await getReg.registration("CJ 55165");


        assert.deepEqual(await getReg.getRegistration(), ["CF 66622"]);
    });
    it('should  filter the town that is being  selected if Cape Town', async function () {
        var getReg = RegistrationFactory();
        await getReg.registration("CF 45481");
        await getReg.registration("CA 54824");
        await getReg.registration("CA 54865");

        assert.deepEqual(await getReg.filter("CA"), ["CA 54824", "CA 54865"]);
    });
    it('should  filter the town that is being  selected if Bellville  ', async function () {
        var getReg = RegistrationFactory();
        await getReg.registration("CJ 566565");
        await getReg.registration("CY 54531");
        await getReg.registration("CY 51553");

        assert.deepEqual(await getReg.filter("CY"), ["CY 54531", "CY 51553"]);
    });
    it('should  filter the town that is being  if selected Paarl ', async function () {
        var getReg = RegistrationFactory();
        await getReg.registration("CK 54565");
        await getReg.registration("CF 66561");
        await getReg.registration("CF 21564");

        assert.deepEqual(await getReg.filter("CF"), ["CF 66561", "CF 21564"]);
    });
    // it('should not add a registration if you dont enter registration number', async function () {
    //     var getReg = RegistrationFactory();
    //     await getReg.registration("");

    //     assert.deepEqual(await getReg.showError(), "Please enter valid registration");

    // });
    it('should not add an Existing Registration Number', async function () {
        var getReg = RegistrationFactory();
         getReg.registration("CA 98555");
         getReg.registration("CA 98555");

        assert.deepEqual(await getReg.getRegistration(), ["CA 98555"]);
    });
    // it('should not add  Registration Number if is not a valid registration', async function () {
    //     var getReg = RegistrationFactory();
    //      getReg.registration("c24 96575");

    //     assert.deepEqual(await getReg.showError(), "Please enter valid registration");
    // });
});