import FormValidator from './FormValidator';
const formValidator = new FormValidator();

formValidator.addListener(() => {});


// Testing prefilled form.
const preFilledformValidator = new FormValidator();
preFilledformValidator.addListener(() => {});
preFilledformValidator.registerField('email', 'isEmail', true, 'adamgullerud@gmail.com', () => {});

test('Prefilled, valid field results in the value being returned.', () => {
    let fieldValue = preFilledformValidator.getData().get('email');
    expect(fieldValue.value).toBe('adamgullerud@gmail.com');
});

test('Prefilled, valid field results in the field being valid.', () => {
    let fieldValue = preFilledformValidator.getData().get('email');
    expect(fieldValue.isValid).toBe(true);
});




// Testing email
formValidator.registerField('email', 'isEmail', true, '', () => {});

test('Invalid email results in invalid form field.', (done) => {
    function callback(isValid) {
        expect(isValid).toBe(false);
        done();
    }
    formValidator.updateField('email', 'adamatgmail.com', callback);
});


test('Valid email results in valid form field.', (done) => {
    function callback(isValid) {
        expect(isValid).toBe(true);
        done();
    }
    formValidator.updateField('email', 'adam@gmail.com', callback);
});

// Testing email END

// Testing REQUIRED fields

formValidator.registerField('contactName', '', true, '', () => {});

test('Field that IS required, that has NO validations, with NO input, results in INVALID field', (done) => {
    function callback(isValid) {
        expect(isValid).toBe(false);
        done();
    }
    formValidator.updateField('contactName', 'ltkmglmker', () => '');
    formValidator.updateField('contactName', '', callback);

});



formValidator.registerField('lastName', 'isURL', true, '', () => {});

test('Field that IS required, that HAS validations, with NO input, results in INVALID field', (done) => {
    function callback(isValid) {
        expect(isValid).toBe(false);
        done();
    }
    formValidator.updateField('lastName', '', callback);
});


// Testing NOT required fields
formValidator.registerField('website', 'isURL', false, '', () => {});

test('Field that is NOT required, that has validations, with no input, results in valid field', (done) => {
    function callback(isValid) {
        expect(isValid).toBe(true);
        done();
    }
    formValidator.updateField('website', '', callback);
});


test('Field that is NOT required, WITH validations, with INCORRECT input, results in INVALID field', (done) => {
    function callback(isValid) {
        expect(isValid).toBe(false);
        done();
    }
    formValidator.updateField('website', 'http://', callback);
});


test('Field that is NOT required, WITH validations, with CORRECT input, results in INVALID field', (done) => {
    function callback(isValid) {
        expect(isValid).toBe(true);
        done();
    }
    formValidator.updateField('website', 'http://db.no', callback);
});


test('Field that is NOT required, WITH validations, with CORRECT input, results in INVALID field', (done) => {
    function callback(isValid) {
        expect(isValid).toBe(true);
        done();
    }
    formValidator.updateField('website', 'http://db.no', callback);
});


// Testing NOT required fields END
