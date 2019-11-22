let assert = require("assert");
let RegistrationFactory = require("../regNumbers");


const pg = require("pg");
const Pool = pg.Pool;

const connectionString = process.env.DATABASE_URL || 'postgresql://codex:delaan@localhost/registration';

const pool = new Pool({
    connectionString
});
describe('The database greeted-webapp', function(){

    beforeEach(async function(){
        // clean the tables before each test run
        await pool.query("delete from registration;");
        // await pool.query("delete from greet_count;");
    });

    it('should  Add to list when you enter registration number ', function () {
        var getReg = RegistrationFactory();
        getReg.registration("CA 44865");


        assert.deepEqual(getReg.getRegistration(), ['CA 44865']);
    });
    it('should  add different numbers to the list when you enter different registration numbers', function () {
        var getReg = RegistrationFactory();
        getReg.registration("CA 321541");
        getReg.registration("CF 321541");

        assert.deepEqual(getReg.getRegistration(), ["CA 321541", "CF 321541"]);
    });
    it('should be able to initialize from a list', function () {
        var getReg = RegistrationFactory(["CA 321541", "CF 321541"]);
        assert.deepEqual(getReg.initialize(), ["CA 321541", "CF 321541"]);
    });
    it('should not Add to list if the registration  number already exixst    ', function () {
        var getReg = RegistrationFactory();
        getReg.registration("CJ 55165");
        getReg.registration("CF 66622");
        getReg.registration("CJ 55165");


        assert.deepEqual(getReg.getRegistration(), ["CF 66622"]);
    });
    it('should  filter the town that is being  selected if Cape Town', function () {
        var getReg = RegistrationFactory();
        getReg.registration("CF 45481");
        getReg.registration("CA 54824");
        getReg.registration("CA 54865");

        assert.deepEqual(getReg.filter("CA"), ["CA 54824", "CA 54865"]);
    });
    it('should  filter the town that is being  selected if Bellville  ', function () {
        var getReg = RegistrationFactory();
        getReg.registration("CJ 566565");
        getReg.registration("CY 54531");
        getReg.registration("CY 51553");

        assert.deepEqual(getReg.filter("CY"), ["CY 54531", "CY 51553"]);
    });
    it('should  filter the town that is being  if selected Paarl ', function () {
        var getReg = RegistrationFactory();
        getReg.registration("CK 54565");
        getReg.registration("CF 66561");
        getReg.registration("CF 21564");

        assert.deepEqual(getReg.filter("CF"), ["CF 66561", "CF 21564"]);
    });
    it('should not add a registration if you dont enter registration number', function () {
        var getReg = RegistrationFactory();
        getReg.registration("");

        assert.deepEqual(getReg.showError(), "Please enter valid registration");

    });
    it('should not add an Existing Registration Number', function () {
        var getReg = RegistrationFactory();
        getReg.registration("CA 98555");
        getReg.registration("CA 98555");        

        assert.deepEqual(getReg.getRegistration(),["CA 98555"]);

    });
    it('should not add  Registration Number if is not a valid registration', function () {
        var getReg = RegistrationFactory();
        getReg.registration("c24 96575");

        assert.deepEqual(getReg.showError(), "Please enter valid registration");
    });
});