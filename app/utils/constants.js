var Constants = {};

Constants.TIME = {
    THREE_YEARS: 365 * 3,
    MONTHS: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    DAYS_IN_MONTH: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
    WEEK: 7
};

Constants.KEYS = {
    ENTER: 13,
    ESCAPE: 27
};

Constants.SEARCH = {
    CATEGORIES: ['order', 'transaction', 'search', 'customer', 'funding_instrument', 'dispute'],
    SEARCH_TYPES: ['debit', 'credit', 'card_hold', 'refund', "reversal"],
    TRANSACTION_TYPES: ['debit', 'credit', 'hold', 'refund'],
    FUNDING_INSTRUMENT_TYPES: ['bank_account', 'card'],
    DISPUTE_TYPES: ['pending', 'won', 'lost', 'arbitration']
};

//  time in ms to throttle between key presses for search
Constants.THROTTLE = {
    SEARCH: 400,
    REFRESH: 1000
};

Constants.PASSWORD = {
    MIN_CHARS: 6,
    REGEX: /(?=.*[A-z])(?=.*\d)/
};

Constants.MAXLENGTH = {
    DESCRIPTION: 150,
    APPEARS_ON_STATEMENT_BANK_ACCOUNT: 14,
    APPEARS_ON_STATEMENT_CARD: 18
};

Constants.EXPECTED_DAYS_OFFSET = {
    CREDIT_ACH: 1,
    CREDIT_DEBIT_CARD: 2,
    RESTART_VERIFICATION: 3
};

Constants.DATES = {
    CREATED_AT: moment('2011-04-01').startOf('day').toDate(),
    RESULTS_MAX_TIME: moment().add(2, 'hours').startOf('hour').toDate(),
    RESULTS_MIN_TIME: moment().subtract(1, 'months').startOf('hour').toDate()
};


export default Constants;
