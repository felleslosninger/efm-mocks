let sample = {
    "avsender": {
        "adresselinje1": "Første adresselinje",
        "adresselinje2": "Andre adresselinje",
        "adresselinje3": "Tredje adresselinje",
        "navn": "Tester testmann",
        "poststed": "Teststad",
        "postnr": "3333"
    },
    "mottaker": {
        "adresse1": "Første adresselinje",
        "adresse2": "Andre adresselinje",
        "adresse3": null,
        "postnr": "5258",
        "poststed": "Blomsterdalen",
        "navn": "Orgnavn",
        "land": "Norge",
        "orgnr": "999888777", //Eller fnr utfylt
        "fnr": "22334455566"
    },
    "id": "AAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA",
    "tittel": "En tittel",
    "date": 1412668736853, //millis since epoch
    "metadataFraAvleverendeSystem": {
        "sakssekvensnummer": 0,
        "saksaar": 0,
        "journalaar": 0,
        "journalsekvensnummer": 0,
        "journalpostnummer": 0,
        "journalposttype": "U",
        "journalstatus": null,
        "journaldato": null,
        "dokumentetsDato": null,
        "tittel": null,
        "saksBehandler": null,
        "ekstraMetadata": [
            {
                "key": null,
                "value": null
            }
        ]
    },
    "metadataForImport": {
        "sakssekvensnummer": 0,
        "saksaar": 0,
        "journalposttype": null,
        "journalstatus": "I",
        "dokumentetsDato": "2014-10-21T09:30:13.310+02:00", //ISO 8601
        "tittel": null
    },
    "status": "Akseptert",
    "niva": "3",
    "filmetadata": [
        {
            "filnavn": "dokument-d1c6d795.pdf",
            "mimetype": "application/pdf",
            "sha256hash": "caaa6a09e4b5ad571c596dd31fb93689d402834a1b92ff660abeb59c534c088e",
            "dokumentType": null,
            "size": 234563 // 0 hvis ukjent ellers størrelse i bytes.
}
],
"svarSendesTil": {
    "adresse1": "Første adresselinje",
        "adresse2": "Andre adresselinje",
        "adresse3": null,
        "postnr": "5258",
        "poststed": "Blomsterdalen",
        "navn": "Orgnavn",
        "land": "Norge",
        "orgnr": "999888777", //Eller fnr utfylt
        "fnr": "22334455566"
},
"svarPaForsendelse": "BBBBBB-BBBB-CCCC-BBBB-BBBBBBBBBB",
    "forsendelseType": "forsendelseType sett av avsender(heter dokumentType i v5 av servicen)",
    "eksternRef": "en ref fra avsender",
    "downloadUrl": "https://svarut.ks.no/tjenester/svarinn/forsendelse/AAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA"
};


const hentNyeForsendelser = (size) => {
    return [...Array(size)].map(() => {
        return sample;
    })

};

module.exports = hentNyeForsendelser;
